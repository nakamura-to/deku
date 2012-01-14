(function (define, require, deku) {
  var core = require('core');
  var prepare = function (template, options) {
    var opts = {};
    options = options || {};
    opts.noSuchValue = options.noSuchValue || deku.noSuchValue;
    opts.noSuchPartial = options.noSuchPartial || deku.noSuchPartial;
    opts.noSuchProcessor = options.noSuchProcessor || deku.noSuchProcessor;
    opts.prePipeline = options.prePipeline || deku.prePipeline;
    opts.postPipeline = options.postPipeline || deku.postPipeline;
    opts.partialResolver = options.partialResolver || deku.partialResolver;
    opts.values = core.extend({}, options.values, deku.values);
    opts.partials = core.extend({}, options.partials, deku.partials);
    opts.templates = core.extend({}, options.templates, deku.templates);
    opts.processors = core.extend({}, options.processors, deku.processors);
    if (typeof opts.noSuchValue !== 'function') {
      throw new Error('The "noSuchValue" option or setting must be a function.');
    }
    if (typeof opts.noSuchPartial !== 'function') {
      throw new Error('The "noSuchPartial" option or setting must be a function.');
    }
    if (typeof opts.noSuchProcessor !== 'function') {
      throw new Error('The "noSuchProcessor" option or setting must be a function.');
    }
    if (typeof opts.prePipeline !== 'function') {
      throw new Error('The "prePipeline" option or setting must be a function.');
    }
    if (typeof opts.postPipeline !== 'function') {
      throw new Error('The "postPipeline" option or setting must be a function.');
    }
    return core.prepare(template, opts);
  };
    
  // information
  deku.name = 'deku';
  deku.version = '0.0.6dev';

  // settings
  deku.partials = {};
  deku.templates = {};
  deku.values = {};
  deku.processors = {};
  deku.prePipeline = function (value, valueName, index, hasNext, length) {
    return value;
  };
  deku.postPipeline = function (value, valueName, index, hasNext, length) {
    return value == null ? '': value;
  };
  deku.noSuchValue = function (valueName) {
    throw new Error('The value "' + valueName + '" is not found.');
  };
  deku.noSuchPartial = function (partialName, context) {
    throw new Error('The partial "' + partialName + '" is not found.');
  };
  deku.noSuchProcessor = function (processorName, value, valueName) {
    throw new Error('The processor "' + processorName + '" for the value "' + valueName + '" is not found.');
  };
  deku.partialResolver = function (partialName) {
    var templateContext = this;
    var template = templateContext.partials[partialName];
    if (template == null) {
      template = templateContext.templates[partialName];
    }
    return template;
  };

  // behavior
  deku.compile = function (source, options) {
    var template;
    var type = typeof source;
    if (type === 'string') {
      template = core.compile(source);
    } else if (type === 'function') {
      template = source;
    } else {
      throw new Error('The argument "source" must be a string or a function.');
    }
    return prepare(template, options);
  };
  deku.use = function (name, options) {
    var template = deku.templates[name];
    var type = typeof template;
    if (type === 'undefined') {
      throw new Error('The template "' + name + '" is not found.');      
    } else if (type !== 'function') {
      throw new Error('The template "' + name + '" must be a function.');
    }
    return prepare(template, options);
  };

  define(deku);

}(function (deku) {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = deku;
    } 
    if (typeof define === 'function' && define.amd) {
      define(deku);
    }
  },
  function (name) {
    if (typeof module !== 'undefined' && module.exports) {
      return require('./internal/' + name);
    } else {
      return deku.internal[name];
    }
  },
  typeof module !== 'undefined' && module.exports? {} : deku
));