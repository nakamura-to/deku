tempura — simple templating library in javascript
=================================================

tempura is templating library inspired by [mustache.js](http://github.com/janl/mustache.js) and 
[tempo](https://github.com/twigkit/tempo).

Some features are similar with mustache.js.

> Usage

Below is quick example how to use tempura:

```js
var data = {
  name: 'Joe',
  calc: function () {
    return 200 + 4000;
  }
};

var tmpl = tempura.prepare('{{name}} spends {{calc}}');
var html = tmpl.render(data);

console.log(html); // Joe spends 4200
```

Differences Between tempura and mustache.js
-------------------------------------------

### Pipeline Processing

The most unique feature in tempura is the pipeline processing. 
This feature is useful for formatting and coversion.

```js
var data = {
  name: 'Joe',
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

var tmpl = tempura.prepare('{{name}} spends {{calc|dollar}}');
var html = tmpl.render(data);    

console.log(html); // Joe spends $4,200
```

More than one pipe function are available.

```js
var data = {
  name: 'Joe',
  yeah: function (value) {
    return value + '!';
  },
  enclose: function (value) {
    return '[' + value + ']';
  }
};

var tmpl = tempura.prepare('{{name|yeah|enclose}}');
var html = tmpl.render(data);    

console.log(html); // [Joe!]
```

### Context Access

### Missing Value Handling