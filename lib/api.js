(function (define, require, deku) {
  var core = require('core');
    
  // information
  deku.name = 'deku';
  deku.version = '0.0.6dev';

  // settings
  deku.templates = {};
  deku.processors = {};
  deku.prePipeline = function (value, valueName, index, hasNext) {
    return value;
  };
  deku.postPipeline = function (value, valueName, index, hasNext) {
    return value == null ? '': value;
  };
  deku.noSuchValue = function (valueName) {
    throw new Error('The value "' + valueName + '" is not found.');
  };
  deku.noSuchPartial = function (partialName) {
    throw new Error('The partial "' + partialName + '" is not found.');
  };
  deku.noSuchProcessor = function (processorName, value, valueName) {
    throw new Error('The processor "' + processorName + '" for the value "' + valueName + '" is not found.');
  };
  deku.sourceResolver = function (source, options) {
    if (typeof source !== 'string' && typeof source !== 'function') {
      throw new Error('The argument "source" must be a string or a function.');
    }
    return source;
  };

  // behavior
  deku.prepare = function (source, options) {
    var opts = {};
    source = deku.sourceResolver(source, options);
    options = options || {};
    opts.noSuchValue = options.noSuchValue || deku.noSuchValue;
    opts.noSuchPartial = options.noSuchPartial || deku.noSuchPartial;
    opts.noSuchProcessor = options.noSuchProcessor || deku.noSuchProcessor;
    opts.prePipeline = options.prePipeline || deku.prePipeline;
    opts.postPipeline = options.postPipeline || deku.postPipeline;
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
    return core.prepare(source, opts);
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