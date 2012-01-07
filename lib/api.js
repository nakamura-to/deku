(function (tempura, core) {
  // information
  tempura.name = 'tempura';
  tempura.version = '0.0.5dev';

  // settings
  tempura.templates = {};
  tempura.processors = {};
  tempura.prePipeline = function (value, valueName, index, hasNext) {
    return value;
  };
  tempura.postPipeline = function (value, valueName, index, hasNext) {
    return value == null ? '': value;
  };
  tempura.noSuchValue = function (valueName) {
    throw new Error('The value "' + valueName + '" is not found.');
  };
  tempura.noSuchPartial = function (partialName) {
    throw new Error('The partial "' + partialName + '" is not found.');
  };
  tempura.noSuchProcessor = function (processorName, value, valueName) {
    throw new Error('The processor "' + processorName + '" for the value "' + valueName + '" is not found.');
  };

  // behavior
  tempura.prepare = function (source, options) {
    var opts = {};
    if (typeof source !== 'string' && typeof source !== 'function') {
      throw new Error('The argument "source" must be a string or a function.');
    }
    options = options || {};
    opts.noSuchValue = options.noSuchValue || tempura.noSuchValue;
    opts.noSuchPartial = options.noSuchPartial || tempura.noSuchPartial;
    opts.noSuchProcessor = options.noSuchProcessor || tempura.noSuchProcessor;
    opts.prePipeline = options.prePipeline || tempura.prePipeline;
    opts.postPipeline = options.postPipeline || tempura.postPipeline;
    opts.templates = core.extend({}, options.templates, tempura.templates);
    opts.processors = core.extend({}, options.processors, tempura.processors);
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
    module.exports = tempura;
  }
}(typeof module !== 'undefined' ? {} : tempura,
  typeof module !== 'undefined' ? require('./internal/core') : tempura.internal.core));