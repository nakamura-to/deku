TestCase('parser', {

  'setUp': function () {
    this.parser = pot.internal.parser;
  },

  'test whitespaces': function () {
    var ast = this.parser.parse('{{# aaa }} {{ bbb | xxx | yyy }} {{^ ccc }} {{{ ddd }}} {{/ ccc }} {{/ aaa }}');
    assertNotUndefined(ast);
  }

});