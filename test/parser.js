/*jslint browser: true, indent: 2, plusplus: true, sloppy: true, vars: true */
/*global
 tempura: false,
 TestCase: false,
 assertEquals: false,
 assertFalse: false,
 assertNotNull: false,
 assertNotSame: false,
 assertNotUndefined: false,
 assertNull: false,
 assertSame: true,
 assertTrue: false,
 fail: false */
var testCase = TestCase;
testCase('parser', {

  'setUp': function () {
    this.parser = tempura.internal.parser;
  },

  'test whitespaces': function () {
    var result = this.parser.parse('{{# aaa }} {{ bbb }} {{^ ccc }} {{{ ddd }}} {{/ ccc }} {{/ aaa }}');
    assertNotUndefined(result);
  }

});