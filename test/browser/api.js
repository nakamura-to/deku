TestCase('api', {

  'setUp': function () {
    this.html = function (id) {
      return document.getElementById(id).innerHTML;
    };
  },

  'test version': function () {
    assertNotUndefined(tempura.version);
  },

  'test prepare and render': function () {
    /*:DOC +=
     <div id="template">
     {{name}} is {{age}} years old.
     </div>
     <div id="expected">
     hoge is 20 years old.
     </div>
     */
    var template = tempura.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should use a "processors" option prior to a "processors" setting': function () {
    /*:DOC +=
     <div id="template">
     {{name|enclose}} is {{age}} years old.
     </div>
     <div id="expected">
     [hoge] is 20 years old.
     </div>
     */
    tempura.settings.processors.enclose = function (value) {
      return '%' + value + '%';
    };
    var options = {
      processors: {
        enclose: function (value) {
          return '[' + value + ']';
        }
      }
    };
    var template = tempura.prepare(this.html('template'), options);
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should use a "processors" setting, if a "processors" option does not exist': function () {
    /*:DOC +=
     <div id="template">
     {{name|enclose}} is {{age}} years old.
     </div>
     <div id="expected">
     [hoge] is 20 years old.
     </div>
     */
    tempura.settings.processors.enclose = function (value) {
      return '[' + value + ']';
    };
    var template = tempura.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should use a "noSuchValue" option prior to a "noSuchValue" setting': function () {
    /*:DOC +=
     <div id="template">
     {{hoge}} is {{age}} years old.
     </div>
     <div id="expected">
     [hoge is not found] is 20 years old.
     </div>
     */
    tempura.settings.noSuchValue = function (name) {
      return undefined;
    };
    var options = {
      noSuchValue: function (name) {
        return '[' + name + ' is not found]';
      }
    };
    var template = tempura.prepare(this.html('template'), options);
    var result = template.render({age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should use a "noSuchValue" setting, if a "noSuchValue" option does not exitst': function () {
    /*:DOC +=
     <div id="template">
     {{hoge}} is {{age}} years old.
     </div>
     <div id="expected">
     [hoge is not found] is 20 years old.
     </div>
     */
    tempura.settings.noSuchValue = function (name) {
      return '[' + name + ' is not found]';
    };
    var template = tempura.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should use a "noSuchProcessor" option prior to a "noSuchProcessor" setting': function () {
    /*:DOC +=
     <div id="template">
     {{name|foo}} is {{age}} years old.
     </div>
     <div id="expected">
     [foo,hoge,name] is 20 years old.
     </div>
     */
    tempura.settings.noSuchProcessor = function (pipeName, value, valueName) {
      return undefined;
    }
    var options = {
      noSuchProcessor: function (pipeName, value, valueName) {
        return '[' + pipeName + ',' + value + ',' + valueName + ']';
      }
    };
    var template = tempura.prepare(this.html('template'), options);
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should use a "noSuchProcessor" setting, if a "noSuchProcessor" option does not exitst': function () {
    /*:DOC +=
     <div id="template">
     {{name|foo}} is {{age}} years old.
     </div>
     <div id="expected">
     [foo,hoge,name] is 20 years old.
     </div>
     */
    tempura.settings.noSuchProcessor = function (processorName, value, valueName) {
      return '[' + processorName + ',' + value + ',' + valueName + ']';
    };
    var template = tempura.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  }

});