TestCase('parser', {

  'setUp': function () {
    this.parser = tempura.internal.parser;
  },

  'test whitespaces': function () {
    var result = this.parser.parse('{{# aaa }} {{ bbb | xxx | yyy }} {{^ ccc }} {{{ ddd }}} {{/ ccc }} {{/ aaa }}');
    assertNotUndefined(result);
  }

});