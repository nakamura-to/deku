pot — simple templating library in javascript
=================================================

[pot](http://nakamura-to.github.com/pot/) is templating library inspired by [mustache.js](https://github.com/janl/mustache.js),
[tempo](https://github.com/twigkit/tempo) and [handlebars.js](https://github.com/wycats/handlebars.js/).

Some features are similar with mustache.js.

> Usage

Below is quick example how to use pot:

```js
var source = '{{name}} spends {{calc}}';
var template = pot.prepare(source);

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

If you're developing with Node.js, just use NPM to add the pot package.

```
$ npm install pot
```

### Browser

[Download](https://github.com/nakamura-to/pot/tags) the pot.js and include it in your web page using the script tag.

Differences Between pot and mustache.js
-------------------------------------------

### Pipeline Processing

The most unique feature in pot is the pipeline processing.
This feature is useful for formatting and coversion.

```js
var source = '{{name}} spends {{calc|dollar}}';
var template = pot.prepare(source);

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
var template = pot.prepare(source);

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
pot.settings.processors = {
    yeah: function (value) {
        return value + '!';
    },
    enclose: function (value) {
        return '[' + value + ']';
    }
};

var source = '{{name|yeah|enclose}}';
var template = pot.prepare(source);

var data = {name: 'Joe'};
var result = template.render(data);

console.log(result); // [Joe!]
```

### Data Context Access

pot provides following special identifiers to access data context.

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

pot can handle the value missings.
This feature is useful for debugging.

```js
pot.settings.noSuchValue = function (name) {
    console.warn('the value "' + name + '" is missing');
    return undefined;
};
pot.settings.noSuchProcessor = function (name, value) {
    console.warn('the processor "' + name + '" is missing');
    return value;
};

var source = '{{name|unknownPipe1}} is {{unkonwnValue|unknownPipe2}}';
var template = pot.prepare(source);

var data = {name: 'Joe'};
var result = template.render(data);

console.log(result); // Joe is
```

pot provides a hook point to handle all values before and after applying pipeline functions.
It's means you can check or convert erroneous values.
(By the way, pot converts undefined values to empty string by default preRender function.)

```js
pot.settings.postPipeline = function (value) {
    return value === null ? '***' : value;
};

var source = 'name is {{name}}';
var template = pot.prepare(source);

var data = {name: null};
var result = template.render(data);

console.log(result); // name is ***
```

### Others

Currently, pot doesn't support following features, which mustache.js has:

* Higher Order Sections
* Streaming
* Pragmas