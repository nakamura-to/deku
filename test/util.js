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

  'test defined': function () {
    assertNotUndefined(this.util);
  },

  'test isObject': function () {
    assertTrue(this.util.isObject({}));
    assertFalse(this.util.isObject([]));
    assertFalse(this.util.isObject(function () {}));
    assertFalse(this.util.isObject('aaa'));
    assertFalse(this.util.isObject(1));
    assertFalse(this.util.isObject(new Date()));
    assertFalse(this.util.isObject(/aaa/));
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

  'test isString': function () {
    assertTrue(this.util.isString('aaa'));
    assertFalse(this.util.isString({}));
    assertFalse(this.util.isString([]));
    assertFalse(this.util.isString(function () {}));
    assertFalse(this.util.isString(1));
    assertFalse(this.util.isString(new Date()));
    assertFalse(this.util.isString(/aaa/));
    assertFalse(this.util.isString(null));
    assertFalse(this.util.isString(undefined));
  },

  'test trim': function () {
    assertEquals('abc', this.util.trim('  abc  '));
    assertEquals('', this.util.trim(null))
    assertEquals('', this.util.trim(undefined))
  },

  'test extend': function () {
    var obj = {
      name: 'hoge',
      age: 20
    };
    var result = this.util.extend(obj, {name: 'foo', job: 'salesman'}, {birthday: '2011/12/11'});
    assertSame(obj, result);
    assertEquals('hoge', obj.name);
    assertEquals(20, obj.age);
    assertEquals('salesman', obj.job);
    assertEquals('2011/12/11', obj.birthday);
  },

  'test encodeHtml': function () {
    assertEquals('&amp;', this.util.encodeHtml('&'));
    assertEquals('&quot;', this.util.encodeHtml('"'));
    assertEquals('&#39;', this.util.encodeHtml("'"));
    assertEquals('&lt;', this.util.encodeHtml('<'));
    assertEquals('&gt;', this.util.encodeHtml('>'));
    assertEquals('a&amp;b&quot;c&#39;d&lt;e&gt;f', this.util.encodeHtml('a&b"c\'d<e>f'));
    assertEquals('abc', this.util.encodeHtml('abc'));
    assertEquals('123', this.util.encodeHtml(123));
    assertEquals('', this.util.encodeHtml(null));
    assertEquals('', this.util.encodeHtml(undefined));
  }

});