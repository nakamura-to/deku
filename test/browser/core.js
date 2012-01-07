TestCase('core', {

  'setUp': function () {
    this.core = tempura.internal.core;
  },

  'test prepare: it should return a object': function () {
    var template = this.core.prepare('', {});
    assertObject(template);
    assertFunction(template.render);
  },

  'test handleBlock: it should accept array and handle each element in the handler': function () {
    var context = {
      array: ['aaa', 'bbb', 'ccc']
    };
    var result = this.core.handleBlock(context, [], context.array, function (context) {
      return context + '-';
    });
    assertSame('aaa-bbb-ccc-', result);
  },

  'test handleBlock: it should accept object and handle it in the handler': function () {
    var context = {
      name: 'aaa',
      person: {
        name: 'bbb'
      }
    };
    var result = this.core.handleBlock(context, [], context.person, function (context) {
      return context.name;
    });
    assertSame('bbb', result);
  },

  'test handleBlock: it should accept truthy value and handle the original context in the handler': function () {
    var context = {
      name: 'aaa',
      flag: true
    };
    var result = this.core.handleBlock(context, [], context.flag, function (context) {
      return context.name;
    });
    assertSame('aaa', result);
  },

  'test handleBlock: it should accept falsy value and not call the handler': function () {
    var context = {
      name: 'aaa',
      flag: false
    };
    var result = this.core.handleBlock(context, [], context.flag, function (context) {
      return context.name;
    });
    assertSame('', result);
  },

  'test handleInverse: it should accept falsy value and handle the original context in the handler': function () {
    var context = {
      name: 'aaa',
      flag: false
    };
    var result = this.core.handleInverse(context, [], context.flag, function (context) {
      return context.name;
    });
    assertSame('aaa', result);
  },

  'test handleInverse: it should accept empty array and handle the original context in the handler': function () {
    var context = {
      name: 'aaa',
      array: []
    };
    var result = this.core.handleInverse(context, [], context.array, function (context) {
      return context.name;
    });
    assertSame('aaa', result);
  },

  'test escape': function () {
    assertSame('&amp;', this.core.escape('&'));
    assertSame('&quot;', this.core.escape('"'));
    assertSame('&#39;', this.core.escape("'"));
    assertSame('&lt;', this.core.escape('<'));
    assertSame('&gt;', this.core.escape('>'));
    assertSame('a&amp;b&quot;c&#39;d&lt;e&gt;f', this.core.escape('a&b"c\'d<e>f'));
    assertSame('abc', this.core.escape('abc'));
    assertSame('123', this.core.escape(123));
    assertSame('', this.core.escape(null));
    assertSame('', this.core.escape(undefined));
  },

  'test isObject': function () {
    var Person = function () {};
    var person = new Person();
    assertTrue(this.core.isObject(person));
    assertTrue(this.core.isObject({}));
    assertTrue(this.core.isObject([]));
    assertTrue(this.core.isObject(function () {}));
    assertFalse(this.core.isObject('aaa'));
    assertFalse(this.core.isObject(1));
    assertTrue(this.core.isObject(new Date()));
    assertTrue(this.core.isObject(/aaa/));
    assertFalse(this.core.isObject(null));
    assertFalse(this.core.isObject(undefined));
  },

  'test isArray': function () {
    assertTrue(this.core.isArray([]));
    assertFalse(this.core.isArray({}));
    assertFalse(this.core.isArray(function () {}));
    assertFalse(this.core.isArray('aaa'));
    assertFalse(this.core.isArray(1));
    assertFalse(this.core.isArray(new Date()));
    assertFalse(this.core.isArray(/aaa/));
    assertFalse(this.core.isArray(null));
    assertFalse(this.core.isArray(undefined));
  }



});