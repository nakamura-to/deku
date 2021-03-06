TestCase('compiler', {

  'setUp': function () {
    this.parser = deku.internal.parser;
    this.compiler = deku.internal.compiler;
    this.templateContext = {
      escape: deku.internal.core.escape,
      compile: deku.internal.core.compile,
      handleBlock: deku.internal.core.handleBlock,
      handleInverse: deku.internal.core.handleInverse,
      handlePartial: deku.internal.core.handlePartial,
      values: {},
      partials: {},
      templates: {},
      processors: {},
      prePipeline : deku.prePipeline,
      postPipeline: deku.postPipeline,
      noSuchValue: deku.noSuchValue,
      noSuchPartial: deku.noSuchPartial,
      noSuchProcessor: deku.noSuchProcessor,
      partialResolver: deku.partialResolver
    };
  },

  'test Compiler: name': function () {
    var ast = this.parser.parse('{{hoge}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);

    assertSame(13, env.opcodes.length);
    assertSame('op_lookupHead', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('default', env.opcodes[3]);
    assertSame('0', env.opcodes[4]);
    assertSame('op_evaluateValue', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPrePipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_applyPostPipeline', env.opcodes[9]);
    assertSame('hoge', env.opcodes[10]);
    assertSame('op_escape', env.opcodes[11]);
    assertSame('op_append', env.opcodes[12]);
  },

  'test Compiler: name: processor': function () {
    var ast = this.parser.parse('{{hoge|aaa}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);

    assertSame(21, env.opcodes.length);
    assertSame('op_lookupHead', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('default', env.opcodes[3]);
    assertSame('0', env.opcodes[4]);
    assertSame('op_evaluateValue', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPrePipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_lookupHead', env.opcodes[9]);
    assertSame('aaa', env.opcodes[10]);
    assertSame('processor', env.opcodes[11]);
    assertSame('default', env.opcodes[12]);
    assertSame('0', env.opcodes[13]);
    assertSame('op_applyProcessor', env.opcodes[14]);
    assertSame('aaa', env.opcodes[15]);
    assertSame('hoge', env.opcodes[16]);
    assertSame('op_applyPostPipeline', env.opcodes[17]);
    assertSame('hoge', env.opcodes[18]);
    assertSame('op_escape', env.opcodes[19]);
    assertSame('op_append', env.opcodes[20]);
  },

  'test Compiler: name: multi processors': function () {
    var ast = this.parser.parse('{{hoge|aaa|bbb}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);

    assertSame(29, env.opcodes.length);
    assertSame('op_lookupHead', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('default', env.opcodes[3]);
    assertSame('0', env.opcodes[4]);
    assertSame('op_evaluateValue', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPrePipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_lookupHead', env.opcodes[9]);
    assertSame('aaa', env.opcodes[10]);
    assertSame('processor', env.opcodes[11]);
    assertSame('default', env.opcodes[12]);
    assertSame('0', env.opcodes[13]);
    assertSame('op_applyProcessor', env.opcodes[14]);
    assertSame('aaa', env.opcodes[15]);
    assertSame('hoge', env.opcodes[16]);
    assertSame('op_lookupHead', env.opcodes[17]);
    assertSame('bbb', env.opcodes[18]);
    assertSame('processor', env.opcodes[19]);
    assertSame('default', env.opcodes[20]);
    assertSame('0', env.opcodes[21]);
    assertSame('op_applyProcessor', env.opcodes[22]);
    assertSame('bbb', env.opcodes[23]);
    assertSame('hoge', env.opcodes[24]);
    assertSame('op_applyPostPipeline', env.opcodes[25]);
    assertSame('hoge', env.opcodes[26]);
    assertSame('op_escape', env.opcodes[27]);
    assertSame('op_append', env.opcodes[28]);
  },

  'test Compiler: name: pathSegments': function () {
    var ast = this.parser.parse('{{aaa.bbb.ccc}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);

    assertSame(19, env.opcodes.length);
    assertSame('op_lookupHead', env.opcodes[0]);
    assertSame('aaa', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('default', env.opcodes[3]);
    assertSame('0', env.opcodes[4]);
    assertSame('op_lookupTail', env.opcodes[5]);
    assertSame('bbb', env.opcodes[6]);
    assertSame('value', env.opcodes[7]);
    assertSame('op_lookupTail', env.opcodes[8]);
    assertSame('ccc', env.opcodes[9]);
    assertSame('value', env.opcodes[10]);
    assertSame('op_evaluateValue', env.opcodes[11]);
    assertSame('aaa.bbb.ccc', env.opcodes[12]);
    assertSame('op_applyPrePipeline', env.opcodes[13]);
    assertSame('aaa.bbb.ccc', env.opcodes[14]);
    assertSame('op_applyPostPipeline', env.opcodes[15]);
    assertSame('aaa.bbb.ccc', env.opcodes[16]);
    assertSame('op_escape', env.opcodes[17]);
    assertSame('op_append', env.opcodes[18]);
  },

  'test Compiler: block': function () {
    var ast = this.parser.parse('{{#hoge}}abc{{/hoge}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    var descendant;

    assertSame(2, env.context.all.length);
    assertSame(env, env.context.all[0]);
    assertSame(14, env.opcodes.length);
    assertSame('op_lookupHead', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('default', env.opcodes[3]);
    assertSame('0', env.opcodes[4]);
    assertSame('op_evaluateValue', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPrePipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_applyPostPipeline', env.opcodes[9]);
    assertSame('hoge', env.opcodes[10]);
    assertSame('op_invokeProgram', env.opcodes[11]);
    assertSame('program1', env.opcodes[12]);
    assertSame('op_append', env.opcodes[13]);

    descendant = env.context.all[1];
    assertSame(2, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('abc', descendant.opcodes[1]);
  },

  'test Compiler: block: sibling': function () {
    var ast = this.parser.parse('{{#hoge}}abc{{/hoge}}{{#foo}}def{{/foo}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    var descendant;

    assertSame(3, env.context.all.length);
    assertSame(env, env.context.all[0]);
    assertSame(28, env.opcodes.length);
    assertSame('op_lookupHead', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('default', env.opcodes[3]);
    assertSame('0', env.opcodes[4]);
    assertSame('op_evaluateValue', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPrePipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_applyPostPipeline', env.opcodes[9]);
    assertSame('hoge', env.opcodes[10]);
    assertSame('op_invokeProgram', env.opcodes[11]);
    assertSame('program1', env.opcodes[12]);
    assertSame('op_append', env.opcodes[13]);
    assertSame('op_lookupHead', env.opcodes[14]);
    assertSame('foo', env.opcodes[15]);
    assertSame('value', env.opcodes[16]);
    assertSame('default', env.opcodes[17]);
    assertSame('0', env.opcodes[18]);
    assertSame('op_evaluateValue', env.opcodes[19]);
    assertSame('foo', env.opcodes[20]);
    assertSame('op_applyPrePipeline', env.opcodes[21]);
    assertSame('foo', env.opcodes[22]);
    assertSame('op_applyPostPipeline', env.opcodes[23]);
    assertSame('foo', env.opcodes[24]);
    assertSame('op_invokeProgram', env.opcodes[25]);
    assertSame('program2', env.opcodes[26]);
    assertSame('op_append', env.opcodes[27]);

    descendant = env.context.all[1];
    assertSame(2, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('abc', descendant.opcodes[1]);

    descendant = env.context.all[2];
    assertSame(2, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('def', descendant.opcodes[1]);
  },

  'test Compiler: block: nesting': function () {
    var ast = this.parser.parse('{{#hoge}}abc{{#foo}}def{{/foo}}ghi{{/hoge}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    var descendant;

    assertSame(3, env.context.all.length);
    assertSame(env, env.context.all[0]);
    assertSame(14, env.opcodes.length);
    assertSame('op_lookupHead', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('default', env.opcodes[3]);
    assertSame('0', env.opcodes[4]);
    assertSame('op_evaluateValue', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPrePipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_applyPostPipeline', env.opcodes[9]);
    assertSame('hoge', env.opcodes[10]);
    assertSame('op_invokeProgram', env.opcodes[11]);
    assertSame('program1', env.opcodes[12]);
    assertSame('op_append', env.opcodes[13]);
    
    descendant = env.context.all[1];
    assertSame(18, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('abc', descendant.opcodes[1]);
    assertSame('op_lookupHead', descendant.opcodes[2]);
    assertSame('foo', descendant.opcodes[3]);
    assertSame('value', descendant.opcodes[4]);
    assertSame('default', descendant.opcodes[5]);
    assertSame('0', descendant.opcodes[6]);
    assertSame('op_evaluateValue', descendant.opcodes[7]);
    assertSame('foo', descendant.opcodes[8]);
    assertSame('op_applyPrePipeline', descendant.opcodes[9]);
    assertSame('foo', descendant.opcodes[10]);
    assertSame('op_applyPostPipeline', descendant.opcodes[11]);
    assertSame('foo', descendant.opcodes[12]);
    assertSame('op_invokeProgram', descendant.opcodes[13]);
    assertSame('program2', descendant.opcodes[14]);
    assertSame('op_append', descendant.opcodes[15]);
    assertSame('op_appendContent', descendant.opcodes[16]);
    assertSame('ghi', descendant.opcodes[17]);

    descendant = env.context.all[2];
    assertSame(2, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('def', descendant.opcodes[1]);
  },

  'test Compiler: inverse': function () {
    var ast = this.parser.parse('{{^hoge}}abc{{/hoge}}');
    var compiler = new this.compiler.Compiler();
    var env = compiler.compile(ast);
    assertSame(2, env.context.all.length);
    assertSame(env, env.context.all[0]);
    assertSame(14, env.opcodes.length);
    assertSame('op_lookupHead', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('value', env.opcodes[2]);
    assertSame('default', env.opcodes[3]);
    assertSame('0', env.opcodes[4]);
    assertSame('op_evaluateValue', env.opcodes[5]);
    assertSame('hoge', env.opcodes[6]);
    assertSame('op_applyPrePipeline', env.opcodes[7]);
    assertSame('hoge', env.opcodes[8]);
    assertSame('op_applyPostPipeline', env.opcodes[9]);
    assertSame('hoge', env.opcodes[10]);
    assertSame('op_invokeProgramInverse', env.opcodes[11]);
    assertSame('program1', env.opcodes[12]);
    assertSame('op_append', env.opcodes[13]);
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

  'test compile: block: array: @length': function () {
    var fn = this.compiler.compile('{{#array}}{{@this}}({{@index}}:{{@length}}){{/array}}');
    var data = {array: ['aaa', 'bbb']};
    var result = fn.call(this.templateContext, data, [data]);
    assertSame('aaa(0:2)bbb(1:2)', result);
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
    this.templateContext.partials.link = '{{url}} : {{title}}';
    result = fn.call(this.templateContext, data);
    assertSame('foo | /hoge : HOGE', result);
  },

  'test compile: partial: context': function () {
    var fn = this.compiler.compile('{{name}} | {{:link link}}');
    var data = {name:'foo', link: {url: '/hoge', title: 'HOGE'}};
    var result;
    this.templateContext.partials.link = '{{url}} : {{title}}';
    result = fn.call(this.templateContext, data, [data]);
    assertSame('foo | /hoge : HOGE', result);
  },

  'test compile: partial: index': function () {
    var fn = this.compiler.compile('{{name}} | {{:link link}}');
    var data = {name:'foo', link: {url: '/hoge', title: 'HOGE'}};
    var result;
    this.templateContext.partials.link = '{{url}} : {{title}}, {{@index}}';
    result = fn.call(this.templateContext, data, [data], 10);
    assertSame('foo | /hoge : HOGE, 10', result);
  },

  'test compile: partial: hasNext': function () {
    var fn = this.compiler.compile('{{name}} | {{:link link}}');
    var data = {name:'foo', link: {url: '/hoge', title: 'HOGE'}};
    var result;
    this.templateContext.partials.link = '{{url}} : {{title}}, {{@hasNext}}';
    result = fn.call(this.templateContext, data, [data], 10, true);
    assertSame('foo | /hoge : HOGE, true', result);
  },

  'test compile: partial: length': function () {
    var fn = this.compiler.compile('{{name}} | {{:link link}}');
    var data = {name:'foo', link: {url: '/hoge', title: 'HOGE'}};
    var result;
    this.templateContext.partials.link = '{{url}} : {{title}}, {{@length}}';
    result = fn.call(this.templateContext, data, [data], 10, true, 20);
    assertSame('foo | /hoge : HOGE, 20', result);
  },

  'test parse: error': function () {
    try {
      this.compiler.parse('{{#aaa}}bbb');
      fail();
    } catch (e) {
      assertEquals('Error', e.name);
      assertEquals('Expected \"\\\\\", \"{{!\", \"{{\", \"{{#\", \"{{/\", \"{{:\", \"{{^\", \"{{{\" or any character but end of input found. line=1. column=12.\n{{#aaa}}bbb', e.message);
    }
  }

});