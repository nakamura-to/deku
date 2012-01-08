(function (deku, parser) {
  var compiler = (function () {
    var Compiler;
    var JsCompiler;

    Compiler = function (context) {
      this.opcodes = [];
      this.context = context || {
        allEnvironments: []
      };
      this.index = this.context.allEnvironments.length;
      this.name = 'program' + this.index;
      this.context.allEnvironments.push(this);
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
      op_lookupFromContext: 2,
      op_lookupFromTmp: 2,
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

      pushOpcode: function (name, param1, param2) {
        this.opcodes.push(name);
        if (param1 !== void 0) {
          this.opcodes.push(param1);
        }
        if (param2 !== void 0) {
          this.opcodes.push(param2);
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
        var name = node.name;
        var context = node.context;
        if (context) {
          this.type_name(context, 'value');
        } else {
          this.type_name({path: '$this', segments: ['$this']}, 'value');
        }
        this.pushOpcode('op_invokePartial', name.path);
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
      },

      type_name: function (node, varType) {
        var segments = node.segments;
        var i;
        var len = segments.length;
        this.pushOpcode('op_lookupFromContext', segments[0], varType);
        for (i = 1; i < len; i++) {
          this.pushOpcode('op_lookupFromTmp', segments[i], varType);
        }
      }
    };

    JsCompiler = function (environment) {
      this.environment = environment;
      this.name = environment.name;
      this.allEnvironments = environment.context.allEnvironments;
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
          try {
          this[opcode].apply(this, params);
          } catch (e) {
            throw Error(opcode);
          }
        }
      },

      generate: function (subPrograms, asString) {
        var body;
        this.source[0] = this.source[0] + 'var tmp, tmpContext, buffer = "", contextStack = [context], index, hasNext, templateContext = this, ' +
          'escape = this.escape, compile = this.compile, handleBlock = this.handleBlock, handleInverse = this.handleInverse, ' +
          'noSuchValue = this.noSuchValue, noSuchPartial = this.noSuchPartial, noSuchProcessor = this.noSuchProcessor, ' +
          'prePipeline = this.prePipeline, postPipeline = this.postPipeline, processors = this.processors, processor, processorContext, templates = this.templates, partial;' +
          '\n\n' + subPrograms.join('\n\n') + '\n';
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
        this.source[0] = this.source[0] + 'var tmp, tmpContext, buffer = "";';
        this.source.push('return buffer;');
        body = '  ' + indent + this.source.join('\n  ' + indent);
        return indent + 'function ' + this.name + ' (context, contextStack, index, hasNext) {\n' + body + '\n'+ indent + '}';
      },

      compileSubProgram: function () {
        this.execOpcodes();
        return this.generateSubProgram();
      },

      op_invokeProgram: function (programName) {
        this.source.push('tmp = handleBlock(context, contextStack, tmp, ' + programName + ');');
      },

      op_invokeProgramInverse: function (programName) {
        this.source.push('tmp = handleInverse(context, contextStack, tmp, ' + programName + ');');
      },

      op_invokePartial: function (partialName) {
        this.source.push('partial = ' + this.lookup('templates', partialName) + ';');
        this.source.push('if (partial == null) { tmp = noSuchPartial("' + partialName + '"); }');
        this.source.push('else { if (typeof partial !== "function") { partial = compile(partial); templates["' + partialName + '"] = partial; }');
        this.source.push('  tmp = partial.call(templateContext, tmp); }');
      },

      op_applyProcessor: function (processorName, valueName) {
        this.source.push('if (typeof processor === "function") { tmp = processor.call(processorContext, tmp, "' + valueName + '", index, hasNext); }');
        this.source.push('else { processor = ' + this.lookup('processors', processorName) + ';');
        this.source.push('  if (typeof processor === "function") { tmp = processor.call(context, tmp, "' + valueName + '", index, hasNext); }');
        this.source.push('  else { tmp = noSuchProcessor.call(context, "' + processorName + '", tmp, "' + valueName + '"); }}');
      },

      op_applyPrePipeline: function (valueName) {
        this.source.push('tmp = prePipeline.call(context, tmp, "' + valueName + '", index, hasNext);');
      },

      op_applyPostPipeline: function (valueName) {
        this.source.push('tmp = postPipeline.call(context, tmp, "' + valueName + '", index, hasNext);');
      },

      op_escape: function () {
        this.source.push('tmp = escape(tmp);');
      },

      op_escapeAndAppendContent: function (content) {
        content = this.quoteString(content);
        this.appendToBuffer('escape(tmp) + ' + content);
      },

      op_append: function () {
        this.appendToBuffer('tmp');
      },

      op_appendContent: function (content) {
        content = this.quoteString(content);
        this.appendToBuffer(content);
      },

      op_evaluateValue: function (name) {
        this.source.push('if (typeof tmp === "function") { tmp = tmp.call(tmpContext); }');
        this.source.push('else if (tmp === void 0) { tmp = noSuchValue.call(context, "' + name + '"); }');
      },

      localContextVarMap: {
        'value': 'tmpContext',
        'processor': 'processorContext'
      },
      
      localVarMap: {
        'value': 'tmp',
        'processor': 'processor'        
      },
      
      op_lookupFromContext: function (name, varType) {
        var localContext = this.localContextVarMap[varType];
        var local = this.localVarMap[varType];
        this.source.push(localContext + ' = context;');
        switch (name) {
          case '$root':
            this.source.push(local + ' = contextStack[0];');
            break;
          case '$parent':
            this.source.push(local + ' = contextStack[contextStack.length - 2];');
            break;
          case '$this':
            this.source.push(local + ' = context;');
            break;
          case '$index':
            this.source.push(local + ' = index;');
            break;
          case '$hasNext':
            this.source.push(local + ' = hasNext;');
            break;
          default:
            this.source.push(local + ' = ' + this.lookup('context', name) + ';');
        }
      },

      op_lookupFromTmp: function (name, varType) {
        var localContext = this.localContextVarMap[varType];
        var local = this.localVarMap[varType];
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