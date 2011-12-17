/*jslint browser: true, indent: 2, plusplus: true, sloppy: true, vars: true */
/*global
 tempura: false,
 TestCase: false,
 assertEquals: false,
 assertFalse: false,
 assertFunction: false,
 assertNotNull: false,
 assertNotUndefined: false,
 assertNull: false,
 assertObject: false,
 assertSame: true,
 assertTrue: false,
 fail: false */
var testCase = TestCase;
testCase('core', {

  'setUp': function () {
    this.core = tempura.internal.core;
  },

  'test walk: it should accept a simple property name': function () {
    var obj = {
      name : 'hoge'
    };
    var context = this.core.createInitialContext(obj);
    var wrapper = this.core.walk('name', context);
    assertSame('hoge', wrapper.value);
    assertSame(context, wrapper.context);
  },

  'test walk: it should accept a navigation path': function () {
    var obj = {
      person: {
        name: 'hoge'
      }
    };
    var context = this.core.createInitialContext(obj);
    var wrapper = this.core.walk('person.name', context);
    assertSame('hoge', wrapper.value);
    assertNotNull(obj.person, wrapper.context.$this);
  },

  'test walk: it should accept unknown path': function () {
    var obj = {
      person: {
        name: 'hoge'
      }
    };
    var context = this.core.createInitialContext(obj);
    var wrapper = this.core.walk('person.unknown', context);
    assertSame(undefined, wrapper.value);
    assertNotNull(obj.person, wrapper.context.$this);
  },

  'test createContext: it should return input data when the data is a tempura context' : function () {
    var parent = {};
    var data = {};
    data[this.core.TEMPURA_CONTEXT_MARK] = true;
    assertSame(data, this.core.createContext(parent, data));
  },

  'test createContext: it should return a new context when the input data is a plain object' : function () {
    var parent = {};
    var data = {};
    var context;
    parent[this.core.TEMPURA_CONTEXT_MARK] = true;
    parent[this.core.TEMPURA_OPTIONS] = {};
    parent[this.core.ROOT_CONTEXT] = {};
    parent[this.core.PARENT_CONTEXT] = {};
    parent[this.core.THIS] = {};
    context = this.core.createContext(parent, data);
    assertTrue(context[this.core.TEMPURA_CONTEXT_MARK]);
    assertSame(parent[this.core.TEMPURA_OPTIONS], context[this.core.TEMPURA_OPTIONS]);
    assertSame(parent[this.core.ROOT_CONTEXT], context[this.core.ROOT_CONTEXT]);
    assertSame(parent, context[this.core.PARENT_CONTEXT]);
    assertSame(data, context[this.core.THIS]);
  },

  'test includes: it should return true when a directive is included': function () {
    assertTrue(this.core.includes('#', '<div>{{#name}}</div>'));
    assertFalse(this.core.includes('#', '<div>#name</div>'));
  },

  'test createInitialContext': function () {
    var obj = {};
    var options = {};
    var context = this.core.createInitialContext(obj, options);
    assertTrue(context[this.core.TEMPURA_CONTEXT_MARK]);
    assertSame(options, context[this.core.TEMPURA_OPTIONS]);
    assertSame(context, context.$root);
    assertNull(context.$parent);
    assertSame(obj, context.$this);
  },

  'test applyPipe: it should use a context pipe, if the pipe exists': function () {
    var obj = {
      enclose: function (value) {
        return '$' + value + '$';
      }
    };
    var options = {
      pipes: {
        enclose: function (value) {
          return '[' + value + ']';
        }
      }
    };
    var context = this.core.createInitialContext(obj, options);
    var value = this.core.applyPipes('hoge', ['enclose'], context);
    assertSame('$hoge$', value);
  },

  'test applyPipes: it should use a context pipe, if the pipe exists: the pipe name can be path form': function () {
    var obj = {
      person: {
        age: 20,
        appendAge: function (value) {
          return value + this.age;
        }
      }
    };
    var context = this.core.createInitialContext(obj);
    var value = this.core.applyPipes('hoge', ['person.appendAge'], context);
    assertSame('hoge20', value);
  },

  'test applyPipes: it should use a option pipe, if the same name pipe does not in the context': function () {
    var obj = {
    };
    var options = {
      pipes: {
        enclose: function (value) {
          return '[' + value + ']';
        }
      }
    };
    var context = this.core.createInitialContext(obj, options);
    var value = this.core.applyPipes('hoge', ['enclose'], context);
    assertSame('[hoge]', value);
  },

  'test resolveValue: it should evaluate a string': function () {
    var obj = {
      person: {
        name: 'hoge'
      }
    };
    var context = this.core.createInitialContext(obj);
    var value = this.core.resolveValue('person.name', [], context);
    assertSame('hoge', value);
  },

  'test resolveValue: it should evaluate a number': function () {
    var obj = {
      person: {
        age: 20
      }
    };
    var context = this.core.createInitialContext(obj);
    var value = this.core.resolveValue('person.age', [], context);
    assertSame(20, value);
  },

  'test resolveValue: it should evaluate a function': function () {
    var obj = {
      person: {
        name: function () {
          return this.$root.start + 'hoge is ' + this.age + ' years old' + this.$root.end;
        },
        age: 20
      },
      start: '[',
      end: ']'
    };
    var context = this.core.createInitialContext(obj);
    var value = this.core.resolveValue('person.name', [], context);
    assertSame('[hoge is 20 years old]', value);
  },

  'test resolveValue: it should evaluate preRender': function () {
    var obj = {
      person: {
        name: 'hoge'
      },
      enclose: function (value, mark) {
        return mark + value + mark;
      },
      pipe1: function (value) {
        return this.enclose(value, '@');
      },
      pipe2: function (value) {
        return this.enclose(value, '#');
      },
      pipe3: function (value) {
        return this.enclose(value, '%');
      }
    };
    var options = {
      preRender: function (value, next) {
        value = next(value);
        return value + '!';
      }
    };
    var context = this.core.createInitialContext(obj, options);
    var value = this.core.resolveValue('person.name', ['pipe1', 'pipe2', 'pipe3'], context);
    assertSame('%#@hoge@#%!', value);
  },

  'test transformTags: it should resolve property references': function () {
    var obj = {
      name: 'hoge',
      age: 20
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformTags('{{name}} is {{age}} years old.', context);
    assertSame('hoge is 20 years old.', result);
  },

  'test transformTags: it should apply pipes after resolving property reference': function () {
    var obj = {
      name: 'hoge',
      age: 20,
      double: function (value) {
        return value * 2;
      }
    };
    var options = {
      pipes: {
        enclose: function (value) {
          return '[' + value + ']';
        }
      }
    };
    var context = this.core.createInitialContext(obj, options);
    var result = this.core.transformTags('{{name|enclose}} is {{age|double|enclose}} years old.', context);
    assertSame('[hoge] is [40] years old.', result);
  },

  'test transformSection: it should return false if the input template does not contain "{{#" or "{{^"': function () {
    var obj = {
      name: 'hoge',
      age: 20
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformSection('{{name}}', context);
    assertFalse(result);
  },

  'test transformSection: it should resolve context specific properties': function () {
    var obj = {
      rootName: 'aaa',
      parent: {
        parentName: 'bbb',
        child: {
          childName: 'ccc'
        }
      }
    };
    var context = this.core.createInitialContext(obj);
    var template = [
      '{{$root.rootName}},{{$parent.rootName}},{{$this.rootName}},{{rootName}}|',
      '{{#parent}}{{$root.rootName}},{{$parent.rootName}},{{$this.parentName}},{{parentName}}|',
      '{{#child}}{{$root.rootName}},{{$parent.parentName}},{{$this.childName}},{{childName}}{{/child}}{{/parent}}'
    ].join('');
    var result = this.core.transformSection(template, context);
    assertSame('aaa,,aaa,aaa|aaa,aaa,bbb,bbb|aaa,bbb,ccc,ccc', result);
  },

  'test transformSection: it should iterate array of object': function () {
    var obj = {
      people: [{
        name: 'aaa',
        age: 1
      }, {
        name: 'bbb',
        age: 2
      }]
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformSection('[ {{#people}}{{name}} is {{age}} years old.\n{{/people}} ]', context);
    assertSame('[ aaa is 1 years old.\nbbb is 2 years old.\n ]', result);
  },

  'test transformSection: it should iterate array of string': function () {
    var obj = {
      people: [
        'aaa',
        'bbb'
      ]
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformSection('[ {{#people}}{{$this}}\n{{/people}} ]', context);
    assertSame('[ aaa\nbbb\n ]', result);
  },

  'test transformSection: it should invoke function and if the result is true, it should handle content': function () {
    var obj = {
      value: 'hoge',
      isOk: function () {
        return true;
      }
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformSection('[ {{#isOk}}{{value}}{{/isOk}} ]', context);
    assertSame('[ hoge ]', result);
  },

  'test transformSection: it should invoke function and if the result is false, it should ignore content': function () {
    var obj = {
      value: 'hoge',
      isOk: function () {
        return false;
      }
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformSection('[ {{#isOk}}{{value}}{{/isOk}} ]', context);
    assertSame('[  ]', result);
  },

  'test transformSection: it should dereference object': function () {
    var obj = {
      person: {
        name: 'aaa',
        age: 1
      }
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformSection('[ {{#person}}{{name}} is {{age}} years old.{{/person}} ]', context);
    assertSame('[ aaa is 1 years old. ]', result);
  },

  'test transformSection: it should evaluate boolean value as condition to handle content': function () {
    var obj = {
      value: true
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformSection('[ {{#value}}aaa{{/value}}{{^value}}bbb{{/value}} ]', context);
    assertSame('[ aaa ]', result);
  },

  'test transform: it should handle a template contains tags': function () {
    var obj = {
      name: 'hoge',
      age: 20
    };
    var result = this.core.transform('{{name}} is {{age}} years old.', obj);
    assertSame('hoge is 20 years old.', result);
  },

  'test transform: it should handle a template contains sections': function () {
    var obj = {
      person: {
        name: 'aaa',
        age: 1
      },
      address: {
        street: 'bbb'
      }
    };
    var context = this.core.createInitialContext(obj);
    var template = '[ {{#person}}{{name}} is {{age}} years old.{{/person}} {{#address}}street is {{street}}.{{/address}} ]';
    var result = this.core.transform(template, context);
    assertSame('[ aaa is 1 years old. street is bbb. ]', result);
  },

  'test toHtml: it should encode a value if the value is enclosed with "{{" and "}}"': function () {
    var obj = { str: '<a>', num: 1, func : function () { return '<b>'; } };
    var result = this.core.toHtml('{{str}},{{num}},{{func}}', obj);
    assertSame('&lt;a&gt;,1,&lt;b&gt;', result);
  },

  'test toHtml: it should not encode value if the value is enclosed with "{{{" and "}}}"': function () {
    var obj = { str: '<a>', num: 1, func : function () { return '<b>'; } };
    var result = this.core.toHtml('{{{str}}},{{{num}}},{{{func}}}', obj);
    assertSame('<a>,1,<b>', result);
  },

  'test prepare: it should return a object': function () {
    var template = this.core.prepare('');
    assertObject(template);
    assertFunction(template.render);
  }

});