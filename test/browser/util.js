TestCase('util', {

  'setUp': function () {
    this.util = tempura.internal.util;
  },

  'test isObject': function () {
    var Person = function () {};
    var person = new Person();
    assertTrue(this.util.isObject(person));
    assertTrue(this.util.isObject({}));
    assertTrue(this.util.isObject([]));
    assertTrue(this.util.isObject(function () {}));
    assertFalse(this.util.isObject('aaa'));
    assertFalse(this.util.isObject(1));
    assertTrue(this.util.isObject(new Date()));
    assertTrue(this.util.isObject(/aaa/));
    assertFalse(this.util.isObject(null));
    assertFalse(this.util.isObject(undefined));
  },

  'test isFunction': function () {
    assertTrue(this.util.isFunction(function () {}));
    assertFalse(this.util.isFunction({}));
    assertFalse(this.util.isFunction([]));
    assertFalse(this.util.isFunction('aaa'));
    assertFalse(this.util.isFunction(1));
    assertFalse(this.util.isFunction(new Date()));
    assertFalse(this.util.isFunction(/aaa/));
    assertFalse(this.util.isFunction(null));
    assertFalse(this.util.isFunction(undefined));
  },

  'test isArray': function () {
    assertTrue(this.util.isArray([]));
    assertFalse(this.util.isArray({}));
    assertFalse(this.util.isArray(function () {}));
    assertFalse(this.util.isArray('aaa'));
    assertFalse(this.util.isArray(1));
    assertFalse(this.util.isArray(new Date()));
    assertFalse(this.util.isArray(/aaa/));
    assertFalse(this.util.isArray(null));
    assertFalse(this.util.isArray(undefined));
  },

  'test escape': function () {
    assertSame('&amp;', this.util.escape('&'));
    assertSame('&quot;', this.util.escape('"'));
    assertSame('&#39;', this.util.escape("'"));
    assertSame('&lt;', this.util.escape('<'));
    assertSame('&gt;', this.util.escape('>'));
    assertSame('a&amp;b&quot;c&#39;d&lt;e&gt;f', this.util.escape('a&b"c\'d<e>f'));
    assertSame('abc', this.util.escape('abc'));
    assertSame('123', this.util.escape(123));
    assertSame('', this.util.escape(null));
    assertSame('', this.util.escape(undefined));
  }

});