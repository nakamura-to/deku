/*jslint browser: true, indent: 2, plusplus: true, sloppy: true, vars: true */
/*global
 tempura: false,
 TestCase: false,
 assertEquals: false,
 assertFalse: false,
 assertNotNull: false,
 assertNotUndefined: false,
 assertNull: false,
 assertSame: true,
 assertTrue: false,
 fail: false */
var testCase = TestCase;
testCase('dom', {

  'setUp': function () {
    this.dom = tempura.internal.dom;
  },

  'test defined': function () {
    assertNotUndefined(this.dom);
  },

  'test hasTempuraAttr' : function () {
    /*:DOC += <div id="el" data-tempura></div> */
    var el = document.getElementById('el');
    assertTrue(this.dom.hasTempuraAttr(el));
  },

  'test isNested': function () {
    /*:DOC +=
     <div id="el1">
     <div id="el2" data-tempura>
     <div id="el3">
     <div id="el4"></div>
     </div>
     </div>
     </div>
     */
    var el1 = document.getElementById('el1');
    var el2 = document.getElementById('el2');
    var el3 = document.getElementById('el3');
    var el4 = document.getElementById('el4');
    assertFalse(this.dom.isNested(el1));
    assertFalse(this.dom.isNested(el2));
    assertTrue(this.dom.isNested(el3));
    assertTrue(this.dom.isNested(el4));
  },

  'test clear': function () {
    /*:DOC +=
     <div id="el1">
     <div id="el2" data-tempura></div>
     <div id="el3"></div>
     <div id="el4" data-tempura></div>
     </div>
     */
    var el1 = document.getElementById('el1');
    this.dom.clear(el1);
    assertNotNull(document.getElementById('el1'));
    assertNull(document.getElementById('el2'));
    assertNotNull(document.getElementById('el3'));
    assertNull(document.getElementById('el4'));
  }

});