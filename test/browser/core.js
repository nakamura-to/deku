TestCase('core', {

  'setUp': function () {
    this.core = tempura.internal.core;
  },

  'test prepare: it should return a object': function () {
    var template = this.core.prepare('', {});
    assertObject(template);
    assertFunction(template.render);
  },

  'test handleBlock: it should accept array and handle each element in the handler': function () {
    var context = {
      array: ['aaa', 'bbb', 'ccc']
    };
    var result = this.core.handleBlock(context, [], context.array, function (context) {
      return context + '-';
    });
    assertSame('aaa-bbb-ccc-', result);
  },

  'test handleBlock: it should accept object and handle it in the handler': function () {
    var context = {
      name: 'aaa',
      person: {
        name: 'bbb'
      }
    };
    var result = this.core.handleBlock(context, [], context.person, function (context) {
      return context.name;
    });
    assertSame('bbb', result);
  },

  'test handleBlock: it should accept truthy value and handle the original context in the handler': function () {
    var context = {
      name: 'aaa',
      flag: true
    };
    var result = this.core.handleBlock(context, [], context.flag, function (context) {
      return context.name;
    });
    assertSame('aaa', result);
  },

  'test handleBlock: it should accept falsy value and not call the handler': function () {
    var context = {
      name: 'aaa',
      flag: false
    };
    var result = this.core.handleBlock(context, [], context.flag, function (context) {
      return context.name;
    });
    assertSame('', result);
  },

  'test handleInverse: it should accept falsy value and handle the original context in the handler': function () {
    var context = {
      name: 'aaa',
      flag: false
    };
    var result = this.core.handleInverse(context, [], context.flag, function (context) {
      return context.name;
    });
    assertSame('aaa', result);
  },

  'test handleInverse: it should accept empty array and handle the original context in the handler': function () {
    var context = {
      name: 'aaa',
      array: []
    };
    var result = this.core.handleInverse(context, [], context.array, function (context) {
      return context.name;
    });
    assertSame('aaa', result);
  }

});