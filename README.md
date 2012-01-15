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
deku.js allows you to chain formatters and converters flexibly.

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

For trial use, latest version is available by adding the following script.

```html
<script src="http://nakamura-to.github.com/deku/deku-latest.js"></script>
```

Differences Between deku.js and mustache.js
-------------------------------------------

### Pipeline

The most unique feature in deku.js is the pipeline.
The pipeline allows you to apply functions to a value.
This feature is useful for formatting and conversion.

To use the pipeline, specify a pipe (`|`) after the value, and then specify the function after the pipe.

```js
var source = "{{name}}'s weight is {{weight | kg}}, or {{weight | g}}.";
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

You can separate functions (we call them processors) from data.

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
var source = "{{name}}'s weight is {{weight | kg}}, or {{weight | g}}.";
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

You can chain multiple processors with pipes.

```js
var source = '{{name | yeah | enclose}}';
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

deku.js provides hook points before and after applying processors.

> javascript

```js
deku.prePipeline = function (value, valueName) {
    console.log('prePipeline is invoked for the "%s".', valueName);
    return value === null ? '***' : value;
};
deku.postPipeline = function (value, valueName) {
    console.log('postPipeline is invoked for the "%s".', valueName);
    return value;
};
var source = '{{name | upper}} lives in {{city | lower}}.';
var template = deku.compile(source);
var data = {
    name: 'Joe',
    city: null,
    upper: function (value, valueName) {
        console.log('upper is invoked for the "%s".', valueName);
        return value.toUpperCase();
    },
    lower: function (value, valueName) {
        console.log('lower is invoked for the "%s".', valueName);
        return value.toLowerCase();
    }
};
var result = template(data);

console.log(result);
```

> output

```
prePipeline is invoked for the "name".
upper is invoked for the "name".
postPipeline is invoked for the "name".
prePipeline is invoked for the "city".
lower is invoked for the "city".
postPipeline is invoked for the "city".
JOE lives in ***.
```

### Data Context Access

deku.js provides following special identifiers to access data contexts.

* @this : the reference to the current data context
* @parent : the reference to the parent of @this
* @root : the reference to the root data context
* @0, @1, @2.. @n : the reference indexes. @0 is same as @this. @1 is same as @parent. @2 is the parent of @1. @3 is the parent of @2, and so on. 

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

deku.js can handle value/processor/partial missings.
This features are useful for debugging.

> javascript

```js
deku.noSuchValue = function (valueName) {
    console.log('the value "' + valueName + '" is not found.');
};
deku.noSuchProcessor = function (processorName, value, valueName) {
    console.log('the processor "' + processorName + '" is not found for the value "' + valueName + '".');
    return value;
};
deku.noSuchPartial = function (partialName) {
    console.log('the partial "' + partialName + '" is not found.');
    return '';
};
var source = '{{name|unknownProcessor}} is {{unknownValue}} {{:unknownPartial}}';
var template = deku.compile(source);
var data = {name: 'Joe'};
var result = template(data);

console.log(result);
```

> output

```
the processor "unknownProcessor" is not found for the value "name".
the value "unknownValue" is not found.
the partial "unknownPartial" is not found.
Joe is
```

### Pre-compiling Templates

deku provides the template compiling script. 

#### Installing

The compiling script can be installed with the following command.

```
$ npm install -g deku
```

#### Usage

Execute the following commmand.

```
$ deku templatefile_or_directory
```

##### Quick Example

Make a template file.

> hello.deku

```
hello {{name | upper}} !!!
```

Execute the compiling script.

```
$ deku -f hello.js hello.deku
```

Check the compiled result.

> hello.js

```js
(function () {
deku.templates["hello"] = function (context, contextStack, index, hasNext, length) {
  var self = this, value, valueContext, buffer = "", contextStack = contextStack || [context], escape = this.escape, handleBlock = this.handleBlock, handleInverse = this.handleInverse, handlePartial = this.handlePartial, noSuchValue = this.noSuchValue, noSuchProcessor = this.noSuchProcessor, prePipeline = this.prePipeline, postPipeline = this.postPipeline, processors = this.processors, processor, processorContext, values = this.values;

  buffer += "hello ";
  valueContext = context;
  value = valueContext["name"];
  if (typeof value === "function") { value = value.call(valueContext); }
  else if (value === void 0) {
    value = values["name"];
    if (typeof value === "function") { value = value.call(context); }
    else if (value === void 0) {
       value = noSuchValue.call(context, "name"); } }
  value = prePipeline.call(context, value, "name", index, hasNext, length);
  processorContext = context;
  processor = processorContext["upper"];
  if (typeof processor === "function") { value = processor.call(processorContext, value, "name", index, hasNext, length); }
  else { processor = processors["upper"];
    if (typeof processor === "function") { value = processor.call(context, value, "name", index, hasNext, length); }
    else { value = noSuchProcessor.call(context, "upper", value, "name"); }}
  value = postPipeline.call(context, value, "name", index, hasNext, length);
  value = escape(value);
  buffer += value;
  buffer += " !!!";
  return buffer;
};

}());
```

Use the compiled result file. 
For example, include it in your web page using the script tag.

> html

```html
<script src="http://nakamura-to.github.com/deku/deku-latest.js"></script>
<!-- HERE -->
<script src="hello.js"></script>
<script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
<div id="result"></div>
```

In javascript, call `deku.use` function to get the compiled template.

> javascript

```js
var template = deku.use('hello');
var data = {
    name: 'Joe', 
    upper: function(value) { 
        return value.toUpperCase(); 
    }
};
$('#result').html(template(data)); // hello JOE !!!
```

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
This tag accepts 2 arguments.
The first argument is a partial template name and the second argument is a data context in the partial template (When the second argument is omitted, the current data context is used) .
The partial template can be registered in advance.
Alternatively, you can resolve partials on demand if you replace the `deku.partialResolver` function with your own implementation.

> input

```html
Welcome, {{name}}! {{:winningsMessage winnings}}
```

> process

```js
deku.partials.winningsMessage = 'You just won ${{value}} (which is ${{taxed_value}} after tax)';

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

### HTML Escaping and Unescaping

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

Settings and Options
--------------------

Settings are global parameters for all templates.
They are represented as properties of `deku`.

Options are local parameters for specific  templates.
They are represented as parameters of `deku.compile` or `deku.use`.

If a same value is found in both, the value found in options is used.

### values
When the value is not found in the data passed for the template, deku try to find the value from the `values` object. 

### partials
This is an object retains partial template and compiled partial template.
deku try to find partial templates from this.

### templates
This is an object retains compiled template.
`deku.use` try to find compiled template functions from this.

### processors
When the processor is not found in the data passed for the template, 
deku try to find the processor from the `processors` object. 

### prePipeline
This is a function invoked before pipeline processing. 

### postPipeline
This is a function invoked after pipeline processing. 

### noSuchValue
This is a function invoked when the value is not found.

### noSuchPartial
This is a function invoked when the partial is not found.

### noSuchProcessor
This is a function invoked when the processor is not found.

### partialResolver
This is a function invoked to find partial templates.

#### Quick Example

> javascript

```js
deku.prePipeline = function (value, valueName) {
    console.log('"' + valueName + '" is processing.');
    return value;
};
deku.postPipeline = function (value, valueName) {
    console.log('"' + valueName + '" is processed.');
    return value;
};
var options = {
    processors: {
        date : function(value) {
            switch (value.getDay()) {
                case 0: return 'Sun.';
                case 1: return 'Man.';
                case 2: return 'Tue.';
                case 3: return 'Wed.';
                case 4: return 'Thu.';
                case 5: return 'Fri.';
                case 6: return 'Sat.';
            }
        }
    }
};
var template = deku.compile('Hello {{name}}. Today is {{now | date}}', options);
var result = template({name: 'Joe', now: new Date()});
console.log(result);
```

> output

```
"name" is processing.
"name" is processed.
"now" is processing.
"now" is processed.
Hello Joe. Today is Sun.
```