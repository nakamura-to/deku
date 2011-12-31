TestCase('compiler', {

  'setUp': function () {
    this.parser = tempura.internal.parser;
    this.compiler = tempura.internal.compiler;
    this.renderContext = {
      escape: tempura.internal.util.escape,
      handleBlock: tempura.internal.core.handleBlock,
      handleInverse: tempura.internal.core.handleInverse,
      applyPipe: tempura.internal.core.applyPipe,
      noSuchValue: function () {
        return undefined;
      },
      noSuchPipe: function (name, value) {
        return value;
      },
      prePipeProcess: function (value, name) {
        return value;
      },
      postPipeProcess: function (value, name) {
        return value;
      },
      pipes: {}
    };
  },

  'test Compiler: name': function () {
    var program = this.parser.parse('{{hoge}}');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();

    assertSame(10, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame('op_applyNoSuchValue', result.opcodes[2]);
    assertSame('hoge', result.opcodes[3]);
    assertSame('op_applyPrePipeProcess', result.opcodes[4]);
    assertSame('hoge', result.opcodes[5]);
    assertSame('op_applyPostPipeProcess', result.opcodes[6]);
    assertSame('hoge', result.opcodes[7]);
    assertSame('op_escape', result.opcodes[8]);
    assertSame('op_append', result.opcodes[9]);
  },

  'test Compiler: name: pipe': function () {
    var program = this.parser.parse('{{hoge|aaa}}');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();

    assertSame(13, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame('op_applyNoSuchValue', result.opcodes[2]);
    assertSame('hoge', result.opcodes[3]);
    assertSame('op_applyPrePipeProcess', result.opcodes[4]);
    assertSame('hoge', result.opcodes[5]);
    assertSame('op_applyPipe', result.opcodes[6]);
    assertSame('aaa', result.opcodes[7]);
    assertSame('hoge', result.opcodes[8]);
    assertSame('op_applyPostPipeProcess', result.opcodes[9]);
    assertSame('hoge', result.opcodes[10]);
    assertSame('op_escape', result.opcodes[11]);
    assertSame('op_append', result.opcodes[12]);
  },

  'test Compiler: name: multi pipes': function () {
    var program = this.parser.parse('{{hoge|aaa|bbb}}');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();

    assertSame(16, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame('op_applyNoSuchValue', result.opcodes[2]);
    assertSame('hoge', result.opcodes[3]);
    assertSame('op_applyPrePipeProcess', result.opcodes[4]);
    assertSame('hoge', result.opcodes[5]);
    assertSame('op_applyPipe', result.opcodes[6]);
    assertSame('aaa', result.opcodes[7]);
    assertSame('hoge', result.opcodes[8]);
    assertSame('op_applyPipe', result.opcodes[9]);
    assertSame('bbb', result.opcodes[10]);
    assertSame('hoge', result.opcodes[11]);
    assertSame('op_applyPostPipeProcess', result.opcodes[12]);
    assertSame('hoge', result.opcodes[13]);
    assertSame('op_escape', result.opcodes[14]);
    assertSame('op_append', result.opcodes[15]);
  },

  'test Compiler: name: pathSegments': function () {
    var program = this.parser.parse('{{aaa.bbb.ccc}}');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();

    assertSame(14, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('aaa', result.opcodes[1]);
    assertSame('op_lookupFromStack', result.opcodes[2]);
    assertSame('bbb', result.opcodes[3]);
    assertSame('op_lookupFromStack', result.opcodes[4]);
    assertSame('ccc', result.opcodes[5]);
    assertSame('op_applyNoSuchValue', result.opcodes[6]);
    assertSame('aaa.bbb.ccc', result.opcodes[7]);
    assertSame('op_applyPrePipeProcess', result.opcodes[8]);
    assertSame('aaa.bbb.ccc', result.opcodes[9]);
    assertSame('op_applyPostPipeProcess', result.opcodes[10]);
    assertSame('aaa.bbb.ccc', result.opcodes[11]);
    assertSame('op_escape', result.opcodes[12]);
    assertSame('op_append', result.opcodes[13]);
  },

  'test Compiler: block': function () {
    var program = this.parser.parse('{{#hoge}}abc{{/hoge}}');
    var compiler = new this.compiler.Compiler(program);
    var env = compiler.compile();
    var descendant;

    assertSame(2, env.context.allEnvironments.length);
    assertSame(env, env.context.allEnvironments[0]);
    assertSame(7, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('op_applyNoSuchValue', env.opcodes[2]);
    assertSame('hoge', env.opcodes[3]);
    assertSame('op_invokeProgram', env.opcodes[4]);
    assertSame(1, env.opcodes[5]);
    assertSame('op_append', env.opcodes[6]);

    descendant = env.context.allEnvironments[1];
    assertSame(2, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('abc', descendant.opcodes[1]);
  },

  'test Compiler: block: sibling': function () {
    var program = this.parser.parse('{{#hoge}}abc{{/hoge}}{{#foo}}def{{/foo}}');
    var compiler = new this.compiler.Compiler(program);
    var env = compiler.compile();
    var descendant;

    assertSame(3, env.context.allEnvironments.length);
    assertSame(env, env.context.allEnvironments[0]);
    assertSame(14, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('op_applyNoSuchValue', env.opcodes[2]);
    assertSame('hoge', env.opcodes[3]);
    assertSame('op_invokeProgram', env.opcodes[4]);
    assertSame(1, env.opcodes[5]);
    assertSame('op_append', env.opcodes[6]);
    assertSame('op_lookupFromContext', env.opcodes[7]);
    assertSame('foo', env.opcodes[8]);
    assertSame('op_applyNoSuchValue', env.opcodes[9]);
    assertSame('foo', env.opcodes[10]);
    assertSame('op_invokeProgram', env.opcodes[11]);
    assertSame(2, env.opcodes[12]);
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
    var program = this.parser.parse('{{#hoge}}abc{{#foo}}def{{/foo}}ghi{{/hoge}}');
    var compiler = new this.compiler.Compiler(program);
    var env = compiler.compile();
    var descendant;

    assertSame(3, env.context.allEnvironments.length);
    assertSame(env, env.context.allEnvironments[0]);
    assertSame(7, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('op_applyNoSuchValue', env.opcodes[2]);
    assertSame('hoge', env.opcodes[3]);
    assertSame('op_invokeProgram', env.opcodes[4]);
    assertSame(1, env.opcodes[5]);
    assertSame('op_append', env.opcodes[6]);

    descendant = env.context.allEnvironments[1];
    assertSame(11, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('abc', descendant.opcodes[1]);
    assertSame('op_lookupFromContext', descendant.opcodes[2]);
    assertSame('foo', descendant.opcodes[3]);
    assertSame('op_applyNoSuchValue', descendant.opcodes[4]);
    assertSame('foo', descendant.opcodes[5]);
    assertSame('op_invokeProgram', descendant.opcodes[6]);
    assertSame(2, descendant.opcodes[7]);
    assertSame('op_append', descendant.opcodes[8]);
    assertSame('op_appendContent', descendant.opcodes[9]);
    assertSame('ghi', descendant.opcodes[10]);

    descendant = env.context.allEnvironments[2];
    assertSame(2, descendant.opcodes.length);
    assertSame('op_appendContent', descendant.opcodes[0]);
    assertSame('def', descendant.opcodes[1]);
  },

  'test Compiler: inverse': function () {
    var program = this.parser.parse('{{^hoge}}abc{{/hoge}}');
    var compiler = new this.compiler.Compiler(program);
    var env = compiler.compile();
    assertSame(2, env.context.allEnvironments.length);
    assertSame(env, env.context.allEnvironments[0]);
    assertSame(7, env.opcodes.length);
    assertSame('op_lookupFromContext', env.opcodes[0]);
    assertSame('hoge', env.opcodes[1]);
    assertSame('op_applyNoSuchValue', env.opcodes[2]);
    assertSame('hoge', env.opcodes[3]);
    assertSame('op_invokeProgramInverse', env.opcodes[4]);
    assertSame(1, env.opcodes[5]);
    assertSame('op_append', env.opcodes[6]);
  },

  'test Compiler: content': function () {
    var program = this.parser.parse('hoge');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();
    assertSame(2, result.opcodes.length);
    assertSame('op_appendContent', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
  },

  'test Compiler: comment': function () {
    var program = this.parser.parse('{{! comment }}');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();
    assertSame(0, result.opcodes.length);
  },

  'test JsCompiler: string: spike': function () {
    var program = this.parser.parse('{{#hoge}}{{test.aaa}}{{#foo}}bar{{/foo}}{{/hoge}}');
    var compiler = new this.compiler.Compiler(program);
    var environment = compiler.compile(program);
    var jsCompiler = new this.compiler.JsCompiler(environment);
    var result = jsCompiler.compile();
    assertNotUndefined(result);
    console.log(result);
  },

  'test compile: tag': function () {
    var fn = this.compiler.compile('{{name}}');
    var result = fn.call(this.renderContext, {name: 'hoge' }, []);
    assertSame('hoge', result);
  },

  'test compile: tag: pathSeguments': function () {
    var fn = this.compiler.compile('{{aaa.bbb.ccc}}');
    var result = fn.call(this.renderContext, {aaa: {bbb: {ccc: 'hoge'} } }, []);
    assertSame('hoge', result);
  },

  'test compile: tag: pathSeguments: $root': function () {
    var fn = this.compiler.compile('{{aaa.bbb.$parent.ddd}}');
    var data = {
      aaa: {
        bbb: {
          ccc: 'hoge'
        }
      },
      ddd: 'foo'
    };
    var result = fn.call(this.renderContext, data, []);
    assertSame('foo', result);
  },

  'test compile: tag: escape': function () {
    var fn = this.compiler.compile('{{name}}');
    var result = fn.call(this.renderContext, {name: '<b>"aaa"</b>' }, []);
    assertSame('&lt;b&gt;&quot;aaa&quot;&lt;/b&gt;', result);
  },

  'test compile: tag: unescape': function () {
    var fn = this.compiler.compile('{{{name}}}');
    var result = fn.call(this.renderContext, {name: '<b>"aaa"</b>' }, []);
    assertSame('<b>"aaa"</b>', result);
  },

  'test compile: content': function () {
    var fn = this.compiler.compile('abc');
    var result = fn.call(this.renderContext, {});
    assertSame('abc', result);
  },

  'test compile: content: quotation': function () {
    var fn = this.compiler.compile('\\"\n\r\\"\n\r');
    var result = fn.call(this.renderContext, {});
    assertSame('\\"\n\r\\"\n\r', result);
  },

  'test compile: content: escape sequence': function () {
    var fn = this.compiler.compile('\n\t\b\r\f\v\b\\\'\"\x10\u1234');
    var result = fn.call(this.renderContext, {});
    assertSame('\n\t\b\r\f\v\b\\\'\"\x10\u1234', result);
  },

  'test compile: block: array': function () {
    var fn = this.compiler.compile('{{#array}}{{name}}-{{/array}}');
    var result = fn.call(this.renderContext, {array: [{name:'aaa'},{name:'bbb'}] }, []);
    assertSame('aaa-bbb-', result);
  },

  'test compile: block: array: $this': function () {
    var fn = this.compiler.compile('{{#array}}{{$this}}-{{/array}}');
    var result = fn.call(this.renderContext, {array: ['aaa', 'bbb']}, []);
    assertSame('aaa-bbb-', result);
  },

  'test compile: block: array: $index': function () {
    var fn = this.compiler.compile('{{#array}}{{$this}}{{$index}}-{{/array}}');
    var result = fn.call(this.renderContext, {array: ['aaa', 'bbb']}, []);
    assertSame('aaa0-bbb1-', result);
  },

  'test compile: block: array: $hasNext': function () {
    var fn = this.compiler.compile('{{#array}}{{$this}}{{#$hasNext}}-{{/$hasNext}}{{/array}}');
    var result = fn.call(this.renderContext, {array: ['aaa', 'bbb']}, []);
    assertSame('aaa-bbb', result);
  },

  'test compile: block: function: truthy': function () {
    var fn = this.compiler.compile('{{#fn}}{{name}}{{/fn}}');
    var result = fn.call(this.renderContext, {name: 'aaa', fn: function () { return true; } }, []);
    assertSame('aaa', result);
  },

  'test compile: block: function: falsy': function () {
    var fn = this.compiler.compile('{{#fn}}{{name}}{{/fn}}');
    var result = fn.call(this.renderContext, {name: 'aaa', fn: function () { return false; } }, []);
    assertSame('', result);
  },

  'test compile: block: boolean: true': function () {
    var fn = this.compiler.compile('{{#bool}}{{name}}{{/bool}}');
    var result = fn.call(this.renderContext, {name: 'aaa', bool: true }, []);
    assertSame('aaa', result);
  },

  'test compile: block: boolean: false': function () {
    var fn = this.compiler.compile('{{#bool}}{{name}}{{/bool}}');
    var result = fn.call(this.renderContext, {name: 'aaa', bool: false }, []);
    assertSame('', result);
  },

  'test compile: inverse: boolean: false': function () {
    var fn = this.compiler.compile('{{^bool}}{{name}}{{/bool}}');
    var result = fn.call(this.renderContext, {name: 'aaa', bool: true }, []);
    assertSame('', result);
  },

  'test compile: inverse: boolean: false': function () {
    var fn = this.compiler.compile('{{^bool}}{{name}}{{/bool}}');
    var result = fn.call(this.renderContext, {name: 'aaa', bool: false }, []);
    assertSame('aaa', result);
  },

  'test compile: inverse: empty array': function () {
    var fn = this.compiler.compile('{{^array}}{{name}}{{/array}}');
    var result = fn.call(this.renderContext, {name: 'aaa', array: [] }, []);
    assertSame('aaa', result);
  },

  'test parse: error': function () {
    try {
      this.compiler.parse('{{#aaa}}bbb');
      fail();
    } catch (e) {
      assertEquals('Error', e.name);
      assertEquals('Expected \"{{!\", \"{{\", \"{{#\", \"{{/\", \"{{^\", \"{{{\" or any character but end of input found. line=1. column=12.\n{{#aaa}}bbb', e.message);
    }
  }

});