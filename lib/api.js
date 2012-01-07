(function (tempura, core) {
  tempura.name = 'tempura';
  tempura.version = '0.0.4';
  tempura.settings = {
    partials: {},

    processors: {},

    prePipeline: function (value, valueName, index, hasNext) {
      return value;
    },

    postPipeline: function (value, valueName, index, hasNext) {
      return value == null ? '': value;
    },

    noSuchValue: function (valueName) {
      throw new Error('The value "' + valueName + '" is not found.');
    },

    noSuchPartial: function (partialName) {
      throw new Error('The partial "' + partialName + '" is not found.');
    },

    noSuchProcessor: function (processorName, value, valueName) {
      throw new Error('The processor "' + processorName + '" for the value "' + valueName + '" is not found.');
    }
  };

  tempura.prepare = function (source, options) {
    var opts = {};
    if (source == null) {
      throw new Error('The argument "source" must be string.');
    }
    options = options || {};
    opts.noSuchValue = options.noSuchValue || this.settings.noSuchValue;
    opts.noSuchPartial = options.noSuchPartial || this.settings.noSuchPartial;
    opts.noSuchProcessor = options.noSuchProcessor || this.settings.noSuchProcessor;
    opts.prePipeline = options.prePipeline || this.settings.prePipeline;
    opts.postPipeline = options.postPipeline || this.settings.postPipeline;
    opts.partials = core.extend({}, options.partials, this.settings.partials);
    opts.processors = core.extend({}, options.processors, this.settings.processors);
    if (typeof opts.noSuchValue !== 'function') {
      throw new Error('The "noSuchValue" option or setting must be function.');
    }
    if (typeof opts.noSuchPartial !== 'function') {
      throw new Error('The "noSuchPartial" option or setting must be function.');
    }
    if (typeof opts.noSuchProcessor !== 'function') {
      throw new Error('The "noSuchProcessor" option or setting must be function.');
    }
    if (typeof opts.prePipeline !== 'function') {
      throw new Error('The "prePipeline" option or setting must be function.');
    }
    if (typeof opts.postPipeline !== 'function') {
      throw new Error('The "postPipeline" option or setting must be function.');
    }
    return core.prepare(source, opts);
  };

  if (typeof module !== 'undefined') {
    module.exports = tempura;
  }
}(typeof module !== 'undefined' ? {} : tempura,
  typeof module !== 'undefined' ? require('./internal/core') : tempura.internal.core));