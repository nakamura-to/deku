(function (pot, core) {
  // information
  pot.name = 'pot';
  pot.version = '0.0.5dev';

  // settings
  pot.templates = {};
  pot.processors = {};
  pot.prePipeline = function (value, valueName, index, hasNext) {
    return value;
  };
  pot.postPipeline = function (value, valueName, index, hasNext) {
    return value == null ? '': value;
  };
  pot.noSuchValue = function (valueName) {
    throw new Error('The value "' + valueName + '" is not found.');
  };
  pot.noSuchPartial = function (partialName) {
    throw new Error('The partial "' + partialName + '" is not found.');
  };
  pot.noSuchProcessor = function (processorName, value, valueName) {
    throw new Error('The processor "' + processorName + '" for the value "' + valueName + '" is not found.');
  };

  // behavior
  pot.prepare = function (source, options) {
    var opts = {};
    if (typeof source !== 'string' && typeof source !== 'function') {
      throw new Error('The argument "source" must be a string or a function.');
    }
    options = options || {};
    opts.noSuchValue = options.noSuchValue || pot.noSuchValue;
    opts.noSuchPartial = options.noSuchPartial || pot.noSuchPartial;
    opts.noSuchProcessor = options.noSuchProcessor || pot.noSuchProcessor;
    opts.prePipeline = options.prePipeline || pot.prePipeline;
    opts.postPipeline = options.postPipeline || pot.postPipeline;
    opts.templates = core.extend({}, options.templates, pot.templates);
    opts.processors = core.extend({}, options.processors, pot.processors);
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

  if (typeof module !== 'undefined') {
    module.exports = pot;
  } else if (typeof define === 'function' && define.amd) {
    define(pot);
  }

}(typeof module !== 'undefined' ? {} : pot,
  typeof module !== 'undefined' ? require('./internal/core') : pot.internal.core));