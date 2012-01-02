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
  }

});