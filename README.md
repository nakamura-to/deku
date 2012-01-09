deku — javascript templating library focused on pipeline processing
===================================================================

deku.js is templating library inspired by [mustache.js](https://github.com/janl/mustache.js),
[tempo](https://github.com/twigkit/tempo) and [handlebars.js](https://github.com/wycats/handlebars.js/).
We deeply respect them.

Most features are similar with mustache.js.

> Usage

Below is quick example how to use deku.js:

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

Differences Between deku.js and mustache.js
-------------------------------------------

### Pipeline Processing

The most unique feature in deku.js is the pipeline processing.
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

deku.js provides following special identifiers to access data context.

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

deku.js can handle the value missings.
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

deku.js provides a hook point to handle all values before and after applying pipeline functions.
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

deku.js provides the template compiling script. 

> Installing

The compiling script can be installed with the following command.

```
$ npm install -g deku
```

> Usage

To compile, execute the following commmand.

```
$ deku templatefile_or_directory
```

### Others

Currently, deku.js doesn't support following features, which mustache.js has:

* Higher Order Sections
* Streaming
* Pragmas

Templating Tag Types
--------------------

There are several types of tags currently implemented in deku.js.

### Simple Tags

> source

```
{{sayHello}}, {{name}}.
```

> process

```js
var source = ... // above content ;
var template = deku.prepare(source);
var data = {
    name: 'Joe', 
    sayHello: function () {
        return 'hello';
    }
};
var result = template.render(data);
```

> result

```
hello, Joe.
```

### Conditional Blocks

> input

```html
{{#condition}}
  I will be visible if condition is true
{{/condition}}
```

> process

```js
var input = ... // above content
var template = deku.prepare(input);
var data = {
    condition: function() {
        // [...your code goes here...]
        return true;
    };
};
var output = template.render(data);
```

> output

```
  I will be visible if condition is true
```

### Enumerable Blocks

> input

```html
{{name}}:
<ul>
{{#items}}
    <li>{{@this}}</li>
{{/items}}
</ul>
```

> process

```js
var input = ... // above content
var template = deku.prepare(input);
var data = {
    name: "Joe's shopping card",
    itmes: ['bananas', 'apples'];
};
var output = template.render(data);
```

> output

```html
Joe$#39;s shopping card:
<ul>
    <li>bananas</li>
    <li>apples</li>
</ul>
```

### Dereferencing Blocks

> input

```html
<h1>Contact: {{name}}</h1>
{{#address}}
    <p>{{street}}</p>
    <p>{{city}}, {{state}} {{zip}}</p>
{{/address}}
```

> process

```js
var input = ... // above content
var template = deku.prepare(input);
var data = {
    name: 'Bill',
    address: {
        street: '801 Streetly street',
        city: 'Boston',
        state: 'MA',
        zip: '02101'
    }
};
var output = template.render(data);
```

> output

```html
<h1>Contact: Bill</h1>
    <p>801 Streetly street</p>
    <p>Boston, MA 02101</p>
```

### Inverted Blocks

> input

```html
{{#repo}}<b>{{name}}</b>{{/repo}}
{{^repo}}No repos :({{/repo}}
```

> process

```js
var input = ... // above content
var template = deku.prepare(input);
var data = {
    repo: []
};
var output = template.render(data);
```

> output

```html
No repos :(
```

### Partials

> input

```html
Welcome, {{name}}! {{:winningsMessage winnings}}
```

> process

```js
deku.templates.winningsMessage = 'You just won ${{value}} (which is ${{taxed_value}} after tax)';

var input = ... // above content
var template = deku.prepare(input);
var data = {
  name: 'Joe',
  winnings: {
    value: 1000,
    taxed_value: function() {
        return this.value - (this.value * 0.4);
    }
  }};
var output = template.render(data);
```

> output

```html
Welcome, Joe! You just won $1000 (which is $600 after tax)
```

### Escaping and Unescaping

> input

```html
escaping: {{value}}
unescaping: {{{value}}}
```

> process

```js
var input = ... // above content
var template = deku.prepare(input);
var data = {value: '<span>hello</span>'}
var output = template.render(data);
```

> output

```html
escaping: &lt;span&gt;hello&lt;/span&gt;
unescaping: <span>hello</span>
```
