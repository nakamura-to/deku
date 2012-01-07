TestCase('api', {

  'setUp': function () {
    this.html = function (id) {
      return document.getElementById(id).innerHTML;
    };
    this.preseved = {};
    this.preseved.prePipeline = pot.prePipeline;
    this.preseved.postPipeline = pot.postPipeline;
    this.preseved.noSuchValue = pot.noSuchValue;
    this.preseved.noSuchPartial = pot.noSuchPartial;
    this.preseved.noSuchProcessor = pot.noSuchProcessor;
  },

  'tearDown': function () {
    pot.templates = {};
    pot.processors = {};
    pot.prePipeline = this.preseved.prePipeline;
    pot.postPipeline = this.preseved.postPipeline;
    pot.noSuchValue = this.preseved.noSuchValue;
    pot.noSuchPartial = this.preseved.noSuchPartial;
    pot.noSuchProcessor = this.preseved.noSuchProcessor;
  },

  'test version': function () {
    assertNotUndefined(pot.version);
  },

  'test prepare and render: it shoud accept an object': function () {
    /*:DOC +=
     <div id="template">
     {{name}} is {{age}} years old.
     </div>
     <div id="expected">
     hoge is 20 years old.
     </div>
     */
    var template = pot.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should use a "partials" option prior to a "partials" setting': function () {
    /*:DOC +=
     <div id="template">
     {{@person}}
     </div>
     <div id="expected">
     hoge is 20 years old.
     </div>
     */
    pot.templates.person = "[{{name}}] is {{age}} years old.";
    var options = {
      templates: {
        person: "{{name}} is {{age}} years old."
      }
    };
    var template = pot.prepare(this.html('template'), options);
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should use a "partials" setting, if a "partials" option does not exist': function () {
    /*:DOC +=
     <div id="template">
     {{@person}}
     </div>
     <div id="expected">
     [hoge] is 20 years old.
     </div>
     */
    pot.templates.person = "[{{name}}] is {{age}} years old.";
    var template = pot.prepare(this.html('template'));
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
    pot.processors.enclose = function (value) {
      return '%' + value + '%';
    };
    var options = {
      processors: {
        enclose: function (value) {
          return '[' + value + ']';
        }
      }
    };
    var template = pot.prepare(this.html('template'), options);
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
    pot.processors.enclose = function (value) {
      return '[' + value + ']';
    };
    var template = pot.prepare(this.html('template'));
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
    pot.noSuchValue = function () {};
    var options = {
      noSuchValue: function (name) {
        return '[' + name + ' is not found]';
      }
    };
    var template = pot.prepare(this.html('template'), options);
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
    pot.noSuchValue = function (name) {
      return '[' + name + ' is not found]';
    };
    var template = pot.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should use a "noSuchPartial" option prior to a "noSuchPartial" setting': function () {
    /*:DOC +=
     <div id="template">
     {{@person}}
     </div>
     <div id="expected">
     [person is not found]
     </div>
     */
    pot.noSuchPartial = function () {};
    var options = {
      noSuchPartial: function (name) {
        return '[' + name + ' is not found]';
      }
    };
    var template = pot.prepare(this.html('template'), options);
    var result = template.render({});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should use a "noSuchPartial" setting, if a "noSuchPartial" option does not exitst': function () {
    /*:DOC +=
     <div id="template">
     {{@person}}
     </div>
     <div id="expected">
     [person is not found]
     </div>
     */
    pot.noSuchPartial = function (name) {
      return '[' + name + ' is not found]';
    };
    var template = pot.prepare(this.html('template'));
    var result = template.render({});
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
    pot.noSuchProcessor = function () {};
    var options = {
      noSuchProcessor: function (pipeName, value, valueName) {
        return '[' + pipeName + ',' + value + ',' + valueName + ']';
      }
    };
    var template = pot.prepare(this.html('template'), options);
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
    pot.noSuchProcessor = function (processorName, value, valueName) {
      return '[' + processorName + ',' + value + ',' + valueName + ']';
    };
    var template = pot.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should accept a pre-compiled function': function () {
    /*:DOC +=
     <div id="template">
     {{name}} is {{age}} years old.
     </div>
     <div id="expected">
     hoge is 20 years old.
     </div>
     */
    var f = pot.internal.core.compile(this.html('template'));
    var template = pot.prepare(f);
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test prepare and render: it should not accept illegal value': function () {
    assertException(function () {
      pot.prepare(10);
    });
  },

  'test processors: it should accept valueInfo': function () {
    /*:DOC +=
     <div id="template">
     {{name|describe}} | {{age|describe}}
     </div>
     <div id="expected">
     name=name, value=hoge, index=undefined, hasNext=undefined | name=age, value=20, index=undefined, hasNext=undefined
     </div>
     */
    pot.processors.describe = function (value, valueName, index, hasNext) {
      return 'name=' + valueName + ', value=' + value + ', index=' + index + ', hasNext=' + hasNext;
    };
    var template = pot.prepare(this.html('template'));
    var result = template.render({name: 'hoge', age: 20});
    assertSame(this.html('expected'), result);
  },

  'test processors: it should accept valueInfo in array': function () {
    /*:DOC +=
     <div id="template">
     {{#array}}{{$this|describe}}{{#$hasNext}} | {{/$hasNext}}{{/array}}
     </div>
     <div id="expected">
     name=$this, value=aaa, index=0, hasNext=true | name=$this, value=bbb, index=1, hasNext=false
     </div>
     */
    pot.processors.describe = function (value, valueName, index, hasNext) {
      return 'name=' + valueName + ', value=' + value + ', index=' + index + ', hasNext=' + hasNext;
    };
    var template = pot.prepare(this.html('template'));
    var result = template.render({array:['aaa', 'bbb']});
    assertSame(this.html('expected'), result);
  }


});