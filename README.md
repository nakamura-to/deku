# tempura — simple templating library in javascript

tempura is templating library inspired by [mustache.js](http://github.com/janl/mustache.js) and 
[tempo](https://github.com/twigkit/tempo).

Some features are similar with mustache.js.
The most unique feature in tempura is the pipeline processing.

> Usage

Below is quick example how to use tempura:

    var data = {
      name: "Joe",
      calc: function () {
        return 2 + 4;
      },
      yeah: function (value) {
        return value + '!';
      }
      enclose: function (value) {
        return '[' + value + ']';
      }
    };

    var template = tempura.prepare("{{name|yeah|enclose}} spends {{calc}");
    var html = template.toHtml(data);

Below is result:

    [Joe!] spends 6


