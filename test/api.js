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

  'test prepare and render': function () {
    /*:DOC +=
     <div id="template">
     {{name}} is {{age}} years old.
     </div>
     <div id="result">
     hoge is 20 years old.
     </div>
     */
    var template = tempura.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and render: it should use a "pipes" option prior to a "pipes" setting': function () {
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
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and render: it should use a "preRender" option prior to "preRender" setting': function () {
    /*:DOC +=
     <div id="template">
     {{name}} is {{age}} years old.
     </div>
     <div id="result">
     hoge? is 20? years old.
     </div>
     */
    tempura.setSettings({
      filter: function (value, next) {
        value = next(value);
        return value + '!';
      }
    });
    var options = {
      preRender: function (value, pipe) {
        value = pipe(value);
        return value + '?';
      }
    };
    var template = tempura.prepare(this.html('template'), options);
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and render: it should use a "pipes" setting, if a "pipes" option does not exist': function () {
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
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and render: it should use a "preRender" setting, if a "preRender" option does not exitst': function () {
    /*:DOC +=
     <div id="template">
     {{name|enclose}} is {{age}} years old.
     </div>
     <div id="result">
     hoge! is 20! years old.
     </div>
     */
    tempura.setSettings({
      preRender: function (value, pipe) {
        value = pipe(value);
        return value + '!';
      }
    });
    var template = tempura.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and render: it should use a "noSuchValue" option prior to a "noSuchValue" setting': function () {
    /*:DOC +=
     <div id="template">
     {{hoge}} is {{age}} years old.
     </div>
     <div id="result">
     [hoge is not found] is 20 years old.
     </div>
     */
    tempura.setSettings({
      noSuchValue: function (name) {
        return undefined;
      }
    });
    var options = {
      noSuchValue: function (name) {
        return '[' + name + ' is not found]';
      }
    };
    var template = tempura.prepare(this.html('template'), options);
    var result = template.render({age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and render: it should use a "noSuchValue" setting, if a "noSuchValue" option does not exitst': function () {
    /*:DOC +=
     <div id="template">
     {{hoge}} is {{age}} years old.
     </div>
     <div id="result">
     [hoge is not found] is 20 years old.
     </div>
     */
    tempura.setSettings({
      noSuchValue: function (name) {
        return '[' + name + ' is not found]';
      }
    });
    var template = tempura.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and render: it should use a "noSuchPipe" option prior to a "noSuchPipe" setting': function () {
    /*:DOC +=
     <div id="template">
     {{name|foo}} is {{age}} years old.
     </div>
     <div id="result">
     [foo,0,hoge] is 20 years old.
     </div>
     */
    tempura.setSettings({
      noSuchPipe: function (name, index, value) {
        return undefined;
      }
    });
    var options = {
      noSuchPipe: function (name, index, value) {
        return '[' + name + ',' + index + ',' + value + ']';
      }
    };
    var template = tempura.prepare(this.html('template'), options);
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test prepare and render: it should use a "noSuchPipe" setting, if a "noSuchPipe" option does not exitst': function () {
    /*:DOC +=
     <div id="template">
     {{name|foo}} is {{age}} years old.
     </div>
     <div id="result">
     [foo,0,hoge] is 20 years old.
     </div>
     */
    tempura.setSettings({
      noSuchPipe: function (name, index, value) {
        return '[' + name + ',' + index + ',' + value + ']';
      }
    });
    var template = tempura.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('result'), result);
  },

  'test addSettings: it should merge settings with original one': function () {
    tempura.setSettings({
      hoge: function () {
        return 'original hoge';
      },
      foo: function () {
        return 'original foo';
      }
    });
    tempura.addSettings({
      foo: function () {
        return 'new foo';
      }
    });
    assertSame('original hoge', tempura.getSettings().hoge());
    assertSame('new foo', tempura.getSettings().foo());
  }

});