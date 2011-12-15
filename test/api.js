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
testCase('api', {

  'setUp': function () {
    this.html = function (id) {
      return document.getElementById(id).innerHTML;
    };
  },

  'test prepare and toHtml': function () {
    /*:DOC +=
     <div id="template">
     {{name}} is {{age}} years old.
     </div>
     <div id="result">
     hoge is 20 years old.
     </div>
     */
    var template = tempura.prepare(this.html('template'));
    var result = template.toHtml({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and toHtml: it should accept options which has "pipes" property': function () {
    /*:DOC +=
     <div id="template">
     {{name|enclose}} is {{age}} years old.
     </div>
     <div id="result">
     [hoge] is 20 years old.
     </div>
     */
    var options = {
      pipes: {
        enclose: function (value) {
          return '[' + value + ']';
        }
      }
    };
    var template = tempura.prepare(this.html('template'), options);
    var result = template.toHtml({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and toHtml: it should accept options which has "finalPipe" property': function () {
    /*:DOC +=
     <div id="template">
     {{name|enclose}} is {{age}} years old.
     </div>
     <div id="result">
     [hoge]! is 20! years old.
     </div>
     */
    var options = {
      pipes: {
        enclose: function (value) {
          return '[' + value + ']';
        }
      },
      finalPipe: function (value) {
        return value + '!';
      }
    };
    var template = tempura.prepare(this.html('template'), options);
    var result = template.toHtml({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and toHtml: it should use a "pipes" setting, if a "pipes" option does not exist': function () {
    /*:DOC +=
     <div id="template">
     {{name|enclose}} is {{age}} years old.
     </div>
     <div id="result">
     [hoge] is 20 years old.
     </div>
     */
    tempura.setSettings({
      pipes: {
        enclose: function (value) {
          return '[' + value + ']';
        }
      }
    });
    var template = tempura.prepare(this.html('template'));
    var result = template.toHtml({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and toHtml: it should use a "finalPipe" setting, if a "finalPipe" option does not exitst': function () {
    /*:DOC +=
     <div id="template">
     {{name|enclose}} is {{age}} years old.
     </div>
     <div id="result">
     hoge! is 20! years old.
     </div>
     */
    tempura.finalPipe = function (value) {
      return value + '!';
    };
    tempura.setSettings({
      finalPipe: function (value) {
        return value + '!';
      }
    });

    var template = tempura.prepare(this.html('template'));
    var result = template.toHtml({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  }

});