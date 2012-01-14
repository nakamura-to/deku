deku — javascript templating library focused on pipeline processing
===================================================================

deku.js is templating library inspired by [mustache.js](https://github.com/janl/mustache.js),
[tempo](https://github.com/twigkit/tempo) and [handlebars.js](https://github.com/wycats/handlebars.js/).

## Why deku.js ?

Templating libraries should be *secure*, *performant* and *declarative*.

### Secure

In this context, "secure" means preventing XSS. 
deku.js escapes html characters which would cause XSS by default.

### Performant

Parsing and transforming templates many times are high cost.  
To reduce the cost, deku.js compiles templates to javascript programs once, and then executes them.
The compiling available both at runtime and at deploy time.

[Comparison with other templating libraries](http://jsperf.com/deku-vs-other-templating-engines/3)

### Declarative

From the view of maintenance, value fromatting and conversion should be represented declaratively.
deku.js allow you to chain formatters and converters flexibly.

## Usage

### Quick Example

Below is quick example how to use deku.js:

```js
var source = '{{name}} spends {{calc}}';
var template = deku.compile(source);
var data = {
    name: 'Joe',
    calc: function () {
        return 200 + 4000;
    }
};
var result = template(data);

console.log(result); // Joe spends 4200
```

### Quick Example with jQuery

Below is the typical usage with jQuery.

> html

```html
<script src="http://nakamura-to.github.com/deku/deku-latest.js"></script>
<script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
<script id="template" type="text/template">
{{name}} spends {{calc}}
</script>
<div id="result"></div>
```

> javascript

```js
var source = $('#template').html();
var template = deku.compile(source);
var data = {
    name: 'Joe',
    calc: function () {
        return 200 + 4000;
    }
};
$('#result').html(template(data)); // Joe spends 4200
```

Installing
----------

### Node.js

If you're developing with Node.js, just use NPM to add the deku package.

```
$ npm install deku
```

deku.js is [Express](http://expressjs.com/) compliant out of the box. 
Below setting is required in Express.

```js
app.set('view engine', 'deku');
```

### Browser

[Download](https://github.com/nakamura-to/deku/downloads) the deku.js and include it in your web page using the script tag.

Differences Between deku.js and mustache.js
-------------------------------------------

### Pipeline Processing

The most unique feature in deku.js is the pipeline processing.
This feature is useful for formatting and conversion.

```js
var source = "{{name}}'s weight is {{weight|kg}}, or {{weight|g}}.";
var template = deku.compile(source);
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
var result = template(data);

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
var template = deku.compile(source, options);
var data = {name: 'Joe', weight: 65};
var result = template(data);

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
var template = deku.compile(source);
var data = {name: 'Joe', weight: 65};
var result = template(data);

console.log(result); // Joe's weight is 65kg, or 65000g.
```

More than one processor are available.

```js
var source = '{{name|yeah|enclose}}';
var template = deku.compile(source);
var data = {
    name: 'Joe',
    yeah: function (value) {
        return value + '!';
    },
    enclose: function (value) {
        return '[' + value + ']';
    }
};
var result = template(data);

console.log(result); // [Joe!]
```


### Data Context Access

deku.js provides following special identifiers to access data context.

* @this : the reference to the current data context
* @parent : the reference to the parent of @this
* @root : the reference to the root data context
* @0, @1, .. @n : @0 is same with @this and @1 is same with @parent. @2 is the parent of @1. @3 is the parent of @2, and so on. 

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
var template = deku.compile(source);
var data = {name: 'Joe'};
var result = template(data);

console.log(result); // Joe is
```

deku.js provides a hook point to handle all values before and after applying pipeline functions.
It's means you can check or convert erroneous values.

```js
deku.postPipeline = function (value) {
    return value === null ? '***' : value;
};
var source = '{{name}} is {{age}} years old.';
var template = deku.compile(source);
var data = {name: 'Joe', age: null};
var result = template(data);

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

Tags begin with `{{` and end with `}}`.

> source

```
{{sayHello}}, {{name}}.
```

> process

```js
var source = ... // above content ;
var template = deku.compile(source);
var data = {
    name: 'Joe', 
    sayHello: function () {
        return 'hello';
    }
};
var result = template(data);
```

> result

```
hello, Joe.
```

### Conditional Blocks

Conditional blocks begin with `{{#condition}}` and end with `{{/condition}}`.
When `condition` evaluates to true, the block is rendered.

> input

```html
{{#condition}}
  I will be visible if condition is true
{{/condition}}
```

> process

```js
var input = ... // above content
var template = deku.compile(input);
var data = {
    condition: function() {
        // [...your code goes here...]
        return true;
    };
};
var output = template(data);
```

> output

```
  I will be visible if condition is true
```

### Enumerable Blocks

Enumerable blocks begin with `{{#enumerable}}` and end with `{{/enumerable}}`. 
The `enumerable` must be Array.

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
var template = deku.compile(input);
var data = {
    name: "Joe's shopping card",
    iteme: ['bananas', 'apples']
};
var output = template(data);
```

> output

```html
Joe&#39;s shopping card:
<ul>
    <li>bananas</li>
    <li>apples</li>
</ul>
```

#### Special Identifiers in Enumerable Blocks

In enumerable blocks, following special identifiers are available:

* @index : the index of the enumerated element
* @hasNext : `true`, if the next element is existent
* @length : the length of the enumerable array

> input

```html
{{#items}}{{@this}} {{@index}}{{#@hasNext}}, {{/@hasNext}}{{/items}}
```

> process

```js
var input = ... // above content
var template = deku.compile(input);
var data = {
    name: "Joe's shopping card",
    items: ['bananas', 'apples']
};
var output = template(data);
```

> output

```html
bananas 0, apples 1
```

### Dereferencing Blocks

Dereferencing blocks begin with `{{#object}}` and end with `{{/object}}`.
The `object` must not be neither Array nor Function.

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
var template = deku.compile(input);
var data = {
    name: 'Bill',
    address: {
        street: '801 Streetly street',
        city: 'Boston',
        state: 'MA',
        zip: '02101'
    }
};
var output = template(data);
```

> output

```html
<h1>Contact: Bill</h1>
    <p>801 Streetly street</p>
    <p>Boston, MA 02101</p>
```

### Inverted Blocks

Inverted blocks begin with `{{^condition}}` and end with `{{/condition}}`. 
When `condition` evaluates to falth or `condition` is an empty array, the block is rendered.

> input

```html
{{#repo}}<b>{{name}}</b>{{/repo}}
{{^repo}}No repos :({{/repo}}
```

> process

```js
var input = ... // above content
var template = deku.compile(input);
var data = {
    repo: []
};
var output = template(data);
```

> output

```html
No repos :(
```

### Partials

Partials begin with `{{:` and end with `}}`.
The first argument is a partial template name.
The second argument is a data context in the partial template (When the second argument is omitted, the current data context is used) .
The partial template must be registered in advance.

> input

```html
Welcome, {{name}}! {{:winningsMessage winnings}}
```

> process

```js
deku.templates.winningsMessage = 'You just won ${{value}} (which is ${{taxed_value}} after tax)';

var input = ... // above content
var template = deku.compile(input);
var data = {
  name: 'Joe',
  winnings: {
    value: 1000,
    taxed_value: function() {
        return this.value - (this.value * 0.4);
    }
  }};
var output = template(data);
```

> output

```html
Welcome, Joe! You just won $1000 (which is $600 after tax)
```

### Escaping and Unescaping

Double mustaches like `{{value}}` always escape following characters: `&` `"` `'` `<` `>`.
To disable escaping, use triple mustaches like `{{{value}}}`.

> input

```html
escaping: {{value}}
unescaping: {{{value}}}
```

> process

```js
var input = ... // above content
var template = deku.compile(input);
var data = {value: '<span>hello</span>'}
var output = template(data);
```

> output

```html
escaping: &lt;span&gt;hello&lt;/span&gt;
unescaping: <span>hello</span>
```

### Comments

Comments begin with `{{!` and end with `}}`.

```html
{{! this is a comment }}
```
