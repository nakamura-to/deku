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
testCase('api', {

  'setUp': function () {
    this.html = function (id) {
      return document.getElementById(id).innerHTML;
    };
  },

  'test version': function () {
    assertNotUndefined(tempura.version);
  },

  'test setSettings and getSettings': function () {
    var settings = {};
    assertNotSame(settings, tempura.getSettings());
    tempura.setSettings(settings);
    assertEquals(settings, tempura.getSettings());
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

  'test prepare and toHtml: it should use a "pipes" option prior to a "pipes" setting': function () {
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
          return '%' + value + '%';
        }
      }
    });
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

  'test prepare and toHtml: it should use a "finalPipe" options prior to "finalPipe" setting': function () {
    /*:DOC +=
     <div id="template">
     {{name}} is {{age}} years old.
     </div>
     <div id="result">
     hoge? is 20? years old.
     </div>
     */
    tempura.setSettings({
      finalPipe: function (value) {
        return value + '!';
      }
    });
    var options = {
      finalPipe: function (value) {
        return value + '?';
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