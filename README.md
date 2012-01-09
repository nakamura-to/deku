deku — javascript templating library focused on pipeline processing
===================================================================

deku is templating library inspired by [mustache.js](https://github.com/janl/mustache.js),
[tempo](https://github.com/twigkit/tempo) and [handlebars.js](https://github.com/wycats/handlebars.js/).

Some features are similar with mustache.js.

> Usage

Below is quick example how to use deku:

```js
var source = '{{name}} spends {{calc}}';
var template = deku.prepare(source);
var data = {
    name: 'Joe',
    calc: function () {
        return 200 + 4000;
    }
};
var result = template.render(data);

console.log(result); // Joe spends 4200
```

Installing
----------

> Node.js

If you're developing with Node.js, just use NPM to add the deku package.

```
$ npm install deku
```

> Browser

[Download](https://github.com/nakamura-to/deku/downloads) the deku.js and include it in your web page using the script tag.

Differences Between deku and mustache.js
-------------------------------------------

### Pipeline Processing

The most unique feature in deku is the pipeline processing.
This feature is useful for formatting and conversion.

```js
var source = "{{name}}'s weight is {{weight|kg}}, or {{weight|g}}.";
var template = deku.prepare(source);
var data = {
    name: 'Joe',
    weight: 65,
    kg: function (value) {
        return value + 'kg';
    },
    g: function (value) {
        return value * 1000 + 'g';
    }
};
var result = template.render(data);

console.log(result); // Joe's weight is 65kg, or 65000g.
```

You can separate pipeline processing functions(processors) from data.

```js
var options = {
    processors: {
        kg : function (value) {
            return value + 'kg';
        },
        g : function (value) {
            return value * 1000 + 'g';
        } 
    }
};
var source = "{{name}}'s weight is {{weight|kg}}, or {{weight|g}}.";
var template = deku.prepare(source, options);
var data = {name: 'Joe', weight: 65};
var result = template.render(data);

console.log(result); // Joe's weight is 65kg, or 65000g.
```

You can define processors globaly.

```js
deku.processors.kg = function (value) {
    return value + 'kg';
};
deku.processors.g = function (value) {
    return value * 1000 + 'g';
};
var source = "{{name}}'s weight is {{weight|kg}}, or {{weight|g}}.";
var template = deku.prepare(source);
var data = {name: 'Joe', weight: 65};
var result = template.render(data);

console.log(result); // Joe's weight is 65kg, or 65000g.
```

More than one processor are available.

```js
var source = '{{name|yeah|enclose}}';
var template = deku.prepare(source);
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


### Data Context Access

deku provides following special identifiers to access data context.

* @root : the reference to the root data context
* @parent : the reference to the parent data context
* @this : the reference to the current object

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
  <li>{{@root.rootName}}/{{@parent.parentName}}/{{@this}}</li>
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

deku can handle the value missings.
This feature is useful for debugging.

```js
deku.noSuchValue = function (valueName) {
    console.warn('the value "' + valueName + '" is missing.');
};
deku.noSuchProcessor = function (processorName, value, valueName) {
    console.warn('the processor "' + processorName + '" is missing for the value "' + valueName + '".');
    return value;
};
var source = '{{name|unknownProcessor}} is {{unkonwnValue}}';
var template = deku.prepare(source);
var data = {name: 'Joe'};
var result = template.render(data);

console.log(result); // Joe is
```

deku provides a hook point to handle all values before and after applying pipeline functions.
It's means you can check or convert erroneous values.

```js
deku.postPipeline = function (value) {
    return value === null ? '***' : value;
};
var source = '{{name}} is {{age}} years old.';
var template = deku.prepare(source);
var data = {name: 'Joe', age: null};
var result = template.render(data);

console.log(result); // Joe is *** years old.
```

### Pre-compiling Templates

deku provides the template compiling script. 

> Installing

The compiler script can be installed with the following command.

```
$ npm install -g deku
```

> Usage

To compile, execute the following commmand.

```
$ deku templatefile_or_directory
```

### Others

Currently, deku doesn't support following features, which mustache.js has:

* Higher Order Sections
* Streaming
* Pragmas

Features
--------

### Simple Tags

### Conditional Blocks

### Enumerable Blocks

### Dereferencing Blocks

### Inverted Blocks

### Partials

### Reserved Identifiers

### Escaping