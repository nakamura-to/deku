(function (define, require) {
  var compiler = require('compiler');
  var core = {
    isObject: function (obj) {
      return obj === Object(obj);
    },

    isArray: Array.isArray || function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    },

    extend: function (target) {
      var len = arguments.length;
      var i;
      var source;
      var key;
      if (target == null) {
        return target;
      }
      for (i = 1; i < len; i++) {
        source = arguments[i];
        if (source != null) {
          for (key in source) {
            if (target[key] === void 0) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    },

    escape: (function () {
      var map = {
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;',
        '<': '&lt;',
        '>': '&gt;'
      };
      var checkRegex = /[&"'<>]/;
      var replaceRegex = /[&"'<>]/g;
      return function (value) {
        if (value == null) {
          return '';
        }
        value = String(value);
        if (!checkRegex.test(value)) {
          return value;
        }
        return value.replace(replaceRegex, function (s) {
          return map[s];
        });
      };
    }()),

    compile: typeof compiler !== 'undefined' ? compiler.compile : function () {
      throw new Error("The deku.runtime.js doesn't support to compile partial templates. " +
        "Consider to compile all partial templates with deku compiler in advance.");
    },


    handleBlock: function (context, contextStack, value, fn) {
      var result = '';
      var i;
      var len;
      var element;
      if (core.isArray(value)) {
        len = value.length;
        for (i = 0; i < len; i++) {
          element = value[i];
          contextStack.push(element);
          result += fn(element, contextStack, i, i + 1 < len, len);
          contextStack.pop();
        }
      } else if (core.isObject(value)) {
        contextStack.push(value);
        result = fn(value, contextStack);
        contextStack.pop();
      } else if (value) {
        result = fn(context, contextStack);
      }
      return result;
    },

    handleInverse: function (context, contextStack, value, fn) {
      var result = '';
      if (!value) {
        result = fn(context, contextStack);
      } else if (core.isArray(value) && value.length === 0) {
        result = fn(context, contextStack);
      }
      return result;
    },

    handlePartial: function (context, contextStack, index, hasNext, length, value, partialName) {
      var self = this;
      var template;
      var fn;
      var result;
      template = self.partialResolver(partialName);
      if (template == null) {
        return self.noSuchPartial(partialName, value);
      }
      if (typeof template === "function") {
        fn = template;
      } else {
        fn = core.compile(template);
        self.partials[partialName] = fn;
      }
      contextStack.push(value);
      result = fn.call(self, value, contextStack, index, hasNext, length);
      contextStack.pop();
      return result;
    },

    prepare: function (template, options) {
      var templateContext = {
        escape: core.escape,
        handleBlock: core.handleBlock,
        handleInverse: core.handleInverse,
        handlePartial: core.handlePartial,
        noSuchValue: options.noSuchValue,
        noSuchProcessor: options.noSuchProcessor,
        noSuchPartial: options.noSuchPartial,
        prePipeline: options.prePipeline,
        postPipeline: options.postPipeline,
        partialResolver: options.partialResolver,
        values: options.values,
        partials: options.partials,
        templates: options.templates,
        processors: options.processors
      };
      return function (data) {
        return template.call(templateContext, data  != null ? data : {});
      };
    }
  };
  
  define(core);
  
}(function (core) {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = core;
    } else {
      deku.internal.core = core;
    }
  },
  function (name) {
    if (typeof module !== 'undefined' && module.exports) {
      return require('./' + name);
    } else {
      return deku.internal[name];
    }
  }
));