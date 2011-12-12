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
testCase('core', {

  'setUp': function () {
    this.core = tempura.internal.core;
  },

  'test defined': function () {
    assertNotUndefined(this.core);
  },

  'test walkObject: simple value': function () {
    var object = {
      person: {
        name: 'hoge'
      },
      name : 'foo'
    };
    assertEquals('hoge', this.core.walkObject('person.name', object));
    assertEquals('foo', this.core.walkObject('name', object));
  },

  'test walkObject: function value': function () {
    var object = {
      person: {
        name: function () {
          return 'hoge, ' + this.age;
        },
        age: 20
      }
    };
    assertEquals('hoge, 20', this.core.walkObject('person.name', object));
  },

  'test find': function () {
    var obj = {
      person: {
        name: 'hoge',
        age: null
      }
    };
    assertEquals('hoge', this.core.find(' person.name ', obj));
    assertEquals(null, this.core.find(' person.age ', obj));
    assertEquals(undefined, this.core.find('unknown', obj));
  },

  'test includes': function () {
    assertTrue(this.core.includes('#', '<div>{{#name}}</div>'));
    assertFalse(this.core.includes('#', '<div>name</div>'));
  },

  'test createInitialContext': function () {
    var obj = {};
    var context = this.core.createInitialContext(obj);
    assertTrue(context[this.core.TEMPURA_CONTEXT_MARK]);
    assertSame(context, context[this.core.ROOT_CONTEXT]);
    assertNull(context[this.core.PARENT_CONTEXT]);
    assertEquals(obj, context[this.core.THIS]);
  },

  'test transformTags': function () {
    var obj = {
      name: 'hoge',
      age: 20
    };
    assertEquals('hoge is 20 years old.', this.core.transformTags('{{name}} is {{age}} years old.', obj));
  },

  'test transformSection: template does not contain #': function () {
    var obj = {
      name: 'hoge',
      age: 20
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformSection('{{name}}', context);
    assertFalse(result);
  },

  'test transformSection: context': function () {
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
    assertEquals('aaa,,aaa,aaa|aaa,aaa,bbb,bbb|aaa,bbb,ccc,ccc', result);
  },

  'test transformSection: array of object': function () {
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
    assertEquals('[ aaa is 1 years old.\nbbb is 2 years old.\n]', result);
  },

  'test transformSection: array of string': function () {
    var obj = {
      people: [
        'aaa',
        'bbb'
      ]
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformSection('[ {{#people}}{{$this}}\n{{/people}} ]', context);
    assertEquals('[ aaa\nbbb\n]', result);
  },

  'test transformSection: object': function () {
    var obj = {
      person: {
        name: 'aaa',
        age: 1
      }
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transformSection('[ {{#person}}{{name}} is {{age}} years old.{{/person}} ]', context);
    assertEquals('[ aaa is 1 years old.]', result);
  },

  'test transform: tags': function () {
    var obj = {
      name: 'hoge',
      age: 20
    };
    assertEquals('hoge is 20 years old.', this.core.transform('{{name}} is {{age}} years old.', obj));
  },

  'test transform: section': function () {
    var obj = {
      person: {
        name: 'aaa',
        age: 1
      }
    };
    var context = this.core.createInitialContext(obj);
    var result = this.core.transform('[ {{#person}}{{name}} is {{age}} years old.{{/person}} ]', context);
    assertEquals('[ aaa is 1 years old.]', result);
  },

  'test toHtml: encode': function () {
    var obj = { value: '<b>' };
    var result = this.core.transform('{{value}}', obj);
    assertEquals('&lt;b&gt;', result);
  },

  'test toHtml: disable encode': function () {
    var obj = { value: '<b>' };
    var result = this.core.transform('{{{value}}}', obj);
    assertEquals('<b>', result);
  },

  'test getTemplate: ': function () {
    /*:DOC +=
     <div id="template"><div>Hello {{name}}</div></div>
     */
    var element = document.getElementById('template');
    assertEquals('<div>Hello {{name}}</div>', this.core.getTemplate(element));
    element.appendChild(document.createElement('div'));
    assertEquals('<div>Hello {{name}}</div>', this.core.getTemplate(element));
  }

});