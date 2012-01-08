TestCase('compiler', {

  'setUp': function () {
    this.parser = deku.internal.parser;
    this.compiler = deku.internal.compiler;
    this.templateContext = {
      escape: deku.internal.core.escape,
      compile: deku.internal.core.compile,
      handleBlock: deku.internal.core.handleBlock,
      handleInverse: deku.internal.core.handleInverse,
      templates: {},
      processors: {},
      prePipeline : function (value) {
        return value;
      },
      postPipeline: function (value) {
        return value == null ? '': value;
      },
      noSuchValue: function (valueName) {
        throw new Error('The value "' + valueName + '" is not found.');
      },
      noSuchPartial: function (partialName) {
        throw new Error('The partial "' + partialName + '" is not found.');
      },
      noSuchProcessor: function (processorName, value, valueName) {
        throw new Error('The processor "' + processorName + '" for the value "' + valueName + '" is not found.');
      }
    };
  },

  'test Compiler: name': function () {
    var ast = this.parser.parse('{{hoge}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);

    assertSame(11, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('op_evaluateValue', env.opcodes[3]);
    assertSame('hoge', env.opcodes[4]);
    assertSame('op_applyPrePipeline', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPostPipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_escape', env.opcodes[9]);
    assertSame('op_append', env.opcodes[10]);
  },

  'test Compiler: name: processor': function () {
    var ast = this.parser.parse('{{hoge|aaa}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);

    assertSame(17, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('op_evaluateValue', env.opcodes[3]);
    assertSame('hoge', env.opcodes[4]);
    assertSame('op_applyPrePipeline', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_lookupFromContext', env.opcodes[7]);
    assertSame('aaa', env.opcodes[8]);
    assertSame('processor', env.opcodes[9]);
    assertSame('op_applyProcessor', env.opcodes[10]);
    assertSame('aaa', env.opcodes[11]);
    assertSame('hoge', env.opcodes[12]);
    assertSame('op_applyPostPipeline', env.opcodes[13]);
    assertSame('hoge', env.opcodes[14]);
    assertSame('op_escape', env.opcodes[15]);
    assertSame('op_append', env.opcodes[16]);
  },

  'test Compiler: name: multi processors': function () {
    var ast = this.parser.parse('{{hoge|aaa|bbb}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);

    assertSame(23, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('op_evaluateValue', env.opcodes[3]);
    assertSame('hoge', env.opcodes[4]);
    assertSame('op_applyPrePipeline', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_lookupFromContext', env.opcodes[7]);
    assertSame('aaa', env.opcodes[8]);
    assertSame('processor', env.opcodes[9]);
    assertSame('op_applyProcessor', env.opcodes[10]);
    assertSame('aaa', env.opcodes[11]);
    assertSame('hoge', env.opcodes[12]);
    assertSame('op_lookupFromContext', env.opcodes[13]);
    assertSame('bbb', env.opcodes[14]);
    assertSame('processor', env.opcodes[15]);
    assertSame('op_applyProcessor', env.opcodes[16]);
    assertSame('bbb', env.opcodes[17]);
    assertSame('hoge', env.opcodes[18]);
    assertSame('op_applyPostPipeline', env.opcodes[19]);
    assertSame('hoge', env.opcodes[20]);
    assertSame('op_escape', env.opcodes[21]);
    assertSame('op_append', env.opcodes[22]);
  },

  'test Compiler: name: pathSegments': function () {
    var ast = this.parser.parse('{{aaa.bbb.ccc}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);

    assertSame(17, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('aaa', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('op_lookupFromTmp', env.opcodes[3]);
    assertSame('bbb', env.opcodes[4]);
    assertSame('value', env.opcodes[5]);
    assertSame('op_lookupFromTmp', env.opcodes[6]);
    assertSame('ccc', env.opcodes[7]);
    assertSame('value', env.opcodes[8]);
    assertSame('op_evaluateValue', env.opcodes[9]);
    assertSame('aaa.bbb.ccc', env.opcodes[10]);
    assertSame('op_applyPrePipeline', env.opcodes[11]);
    assertSame('aaa.bbb.ccc', env.opcodes[12]);
    assertSame('op_applyPostPipeline', env.opcodes[13]);
    assertSame('aaa.bbb.ccc', env.opcodes[14]);
    assertSame('op_escape', env.opcodes[15]);
    assertSame('op_append', env.opcodes[16]);
  },

  'test Compiler: block': function () {
    var ast = this.parser.parse('{{#hoge}}abc{{/hoge}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    var descendant;

    assertSame(2, env.context.allEnvironments.length);
    assertSame(env, env.context.allEnvironments[0]);
    assertSame(12, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('op_evaluateValue', env.opcodes[3]);
    assertSame('hoge', env.opcodes[4]);
    assertSame('op_applyPrePipeline', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPostPipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_invokeProgram', env.opcodes[9]);
    assertSame('program1', env.opcodes[10]);
    assertSame('op_append', env.opcodes[11]);

    descendant = env.context.allEnvironments[1];
    assertSame(2, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('abc', descendant.opcodes[1]);
  },

  'test Compiler: block: sibling': function () {
    var ast = this.parser.parse('{{#hoge}}abc{{/hoge}}{{#foo}}def{{/foo}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    var descendant;

    assertSame(3, env.context.allEnvironments.length);
    assertSame(env, env.context.allEnvironments[0]);
    assertSame(24, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('op_evaluateValue', env.opcodes[3]);
    assertSame('hoge', env.opcodes[4]);
    assertSame('op_applyPrePipeline', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPostPipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_invokeProgram', env.opcodes[9]);
    assertSame('program1', env.opcodes[10]);
    assertSame('op_append', env.opcodes[11]);
    assertSame('op_lookupFromContext', env.opcodes[12]);
    assertSame('foo', env.opcodes[13]);
    assertSame('value', env.opcodes[14]);
    assertSame('op_evaluateValue', env.opcodes[15]);
    assertSame('foo', env.opcodes[16]);
    assertSame('op_applyPrePipeline', env.opcodes[17]);
    assertSame('foo', env.opcodes[18]);
    assertSame('op_applyPostPipeline', env.opcodes[19]);
    assertSame('foo', env.opcodes[20]);
    assertSame('op_invokeProgram', env.opcodes[21]);
    assertSame('program2', env.opcodes[22]);
    assertSame('op_append', env.opcodes[23]);

    descendant = env.context.allEnvironments[1];
    assertSame(2, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('abc', descendant.opcodes[1]);

    descendant = env.context.allEnvironments[2];
    assertSame(2, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('def', descendant.opcodes[1]);
  },

  'test Compiler: block: nesting': function () {
    var ast = this.parser.parse('{{#hoge}}abc{{#foo}}def{{/foo}}ghi{{/hoge}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    var descendant;

    assertSame(3, env.context.allEnvironments.length);
    assertSame(env, env.context.allEnvironments[0]);
    assertSame(12, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);    
    assertSame('op_evaluateValue', env.opcodes[3]);
    assertSame('hoge', env.opcodes[4]);
    assertSame('op_applyPrePipeline', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPostPipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_invokeProgram', env.opcodes[9]);
    assertSame('program1', env.opcodes[10]);
    assertSame('op_append', env.opcodes[11]);
    
    descendant = env.context.allEnvironments[1];
    assertSame(16, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('abc', descendant.opcodes[1]);
    assertSame('op_lookupFromContext', descendant.opcodes[2]);
    assertSame('foo', descendant.opcodes[3]);
    assertSame('value', descendant.opcodes[4]);
    assertSame('op_evaluateValue', descendant.opcodes[5]);
    assertSame('foo', descendant.opcodes[6]);
    assertSame('op_applyPrePipeline', descendant.opcodes[7]);
    assertSame('foo', descendant.opcodes[8]);
    assertSame('op_applyPostPipeline', descendant.opcodes[9]);
    assertSame('foo', descendant.opcodes[10]);
    assertSame('op_invokeProgram', descendant.opcodes[11]);
    assertSame('program2', descendant.opcodes[12]);
    assertSame('op_append', descendant.opcodes[13]);
    assertSame('op_appendContent', descendant.opcodes[14]);
    assertSame('ghi', descendant.opcodes[15]);

    descendant = env.context.allEnvironments[2];
    assertSame(2, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('def', descendant.opcodes[1]);
  },

  'test Compiler: inverse': function () {
    var ast = this.parser.parse('{{^hoge}}abc{{/hoge}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    assertSame(2, env.context.allEnvironments.length);
    assertSame(env, env.context.allEnvironments[0]);
    assertSame(12, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('op_evaluateValue', env.opcodes[3]);
    assertSame('hoge', env.opcodes[4]);
    assertSame('op_applyPrePipeline', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPostPipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_invokeProgramInverse', env.opcodes[9]);
    assertSame('program1', env.opcodes[10]);
    assertSame('op_append', env.opcodes[11]);
  },

  'test Compiler: content': function () {
    var ast = this.parser.parse('hoge');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    assertSame(2, env.opcodes.length);
    assertSame('op_appendContent', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
  },

  'test Compiler: comment': function () {
    var ast = this.parser.parse('{{! comment }}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    assertSame(0, env.opcodes.length);
  },

  'test JsCompiler: asString: spike': function () {
    var ast = this.parser.parse('{{#hoge}}{{test.aaa}}{{#foo}}bar{{/foo}}{{/hoge}}');
    var compiler = new this.compiler.Compiler();
    var environment = compiler.compile(ast);
    var jsCompiler = new this.compiler.JsCompiler(environment);
    var result = jsCompiler.compile(true);
    assertNotUndefined(result);
    console.log(result);
  },

  'test compile: tag': function () {
    var fn = this.compiler.compile('{{name}}');
    var data = {name: 'hoge'};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('hoge', result);
  },

  'test compile: tag: pathSegments': function () {
    var fn = this.compiler.compile('{{aaa.bbb.ccc}}');
    var data = {aaa: {bbb: {ccc: 'hoge'}}};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('hoge', result);
  },

  'test compile: tag: pathSegments: function': function () {
    var fn = this.compiler.compile('{{aaa.bbb.getName}}');
    var data = {
      name: 'data',
      aaa: {
        name: 'aaa',
        bbb: {
          name: 'bbb',
          getName: function () {
            return this.name;
          }
        }
      }
    };
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('bbb', result);
  },

  'test compile: tag: escape': function () {
    var fn = this.compiler.compile('{{name}}');
    var data = {name: '<div>"aaa"</div>'};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('&lt;div&gt;&quot;aaa&quot;&lt;/div&gt;', result);
  },

  'test compile: tag: unescape': function () {
    var fn = this.compiler.compile('{{{name}}}');
    var data = {name: '<div>"aaa"</div>'};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('<div>"aaa"</div>', result);
  },

  'test compile: content': function () {
    var fn = this.compiler.compile('abc');
    var data = {};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('abc', result);
  },

  'test compile: content: quotation': function () {
    var fn = this.compiler.compile('\\"\n\r\\"\n\r');
    var data = {};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('\\"\n\r\\"\n\r', result);
  },

  'test compile: content: escape sequence': function () {
    var fn = this.compiler.compile('\n\t\b\r\f\v\b\\\'\"\x10\u1234');
    var data = {};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('\n\t\b\r\f\v\b\\\'\"\x10\u1234', result);
  },

  'test compile: block: @root': function () {
    var fn = this.compiler.compile(
      [ '{{#container1}}',
        '{{#container2}}',
        '{{#container3}}{{@root.container1.name}}-{{name}}{{/container3}}',
        '{{/container2}}',
        '{{/container1}}' ].join('')
    );
    var data = {
      container1: {
        name: 'c1',
        container2: {
          container3: {
            name: 'c3'
          }
        }
      }
    };
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('c1-c3', result);
  },

  'test compile: block: @parent': function () {
    var fn = this.compiler.compile(
      [ '{{#container1}}',
        '{{#container2}}',
        '{{#container3}}{{@parent.name}}-{{name}}{{/container3}}',
        '{{/container2}}',
        '{{/container1}}' ].join('')
    );
    var data = {
      container1: {
        name: 'c1',
        container2: {
          name: 'c2',
          container3: {
            name: 'c3'
          }
        }
      }
    };
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('c2-c3', result);
  },

  'test compile: block: contextIndex': function () {
    var fn = this.compiler.compile(
      [ '{{#container1}}',
        '{{#container2}}',
        '{{#container3}}{{@2.name}}-{{@1.name}}-{{@0.name}}-{{name}}{{/container3}}',
        '{{/container2}}',
        '{{/container1}}' ].join('')
    );
    var data = {
      container1: {
        name: 'c1',
        container2: {
          name: 'c2',
          container3: {
            name: 'c3'
          }
        }
      }
    };
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('c1-c2-c3-c3', result);
  },

  'test compile: block: array': function () {
    var fn = this.compiler.compile('{{#array}}{{name}}-{{/array}}');
    var data = {array: [{name:'aaa'},{name:'bbb'}]};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa-bbb-', result);
  },

  'test compile: block: array: @this': function () {
    var fn = this.compiler.compile('{{#array}}{{@this}}-{{/array}}');
    var data = {array: ['aaa', 'bbb']};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa-bbb-', result);
  },

  'test compile: block: array: @index': function () {
    var fn = this.compiler.compile('{{#array}}{{@this}}{{@index}}-{{/array}}');
    var data = {array: ['aaa', 'bbb']};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa0-bbb1-', result);
  },

  'test compile: block: array: @hasNext': function () {
    var fn = this.compiler.compile('{{#array}}{{@this}}{{#@hasNext}}-{{/@hasNext}}{{/array}}');
    var data = {array: ['aaa', 'bbb']};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa-bbb', result);
  },

  'test compile: block: array: @root': function () {
    var fn = this.compiler.compile(
      [ '{{#container1}}',
        '{{#container2}}',
        '{{#array}}{{@root.container1.name}}({{name}})-{{/array}}',
        '{{/container2}}',
        '{{/container1}}' ].join('')
    );
    var data = {
      container1: {
        name: 'c1',
        container2: {
          array: [{name:'aaa'},{name:'bbb'}]
        }
      }
    };
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('c1(aaa)-c1(bbb)-', result);
  },

  'test compile: block: array: @parent': function () {
    var fn = this.compiler.compile(
      [ '{{#container1}}',
        '{{#container2}}',
        '{{#array}}{{@parent.name}}({{name}})-{{/array}}',
        '{{/container2}}',
        '{{/container1}}' ].join('')
    );
    var data = {
      container1: {
        name: 'c1',
        container2: {
          name: 'c2',
          array: [{name:'aaa'},{name:'bbb'}]
        }
      }
    };
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('c2(aaa)-c2(bbb)-', result);
  },

  'test compile: block: function: truthy': function () {
    var fn = this.compiler.compile('{{#fn}}{{name}}{{/fn}}');
    var data = {name: 'aaa', fn: function () { return true; }};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa', result);
  },

  'test compile: block: function: falsy': function () {
    var fn = this.compiler.compile('{{#fn}}{{name}}{{/fn}}');
    var data = {name: 'aaa', fn: function () { return false; }};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('', result);
  },

  'test compile: block: boolean: true': function () {
    var fn = this.compiler.compile('{{#bool}}{{name}}{{/bool}}');
    var data = {name: 'aaa', bool: true};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa', result);
  },

  'test compile: block: boolean: false': function () {
    var fn = this.compiler.compile('{{#bool}}{{name}}{{/bool}}');
    var data = {name: 'aaa', bool: false};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('', result);
  },

  'test compile: inverse: boolean: true': function () {
    var fn = this.compiler.compile('{{^bool}}{{name}}{{/bool}}');
    var data = {name: 'aaa', bool: true};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('', result);
  },

  'test compile: inverse: boolean: false': function () {
    var fn = this.compiler.compile('{{^bool}}{{name}}{{/bool}}');
    var data = {name: 'aaa', bool: false};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa', result);
  },

  'test compile: inverse: empty array': function () {
    var fn = this.compiler.compile('{{^array}}{{name}}{{/array}}');
    var data = {name: 'aaa', array: []};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa', result);
  },

  'test compile: partial': function () {
    var fn = this.compiler.compile('{{name}} | {{:link}}');
    var data = {name:'foo', url: '/hoge', title: 'HOGE'};
    var result;
    this.templateContext.templates.link = '{{url}} : {{title}}';
    result = fn.call(this.templateContext, data, [data]);
    assertSame('foo | /hoge : HOGE', result);
  },

  'test compile: partial: context': function () {
    var fn = this.compiler.compile('{{name}} | {{:link link}}');
    var data = {name:'foo', link: {url: '/hoge', title: 'HOGE'}};
    var result;
    this.templateContext.templates.link = '{{url}} : {{title}}';
    result = fn.call(this.templateContext, data, [data]);
    assertSame('foo | /hoge : HOGE', result);
  },

  'test parse: error': function () {
    try {
      this.compiler.parse('{{#aaa}}bbb');
      fail();
    } catch (e) {
      assertEquals('Error', e.name);
      assertEquals('Expected \"{{!\", \"{{\", \"{{#\", \"{{/\", \"{{:\", \"{{^\", \"{{{\" or any character but end of input found. line=1. column=12.\n{{#aaa}}bbb', e.message);
    }
  }

});