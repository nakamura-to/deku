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
testCase('util', {

  'setUp': function () {
    this.util = tempura.internal.util;
  },

  'test isPlainObject': function () {
    assertTrue(this.util.isPlainObject({}));
    assertFalse(this.util.isPlainObject([]));
    assertFalse(this.util.isPlainObject(function () {}));
    assertFalse(this.util.isPlainObject('aaa'));
    assertFalse(this.util.isPlainObject(1));
    assertFalse(this.util.isPlainObject(new Date()));
    assertFalse(this.util.isPlainObject(/aaa/));
    assertFalse(this.util.isPlainObject(null));
    assertFalse(this.util.isPlainObject(undefined));
  },

  'test isFunction': function () {
    assertTrue(this.util.isFunction(function () {}));
    assertFalse(this.util.isFunction({}));
    assertFalse(this.util.isFunction([]));
    assertFalse(this.util.isFunction('aaa'));
    assertFalse(this.util.isFunction(1));
    assertFalse(this.util.isFunction(new Date()));
    assertFalse(this.util.isFunction(/aaa/));
    assertFalse(this.util.isFunction(null));
    assertFalse(this.util.isFunction(undefined));
  },

  'test isArray': function () {
    assertTrue(this.util.isArray([]));
    assertFalse(this.util.isArray({}));
    assertFalse(this.util.isArray(function () {}));
    assertFalse(this.util.isArray('aaa'));
    assertFalse(this.util.isArray(1));
    assertFalse(this.util.isArray(new Date()));
    assertFalse(this.util.isArray(/aaa/));
    assertFalse(this.util.isArray(null));
    assertFalse(this.util.isArray(undefined));
  },

  'test isString': function () {
    assertTrue(this.util.isString('aaa'));
    assertFalse(this.util.isString({}));
    assertFalse(this.util.isString([]));
    assertFalse(this.util.isString(function () {}));
    assertFalse(this.util.isString(1));
    assertFalse(this.util.isString(new Date()));
    assertFalse(this.util.isString(/aaa/));
    assertFalse(this.util.isString(null));
    assertFalse(this.util.isString(undefined));
  },

  'test trim': function () {
    assertSame('abc', this.util.trim('  abc  '));
    assertSame('', this.util.trim(null));
    assertSame('', this.util.trim(undefined));
  },

  'test extend': function () {
    var obj = {
      name: 'hoge',
      age: 20
    };
    var result = this.util.extend(obj, {name: 'foo', job: 'salesman'}, {birthday: '2011/12/11'});
    assertSame(obj, result);
    assertSame('hoge', obj.name);
    assertSame(20, obj.age);
    assertSame('salesman', obj.job);
    assertSame('2011/12/11', obj.birthday);
  },

  'test encode': function () {
    assertSame('&amp;', this.util.encode('&'));
    assertSame('&quot;', this.util.encode('"'));
    assertSame('&#39;', this.util.encode("'"));
    assertSame('&lt;', this.util.encode('<'));
    assertSame('&gt;', this.util.encode('>'));
    assertSame('a&amp;b&quot;c&#39;d&lt;e&gt;f', this.util.encode('a&b"c\'d<e>f'));
    assertSame('abc', this.util.encode('abc'));
    assertSame('123', this.util.encode(123));
    assertSame('', this.util.encode(null));
    assertSame('', this.util.encode(undefined));
  },

  'test deepExtend: string': function () {
    var target = {
      str: 'aaa'
    };
    var source = {
      str: 'bbb',
      strNew: 'ccc'
    };
    var result = this.util.deepExtend(target, source);
    assertSame(target, result);
    assertSame('aaa', target.str);
    assertSame('ccc', target.strNew);
  },

  'test deepExtend: plain object': function () {
    var target = {
      obj: {
        name: 'aaa'
      }
    };
    var source = {
      obj: {
        name: 'bbb',
        age: 20
      },
      objNew: {
        name: 'ccc',
        age: 30
      }
    };
    var result = this.util.deepExtend(target, source);
    assertSame(target, result);
    assertSame('aaa', target.obj.name);
    assertSame(20, target.obj.age);
    assertSame('ccc', target.objNew.name);
    assertSame(30, target.objNew.age);
  },

  'test deepExtend: array': function () {
    var target = {
      array: [
        'aaa',
        {name: 'bbb'}
      ]
    };
    var source = {
      array: [
        'aaa',
        {name: 'bbb'},
        123
      ],
      arrayNew: [
        'aaa',
        {name: 'bbb'}
      ]
    };
    var result = this.util.deepExtend(target, source);
    assertSame(target, result);
    assertSame('aaa', target.array[0]);
    assertSame('bbb', target.array[1].name);
    assertSame(123, target.array[2]);
    assertSame('aaa', target.arrayNew[0]);
    assertSame('bbb', target.arrayNew[1].name);
  },

  'test deepExtend: function': function () {
    var target = {
      func: function () {
        return 'aaa';
      }
    };
    var source = {
      func: function () {
        return 'bbb';
      },
      funcNew: function () {
        return 'ccc';
      }
    };
    var result = this.util.deepExtend(target, source);
    assertSame(target, result);
    assertSame('aaa', target.func());
    assertSame('ccc', target.funcNew());
  },

  'test deepExtend: it should accept multiple source objects.': function () {
    var target = {
      str: 'aaa'
    };
    var source1 = {
      str: 'bbb',
      str1: 'ccc'
    };
    var source2 = {
      str: 'ddd',
      str1: 'eee',
      str2: 'fff'
    };
    var result = this.util.deepExtend(target, source1, source2);
    assertSame(target, result);
    assertSame('aaa', target.str);
    assertSame('ccc', target.str1);
    assertSame('fff', target.str2);
  }

});