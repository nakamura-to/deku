(function (deku, compiler) {
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
      }
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
          result += fn(element, contextStack, i, i + 1 < len);
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
      } else if ((core.isArray(value) && value.length === 0)) {
        result = fn(context, contextStack);
      }
      return result;
    },

    prepare: function (source, options) {
      var template = typeof source === 'string' ? core.compile(source) : source;
      var templateContext = {
        escape: core.escape,
        compile: core.compile,
        handleBlock: core.handleBlock,
        handleInverse: core.handleInverse,
        noSuchValue: options.noSuchValue,
        noSuchPartial: options.noSuchPartial,
        noSuchProcessor: options.noSuchProcessor,
        prePipeline: options.prePipeline,
        postPipeline: options.postPipeline,
        templates: options.templates,
        processors: options.processors
      };
      return {
        render: function (data) {
          return template.call(templateContext, data);
        }
      };
    }
  };

  if (typeof module !== 'undefined') {
    module.exports = core;
  } else {
    deku.internal.core = core;
  }

}(typeof module !== 'undefined' ? {} : deku,
  typeof module !== 'undefined' ? require('./compiler') : deku.internal.compiler));