TestCase('compiler', {

  'setUp': function () {
    this.parser = tempura.internal.parser;
    this.compiler = tempura.internal.compiler;
    this.templateContext = {
      escape: tempura.internal.core.escape,
      compile: tempura.internal.core.compile,
      handleBlock: tempura.internal.core.handleBlock,
      handleInverse: tempura.internal.core.handleInverse,
      partials: {},
      templates: {},
      noSuchValue: function () {
        return undefined;
      },
      noSuchPartial: function () {
        return '';
      },
      noSuchProcessor: function (name, value) {
        return value;
      },
      prePipeline: function (value, name) {
        return value;
      },
      postPipeline: function (value, name) {
        return value;
      }
    };
  },

  'test Compiler: name': function () {
    var ast = this.parser.parse('{{hoge}}');
    var compiler = new this.compiler.Compiler();
    var result = compiler.compile(ast);

    assertSame(10, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame('op_evaluateValue', result.opcodes[2]);
    assertSame('hoge', result.opcodes[3]);
    assertSame('op_applyPrePipeline', result.opcodes[4]);
    assertSame('hoge', result.opcodes[5]);
    assertSame('op_applyPostPipeline', result.opcodes[6]);
    assertSame('hoge', result.opcodes[7]);
    assertSame('op_escape', result.opcodes[8]);
    assertSame('op_append', result.opcodes[9]);
  },

  'test Compiler: name: processor': function () {
    var ast = this.parser.parse('{{hoge|aaa}}');
    var compiler = new this.compiler.Compiler();
    var result = compiler.compile(ast);

    assertSame(13, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame('op_evaluateValue', result.opcodes[2]);
    assertSame('hoge', result.opcodes[3]);
    assertSame('op_applyPrePipeline', result.opcodes[4]);
    assertSame('hoge', result.opcodes[5]);
    assertSame('op_applyProcessor', result.opcodes[6]);
    assertSame('aaa', result.opcodes[7]);
    assertSame('hoge', result.opcodes[8]);
    assertSame('op_applyPostPipeline', result.opcodes[9]);
    assertSame('hoge', result.opcodes[10]);
    assertSame('op_escape', result.opcodes[11]);
    assertSame('op_append', result.opcodes[12]);
  },

  'test Compiler: name: multi processors': function () {
    var ast = this.parser.parse('{{hoge|aaa|bbb}}');
    var compiler = new this.compiler.Compiler();
    var result = compiler.compile(ast);

    assertSame(16, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame('op_evaluateValue', result.opcodes[2]);
    assertSame('hoge', result.opcodes[3]);
    assertSame('op_applyPrePipeline', result.opcodes[4]);
    assertSame('hoge', result.opcodes[5]);
    assertSame('op_applyProcessor', result.opcodes[6]);
    assertSame('aaa', result.opcodes[7]);
    assertSame('hoge', result.opcodes[8]);
    assertSame('op_applyProcessor', result.opcodes[9]);
    assertSame('bbb', result.opcodes[10]);
    assertSame('hoge', result.opcodes[11]);
    assertSame('op_applyPostPipeline', result.opcodes[12]);
    assertSame('hoge', result.opcodes[13]);
    assertSame('op_escape', result.opcodes[14]);
    assertSame('op_append', result.opcodes[15]);
  },

  'test Compiler: name: pathSegments': function () {
    var ast = this.parser.parse('{{aaa.bbb.ccc}}');
    var compiler = new this.compiler.Compiler();
    var result = compiler.compile(ast);

    assertSame(14, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('aaa', result.opcodes[1]);
    assertSame('op_lookupFromTmp', result.opcodes[2]);
    assertSame('bbb', result.opcodes[3]);
    assertSame('op_lookupFromTmp', result.opcodes[4]);
    assertSame('ccc', result.opcodes[5]);
    assertSame('op_evaluateValue', result.opcodes[6]);
    assertSame('aaa.bbb.ccc', result.opcodes[7]);
    assertSame('op_applyPrePipeline', result.opcodes[8]);
    assertSame('aaa.bbb.ccc', result.opcodes[9]);
    assertSame('op_applyPostPipeline', result.opcodes[10]);
    assertSame('aaa.bbb.ccc', result.opcodes[11]);
    assertSame('op_escape', result.opcodes[12]);
    assertSame('op_append', result.opcodes[13]);
  },

  'test Compiler: block': function () {
    var ast = this.parser.parse('{{#hoge}}abc{{/hoge}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    var descendant;

    assertSame(2, env.context.allEnvironments.length);
    assertSame(env, env.context.allEnvironments[0]);
    assertSame(7, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('op_evaluateValue', env.opcodes[2]);
    assertSame('hoge', env.opcodes[3]);
    assertSame('op_invokeProgram', env.opcodes[4]);
    assertSame('program1', env.opcodes[5]);
    assertSame('op_append', env.opcodes[6]);

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
    assertSame(14, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('op_evaluateValue', env.opcodes[2]);
    assertSame('hoge', env.opcodes[3]);
    assertSame('op_invokeProgram', env.opcodes[4]);
    assertSame('program1', env.opcodes[5]);
    assertSame('op_append', env.opcodes[6]);
    assertSame('op_lookupFromContext', env.opcodes[7]);
    assertSame('foo', env.opcodes[8]);
    assertSame('op_evaluateValue', env.opcodes[9]);
    assertSame('foo', env.opcodes[10]);
    assertSame('op_invokeProgram', env.opcodes[11]);
    assertSame('program2', env.opcodes[12]);
    assertSame('op_append', env.opcodes[13]);

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
    assertSame(7, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('op_evaluateValue', env.opcodes[2]);
    assertSame('hoge', env.opcodes[3]);
    assertSame('op_invokeProgram', env.opcodes[4]);
    assertSame('program1', env.opcodes[5]);
    assertSame('op_append', env.opcodes[6]);

    descendant = env.context.allEnvironments[1];
    assertSame(11, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('abc', descendant.opcodes[1]);
    assertSame('op_lookupFromContext', descendant.opcodes[2]);
    assertSame('foo', descendant.opcodes[3]);
    assertSame('op_evaluateValue', descendant.opcodes[4]);
    assertSame('foo', descendant.opcodes[5]);
    assertSame('op_invokeProgram', descendant.opcodes[6]);
    assertSame('program2', descendant.opcodes[7]);
    assertSame('op_append', descendant.opcodes[8]);
    assertSame('op_appendContent', descendant.opcodes[9]);
    assertSame('ghi', descendant.opcodes[10]);

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
    assertSame(7, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('op_evaluateValue', env.opcodes[2]);
    assertSame('hoge', env.opcodes[3]);
    assertSame('op_invokeProgramInverse', env.opcodes[4]);
    assertSame('program1', env.opcodes[5]);
    assertSame('op_append', env.opcodes[6]);
  },

  'test Compiler: content': function () {
    var ast = this.parser.parse('hoge');
    var compiler = new this.compiler.Compiler();
    var result = compiler.compile(ast);
    assertSame(2, result.opcodes.length);
    assertSame('op_appendContent', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
  },

  'test Compiler: comment': function () {
    var ast = this.parser.parse('{{! comment }}');
    var compiler = new this.compiler.Compiler();
    var result = compiler.compile(ast);
    assertSame(0, result.opcodes.length);
  },

  'test JsCompiler: string: spike': function () {
    var ast = this.parser.parse('{{#hoge}}{{test.aaa}}{{#foo}}bar{{/foo}}{{/hoge}}');
    var compiler = new this.compiler.Compiler();
    var environment = compiler.compile(ast);
    var jsCompiler = new this.compiler.JsCompiler(environment);
    var result = jsCompiler.compile();
    assertNotUndefined(result);
    console.log(result);
  },

  'test compile: tag': function () {
    var fn = this.compiler.compile('{{name}}');
    var data = {name: 'hoge'};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('hoge', result);
  },

  'test compile: tag: pathSeguments': function () {
    var fn = this.compiler.compile('{{aaa.bbb.ccc}}');
    var data = {aaa: {bbb: {ccc: 'hoge'}}};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('hoge', result);
  },

  'test compile: tag: escape': function () {
    var fn = this.compiler.compile('{{name}}');
    var data = {name: '<b>"aaa"</b>'};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('&lt;b&gt;&quot;aaa&quot;&lt;/b&gt;', result);
  },

  'test compile: tag: unescape': function () {
    var fn = this.compiler.compile('{{{name}}}');
    var data = {name: '<b>"aaa"</b>'};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('<b>"aaa"</b>', result);
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

  'test compile: block: $root': function () {
    var fn = this.compiler.compile(
      [ '{{#container1}}',
        '{{#container2}}',
        '{{#container3}}{{$root.container1.name}}-{{name}}{{/container3}}',
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

  'test compile: block: $parent': function () {
    var fn = this.compiler.compile(
      [ '{{#container1}}',
        '{{#container2}}',
        '{{#container3}}{{$parent.name}}-{{name}}{{/container3}}',
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

  'test compile: block: array': function () {
    var fn = this.compiler.compile('{{#array}}{{name}}-{{/array}}');
    var data = {array: [{name:'aaa'},{name:'bbb'}]};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa-bbb-', result);
  },

  'test compile: block: array: $this': function () {
    var fn = this.compiler.compile('{{#array}}{{$this}}-{{/array}}');
    var data = {array: ['aaa', 'bbb']};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa-bbb-', result);
  },

  'test compile: block: array: $index': function () {
    var fn = this.compiler.compile('{{#array}}{{$this}}{{$index}}-{{/array}}');
    var data = {array: ['aaa', 'bbb']};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa0-bbb1-', result);
  },

  'test compile: block: array: $hasNext': function () {
    var fn = this.compiler.compile('{{#array}}{{$this}}{{#$hasNext}}-{{/$hasNext}}{{/array}}');
    var data = {array: ['aaa', 'bbb']};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa-bbb', result);
  },

  'test compile: block: array: $root': function () {
    var fn = this.compiler.compile(
      [ '{{#container1}}',
        '{{#container2}}',
        '{{#array}}{{$root.container1.name}}({{name}})-{{/array}}',
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

  'test compile: block: array: $parent': function () {
    var fn = this.compiler.compile(
      [ '{{#container1}}',
        '{{#container2}}',
        '{{#array}}{{$parent.name}}({{name}})-{{/array}}',
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

  'test compile: inverse: boolean: false': function () {
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
    var fn = this.compiler.compile('{{name}} is {{@link}}');
    var data = {name:'foo', url: '/hoge', title: 'HOGE'};
    var result;
    this.templateContext.templates.link = '<a href="{{url}}">{{title}}</a>';
    result = fn.call(this.templateContext, data, [data]);
    assertSame('foo is <a href="/hoge">HOGE</a>', result);
  },

  'test compile: partial: context': function () {
    var fn = this.compiler.compile('{{name}} is {{@link link}}');
    var data = {name:'foo', link: {url: '/hoge', title: 'HOGE'}};
    var result;
    this.templateContext.templates.link = '<a href="{{url}}">{{title}}</a>';
    result = fn.call(this.templateContext, data, [data]);
    assertSame('foo is <a href="/hoge">HOGE</a>', result);
  },

  'test parse: error': function () {
    try {
      this.compiler.parse('{{#aaa}}bbb');
      fail();
    } catch (e) {
      assertEquals('Error', e.name);
      assertEquals('Expected \"{{!\", \"{{\", \"{{#\", \"{{/\", \"{{@\", \"{{^\", \"{{{\" or any character but end of input found. line=1. column=12.\n{{#aaa}}bbb', e.message);
    }
  }

});