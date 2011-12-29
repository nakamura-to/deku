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
testCase('util', {

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

  'test encode': function () {
    assertSame('&amp;', this.util.encode('&'));
    assertSame('&quot;', this.util.encode('"'));
    assertSame('&#39;', this.util.encode("'"));
    assertSame('&lt;', this.util.encode('<'));
    assertSame('&gt;', this.util.encode('>'));
    assertSame('a&amp;b&quot;c&#39;d&lt;e&gt;f', this.util.encode('a&b"c\'d<e>f'));
    assertSame('abc', this.util.encode('abc'));
    assertSame('123', this.util.encode(123));
    assertSame('', this.util.encode(null));
    assertSame('', this.util.encode(undefined));
  }

});