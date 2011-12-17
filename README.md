tempura — simple templating library in javascript
=================================================

tempura is templating library inspired by [mustache.js](http://github.com/janl/mustache.js) and 
[tempo](https://github.com/twigkit/tempo).

Some features are similar with mustache.js.
The most unique feature in tempura is the pipeline processing.

> Usage

Below is quick example how to use tempura:

    var data = {
      name: "Joe",
      calc: function () {
        return 200 + 4000;
      },
      dollar: function (value) {
        var regex = /(\d+)(\d{3})/;
        var s = String(value);
        while (s.match(regex)) {
          s = s.replace(regex, '$1' + ',' + '$2');
        }
        return '$' + s;
      }
    };
    
    var tmpl = tempura.prepare("{{name}} spends {{calc|dollar}}");
    var html = tmpl.render(data);
    
    console.log(html);

Below is the result:

    Joe spends $4,200

The pipeline processing is useful for formatting and coversion.

Differences Between tempura and mustache.js
-------------------------------------------

### Pipeline Processing

### Context Access

### Missing Value Handling