(function (deku, parser) {
  var compiler = (function () {
    var Compiler;
    var JsCompiler;

    Compiler = function (context) {
      this.opcodes = [];
      this.context = context || {
        all: []
      };
      this.index = this.context.all.length;
      this.name = 'program' + this.index;
      this.context.all.push(this);
    };

    Compiler.OPCODE_PARAM_LENGTH_MAP = {
      op_append: 0,
      op_appendContent: 1,
      op_applyProcessor: 2,
      op_applyPrePipeline: 1,
      op_applyPostPipeline: 1,
      op_escape: 0,
      op_escapeAndAppendContent: 1,
      op_evaluateValue: 1,
      op_lookupHead: 4,
      op_lookupTail: 2,
      op_invokePartial: 1,
      op_invokeProgram: 1,
      op_invokeProgramInverse: 1
    };

    Compiler.prototype = {

      compile: function (program) {
        var statements = program.statements;
        var statement;
        var i;
        var len = statements.length;
        var isNextConsumed;
        for (i = 0; i < len; i++) {
          statement = statements[i];
          isNextConsumed = this[statement.type](statement, statements[i + 1]);
          if (isNextConsumed) {
            i++;
          }
        }
        return this;
      },

      compileProgram: function (program) {
        var compiler = new Compiler(this.context);
        return compiler.compile(program);
      },

      pushOpcode: function (name, p1, p2, p3, p4) {
        this.opcodes.push(name);
        if (p1 !== void 0) {
          this.opcodes.push(p1);
        }
        if (p2 !== void 0) {
          this.opcodes.push(p2);
        }
        if (p3 !== void 0) {
          this.opcodes.push(p3);
        }
        if (p4 !== void 0) {
          this.opcodes.push(p4);
        }
      },

      type_name: function (node, varType) {
        var segments = node.segments;
        var i;
        var len = segments.length;
        this.pushOpcode('op_lookupHead', segments[0], varType, node.contextType, node.contextIndex);
        for (i = 1; i < len; i++) {
          this.pushOpcode('op_lookupTail', segments[i], varType);
        }
      },

      pipeline: function (node) {
        var processors = node.processors;
        var i;
        var len = processors.length;
        var name = node.name;
        var path = name.path;
        var processor;
        this.type_name(name, 'value');
        this.pushOpcode('op_evaluateValue', path);
        this.pushOpcode('op_applyPrePipeline', path);
        for (i = 0; i < len; i++) {
          processor = processors[i];
          this.type_name(processor, 'processor');
          this.pushOpcode('op_applyProcessor', processor.path, path);
        }
        this.pushOpcode('op_applyPostPipeline', path);
      },

      type_block : function (node) {
        var environment = this.compileProgram(node.program);
        this.pipeline(node);
        this.pushOpcode('op_invokeProgram', environment.name);
        this.pushOpcode('op_append');
      },

      type_inverse: function (node) {
        var environment = this.compileProgram(node.program);
        this.pipeline(node);
        this.pushOpcode('op_invokeProgramInverse', environment.name);
        this.pushOpcode('op_append');
      },

      type_partial: function (node) {
        this.type_name(node.context, 'value');
        this.pushOpcode('op_invokePartial', node.name.path);
        this.pushOpcode('op_append');
      },

      type_mustache: function (node, next) {
        this.pipeline(node);
        if (node.escape) {
          if (next && next.type === 'type_content') {
            this.pushOpcode('op_escapeAndAppendContent', next.content);
            return true;
          } else {
            this.pushOpcode('op_escape');
          }
        }
        this.pushOpcode('op_append');
        return false;
      },

      type_content: function (node) {
        this.pushOpcode('op_appendContent', node.content);
      },

      type_comment: function () {
      }
    };

    JsCompiler = function (environment) {
      this.environment = environment;
      this.name = environment.name;
      this.allEnvironments = environment.context.all;
      this.source = [''];
    };

    JsCompiler.prototype = {

      lookup: function (contextName, propName) {
        return contextName + '["' + propName + '"]';
      },

      appendToBuffer: function (s) {
        this.source.push('buffer += ' + s + ';');
      },

      quoteString: (function () {
        var map =  {
          '\\': '\\\\',
          '"': '\\"',
          '\n': '\\n',
          '\r': '\\r'
        };
        return function (value) {
          return '"' + value.replace(/[\\"\n\r]/g, function(s) {
            return map[s];
          }) + '"';
        }
      }()),

      compileDescendants: function () {
        var result = [];
        var allEnvironments = this.allEnvironments;
        var i;
        var len = allEnvironments.length;
        var environment;
        var jsc;
        var subProgram;
        for (i = 1; i < len; i++) {
          environment = allEnvironments[i];
          jsc = new JsCompiler(environment);
          subProgram = jsc.compileSubProgram();
          result.push(subProgram);
        }
        return result;
      },

      execOpcodes: function () {
        var opcodes = this.environment.opcodes;
        var i;
        var len = opcodes.length;
        var opcode;
        var j;
        var paramLen;
        var params;
        for (i = 0; i < len;) {
          opcode = opcodes[i];
          params = [];
          paramLen = Compiler.OPCODE_PARAM_LENGTH_MAP[opcode];
          for (i++, j = 0; i < len && j < paramLen; i++, j++) {
            params.push(opcodes[i]);
          }
          this[opcode].apply(this, params);
        }
      },

      generate: function (subPrograms, asString) {
        var body;
        this.source[0] = this.source[0] + 'var self = this, value, valueContext, buffer = "", contextStack = [context], index, hasNext, ' +
          'escape = this.escape, compile = this.compile, handleBlock = this.handleBlock, handleInverse = this.handleInverse, ' +
          'noSuchValue = this.noSuchValue, noSuchPartial = this.noSuchPartial, noSuchProcessor = this.noSuchProcessor, ' +
          'prePipeline = this.prePipeline, postPipeline = this.postPipeline, processors = this.processors, processor, processorContext, templates = this.templates, partial;' +
          '\n' + subPrograms.join('\n');
        this.source.push('return buffer;');
        body = '  ' + this.source.join('\n  ');
        if (asString) {
          return 'function (context) {\n' + body + '\n' + '}';
        } else {
          return new Function('context', body);
        }
      },

      compile: function (asString) {
        var subPrograms = this.compileDescendants();
        this.execOpcodes();
        return this.generate(subPrograms, asString);
      },

      generateSubProgram: function () {
        var body;
        var indent = '  ';
        this.source[0] = this.source[0] + 'var value, valueContext, buffer = "";';
        this.source.push('return buffer;');
        body = indent + indent + this.source.join('\n  ' + indent);
        return indent + 'function ' + this.name + ' (context, contextStack, index, hasNext) {\n' + body + '\n'+ indent + '}';
      },

      compileSubProgram: function () {
        this.execOpcodes();
        return this.generateSubProgram();
      },

      op_invokeProgram: function (programName) {
        this.source.push('value = handleBlock(context, contextStack, value, ' + programName + ');');
      },

      op_invokeProgramInverse: function (programName) {
        this.source.push('value = handleInverse(context, contextStack, value, ' + programName + ');');
      },

      op_invokePartial: function (partialName) {
        this.source.push('partial = ' + this.lookup('templates', partialName) + ';');
        this.source.push('if (partial == null) { value = noSuchPartial("' + partialName + '"); }');
        this.source.push('else { if (typeof partial !== "function") { partial = compile(partial); templates["' + partialName + '"] = partial; }');
        this.source.push('  value = partial.call(self, value); }');
      },

      op_applyProcessor: function (processorName, valueName) {
        this.source.push('if (typeof processor === "function") { value = processor.call(processorContext, value, "' + valueName + '", index, hasNext); }');
        this.source.push('else { processor = ' + this.lookup('processors', processorName) + ';');
        this.source.push('  if (typeof processor === "function") { value = processor.call(context, value, "' + valueName + '", index, hasNext); }');
        this.source.push('  else { value = noSuchProcessor.call(context, "' + processorName + '", value, "' + valueName + '"); }}');
      },

      op_applyPrePipeline: function (valueName) {
        this.source.push('value = prePipeline.call(context, value, "' + valueName + '", index, hasNext);');
      },

      op_applyPostPipeline: function (valueName) {
        this.source.push('value = postPipeline.call(context, value, "' + valueName + '", index, hasNext);');
      },

      op_escape: function () {
        this.source.push('value = escape(value);');
      },

      op_escapeAndAppendContent: function (content) {
        content = this.quoteString(content);
        this.appendToBuffer('escape(value) + ' + content);
      },

      op_append: function () {
        this.appendToBuffer('value');
      },

      op_appendContent: function (content) {
        content = this.quoteString(content);
        this.appendToBuffer(content);
      },

      op_evaluateValue: function (name) {
        this.source.push('if (typeof value === "function") { value = value.call(valueContext); }');
        this.source.push('else if (value === void 0) { value = noSuchValue.call(context, "' + name + '"); }');
      },

      variableContextMap: {
        'value': 'valueContext',
        'processor': 'processorContext'
      },
      
      variableMap: {
        'value': 'value',
        'processor': 'processor'        
      },
      
      op_lookupHead: function (name, variableType, contextType, contextIndex) {
        var variableContext = this.variableContextMap[variableType];
        var variable = this.variableMap[variableType];
        this.source.push(variableContext + ' = context;');
        switch (contextType) {
          case 'root':
            this.source.push(variable + ' = contextStack[0];');
            break;
          case 'index':
            this.source.push(variable + ' = index;');
            break;
          case 'hasNext':
            this.source.push(variable + ' = hasNext;');
            break;
          case 'ref':
            this.source.push(variable + ' = contextStack[contextStack.length - 1 - ' + contextIndex + '];');
            break;
          case 'default':
            this.source.push(variable + ' = ' + this.lookup(variableContext, name) + ';');
            break;
          default:
            throw new Error('unreachable.');
        }
      },

      op_lookupTail: function (name, varType) {
        var localContext = this.variableContextMap[varType];
        var local = this.variableMap[varType];
        this.source.push('if (' + local + ' != null) { ' + localContext + ' = ' + local + '; ' + local + ' = ' + this.lookup(local, name) + ';}');
      }
    };

    var parse = function (template) {
      try {
        return parser.parse(template);
      } catch (e) {
        if (e.name === 'SyntaxError') {
          throw new Error(e.message + ' line=' + e.line + '. column=' + e.column + '.\n' + template);
        }
        throw e;
      }
    };

    var compile = function (source, asString) {
      var ast = parse(source);
      var compiler = new Compiler();
      var environment = compiler.compile(ast);
      var jsCompiler = new JsCompiler(environment);
      return jsCompiler.compile(asString);
    };

    return {
      Compiler: Compiler,
      JsCompiler: JsCompiler,
      parse: parse,
      compile: compile
    };
  }());
  
  if (typeof module !== 'undefined') {
    module.exports = compiler;
  } else {
    deku.internal.compiler = compiler;
  }

}(typeof module !== 'undefined' ? {} : deku,
  typeof module !== 'undefined' ? require('./parser') : deku.internal.parser
));