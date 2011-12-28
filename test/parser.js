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
testCase('parser', {

  'setUp': function () {
    this.parser = tempura.internal.parser;
    this.parser.yy = tempura.internal.ast;
  },

  'test: mustache': function () {
    var program = this.parser.parse('{{test}}');
  },

  'test: block': function () {
    var program = this.parser.parse('{{#test}}abc{{/test}}');
  }

});