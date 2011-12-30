/*jslint browser: true, indent: 2, plusplus: true, sloppy: true, vars: true */
/*global
 tempura: false,
 TestCase: false,
 assertEquals: false,
 assertException: false,
 assertFalse: false,
 assertNotNull: false,
 assertNotUndefined: false,
 assertNull: false,
 assertSame: true,
 assertTrue: false,
 fail: false */
var testCase = TestCase;
testCase('compiler', {

  'setUp': function () {
    this.parser = tempura.internal.parser;
    this.compiler = tempura.internal.compiler;
    this.renderContext = {
      escape: tempura.internal.util.encode,
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
    assertSame(0, result.children.length);
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
    assertSame(0, result.children.length);
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
    assertSame(0, result.children.length);
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
    assertSame(0, result.children.length);
  },

  'test Compiler: block': function () {
    var program = this.parser.parse('{{#hoge}}abc{{/hoge}}');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();
    var child;

    assertSame(5, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame('op_invokeProgram', result.opcodes[2]);
    assertSame(0, result.opcodes[3]);
    assertSame('op_append', result.opcodes[4]);
    assertSame(1, result.children.length);

    child = result.children[0];
    assertSame(2, child.opcodes.length);
    assertSame('op_appendContent', child.opcodes[0]);
    assertSame('abc', child.opcodes[1]);
    assertSame(0, child.children.length);
  },

  'test Compiler: block: sibling': function () {
    var program = this.parser.parse('{{#hoge}}abc{{/hoge}}{{#foo}}def{{/foo}}');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();
    var child1;
    var child2;

    assertSame(10, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame('op_invokeProgram', result.opcodes[2]);
    assertSame(0, result.opcodes[3]);
    assertSame('op_append', result.opcodes[4]);
    assertSame('op_lookupFromContext', result.opcodes[5]);
    assertSame('foo', result.opcodes[6]);
    assertSame('op_invokeProgram', result.opcodes[7]);
    assertSame(1, result.opcodes[8]);
    assertSame('op_append', result.opcodes[9]);
    assertSame(2, result.children.length);

    child1 = result.children[0];
    assertSame(2, child1.opcodes.length);
    assertSame('op_appendContent', child1.opcodes[0]);
    assertSame('abc', child1.opcodes[1]);
    assertSame(0, child1.children.length);

    child2 = result.children[1];
    assertSame(2, child2.opcodes.length);
    assertSame('op_appendContent', child2.opcodes[0]);
    assertSame('def', child2.opcodes[1]);
    assertSame(0, child2.children.length);
  },

  'test Compiler: block: nesting': function () {
    var program = this.parser.parse('{{#hoge}}abc{{#foo}}def{{/foo}}ghi{{/hoge}}');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();
    var child;
    var grandChild;

    assertSame(5, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame('op_invokeProgram', result.opcodes[2]);
    assertSame(0, result.opcodes[3]);
    assertSame('op_append', result.opcodes[4]);
    assertSame(1, result.children.length);

    child = result.children[0];
    assertSame(9, child.opcodes.length);
    assertSame('op_appendContent', child.opcodes[0]);
    assertSame('abc', child.opcodes[1]);
    assertSame('op_lookupFromContext', child.opcodes[2]);
    assertSame('foo', child.opcodes[3]);
    assertSame('op_invokeProgram', child.opcodes[4]);
    assertSame(0, child.opcodes[5]);
    assertSame('op_append', child.opcodes[6]);
    assertSame('op_appendContent', child.opcodes[7]);
    assertSame('ghi', child.opcodes[8]);
    assertSame(1, child.children.length);

    grandChild = child.children[0];
    assertSame(2, grandChild.opcodes.length);
    assertSame('op_appendContent', grandChild.opcodes[0]);
    assertSame('def', grandChild.opcodes[1]);
    assertSame(0, grandChild.children.length);
  },

  'test Compiler: inverse': function () {
    var program = this.parser.parse('{{^hoge}}abc{{/hoge}}');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();
    assertSame(5, result.opcodes.length);
    assertSame('op_lookupFromContext', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame('op_invokeProgramInverse', result.opcodes[2]);
    assertSame(0, result.opcodes[3]);
    assertSame('op_append', result.opcodes[4]);
    assertSame(1, result.children.length);
  },

  'test Compiler: content': function () {
    var program = this.parser.parse('hoge');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();
    assertSame(2, result.opcodes.length);
    assertSame('op_appendContent', result.opcodes[0]);
    assertSame('hoge', result.opcodes[1]);
    assertSame(0, result.children.length);
  },

  'test Compiler: comment': function () {
    var program = this.parser.parse('{{! comment }}');
    var compiler = new this.compiler.Compiler(program);
    var result = compiler.compile();
    assertSame(0, result.opcodes.length);
    assertSame(0, result.children.length);
  },

  'test JsCompiler: string: spike': function () {
    var program = this.parser.parse('{{#hoge}}{{test.aaa}}{{/hoge}}');
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
  }

});