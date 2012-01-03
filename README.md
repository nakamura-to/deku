tempura — simple templating library in javascript
=================================================

[tempura](http://nakamura-to.github.com/tempura/) is templating library inspired by [mustache.js](https://github.com/janl/mustache.js), 
[tempo](https://github.com/twigkit/tempo) and [handlebars.js](https://github.com/wycats/handlebars.js/).

Some features are similar with mustache.js.

> Usage

Below is quick example how to use tempura:

```js
var source = '{{name}} spends {{calc}}';
var template = tempura.prepare(source);

var data = {
    name: 'Joe',
    calc: function () {
        return 200 + 4000;
    }
};
var result = template.render(data);

console.log(result); // Joe spends 4200
```

## Installing

### Node.js

If you're developing with Node.js, just use NPM to add the tempura package.

```
$ npm install tempura
```

### Browser

[Download](https://github.com/nakamura-to/tempura/tags) the tempura.js and include it in your web page using the script tag.

Differences Between tempura and mustache.js
-------------------------------------------

### Pipeline Processing

The most unique feature in tempura is the pipeline processing. 
This feature is useful for formatting and coversion.

```js
var source = '{{name}} spends {{calc|dollar}}';
var template = tempura.prepare(source);

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
var result = template.render(data);

console.log(result); // Joe spends $4,200
```

More than one pipe function are available.

```js
var source = '{{name|yeah|enclose}}';
var template = tempura.prepare(source);

var data = {
    name: 'Joe',
    yeah: function (value) {
        return value + '!';
    },
    enclose: function (value) {
        return '[' + value + ']';
    }
};
var result = template.render(data);

console.log(result); // [Joe!]
```

You can define global pipe functions.

```js
tempura.settings.processors = {
    yeah: function (value) {
        return value + '!';
    },
    enclose: function (value) {
        return '[' + value + ']';
    }
};

var source = '{{name|yeah|enclose}}';
var template = tempura.prepare(source);

var data = {name: 'Joe'};
var result = template.render(data);

console.log(result); // [Joe!]
```

### Data Context Access

tempura provides following special identifiers to access data context. 

* $root : the reference to the root data context
* $parent : the reference to the parent data context
* $this : the reference to the current object

Given this object:

```js
var data = {
  rootName: 'root',
  parent: {
    parentName: 'parent',
      children: [
        'child 1',
        'child 2'
      ]
    },
};
```

And this template:

```html
<ul>
{{#parent}} 
  {{#children}}
  <li>{{$root.rootName}}/{{$parent.parentName}}/{{$this}}</li>
  {{/children}}
{{/parent}}
</ul>
```

We'll get this output:

```html
<ul>
  <li>root/parent/child 1</li>
  <li>root/parent/child 2</li>
</ul>
```

### Error Handling

tempura can handle the value missings.
This feature is useful for debugging.

```js
tempura.settings.noSuchValue = function (name) {
    console.warn('the value "' + name + '" is missing');
    return undefined;
};
tempura.settings.noSuchProcessor = function (name, value) {
    console.warn('the processor "' + name + '" is missing');
    return value;
};

var source = '{{name|unknownPipe1}} is {{unkonwnValue|unknownPipe2}}';
var template = tempura.prepare(source);

var data = {name: 'Joe'};
var result = template.render(data);

console.log(result); // Joe is
```

tempura provides a hook point to handle all values before and after applying pipeline functions.
It's means you can check or convert erroneous values.
(By the way, tempura converts undefined values to empty string by default preRender function.)

```js
tempura.settings.postPipeline = function (value) {
    return value === null ? '***' : value;
};

var source = 'name is {{name}}';
var template = tempura.prepare(source);

var data = {name: null};
var result = template.render(data);

console.log(result); // name is ***
```

### Others

Currently, tempura doesn't support following features, which mustache.js has:

* Higher Order Sections
* Streaming
* Pragmas