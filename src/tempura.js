/*jslint browser: true, forin: true, indent:2, plusplus: true, vars: true */
(function (global) {
  'use strict';

  var util = {

    toString: Object.prototype.toString,

    hasOwnProperty: Object.prototype.hasOwnProperty,

    slice: Array.prototype.slice,

    isObject: function (obj) {
      return util.toString.call(obj) === '[object Object]';
    },

    isArray: function (obj) {
      return util.toString.call(obj) === '[object Array]';
    },

    isFunction: function (obj) {
      return util.toString.call(obj) === '[object Function]';
    },

    isString: function (obj) {
      return util.toString.call(obj) === '[object String]';
    },

    isElement: function (obj) {
      return obj !== null && typeof obj !== 'undefined' && obj.nodeType === 1;
    },

    trim: function (s) {
      return s.replace(/^¥s*|¥s*$/g, '');
    },

    extend: function (obj) {
      var args = util.slice.call(arguments, 1);
      var len = args.length;
      var i;
      var source;
      var prop;
      for (i = 0; i < len; i++) {
        source = args[i];
        for (prop in source) {
          if (util.hasOwnProperty.call(source, prop)) {
            if (typeof obj[prop] === 'undefined') {
              obj[prop] = source[prop];
            }
          }
        }
      }
      return obj;
    },

    encodeHtml: (function () {
      var regex = /[&"'<>]/g;
      return function (html) {
        html = (html === null || typeof html === 'undefined') ? '' : String(html);
        return html.replace(regex, function (s) {
          switch (s) {
          case '&': return '&amp;';
          case '"': return '&quot;';
          case "'": return '&#39;';
          case '<': return '&lt;';
          case '>': return '&gt;';
          default: return s;
          }
        });
      };
    }()),

    uniqueId: (function () {
      var counter = 0;
      return function (prefix) {
        var id = counter++;
        return prefix ? prefix + id : id;
      };
    }())

  };

  var core = {

    TEMPURA_CONTEXT_MARK: '__tempura__',

    TEMPURA_OPTIONS: '__tempura__options',

    ROOT_CONTEXT: '$root',

    PARENT_CONTEXT: '$parent',

    THIS: '$this',

    options: {
      convert: function (name, value, context) {
        return typeof value === 'undefined' ? '' : value;
      },
      afterRender: function (element) {
        // todo
        if (element.style.removeAttribute) {
          element.style.removeAttribute('display');
        } else {
          element.style.removeProperty('display');
        }
      }
    },

    includes: function (directive, template) {
      return template.indexOf('{{' + directive) !== -1;
    },

    walkObject: function (name, object) {
      var path = name.split('.');
      var context = object;
      var value = context[path.shift()];
      while (value !== null && typeof value !== 'undefined' && path.length > 0) {
        context = value;
        value = context[path.shift()];
      }
      if (util.isFunction(value)) {
        return value.call(context);
      }
      return value;
    },

    find: function (name, object) {
      var n = util.trim(name);
      return core.walkObject(n, object);
    },

    createContext: function (parent, data) {
      var context = data;
      if (!data[core.TEMPURA_CONTEXT_MARK]) {
        if (!parent[core.TEMPURA_CONTEXT_MARK]) {
          throw new Error('illegal parent context.');
        }
        context = {};
        context[core.TEMPURA_CONTEXT_MARK] = true;
        context[core.TEMPURA_OPTIONS] = parent[core.TEMPURA_OPTIONS];
        context[core.ROOT_CONTEXT] = parent[core.ROOT_CONTEXT];
        context[core.PARENT_CONTEXT] = parent;
        context[core.THIS] = data;
        util.extend(context, data);
      }
      return context;
    },

    transformTags: (function () {
      var regex = new RegExp([
        '{{',
        '([#/!{])?(.+?)\\1?', // $1, $2
        '}}+'
      ].join(''), 'g');
      return function (template, context) {
        var find = function (name) {
          var value = core.find(name, context);
          var options = context[core.TEMPURA_OPTIONS];
          if (typeof options === 'undefined') {
            options = core.options;
          }
          return options.convert(name, value, context);
        };
        var callback = function (match, directive, name) {
          switch (directive) {
          case '#': return '{{#' + name + '}}';
          case '/': return '{{/' + name + '}}';
          case '!': return '';
          case '{': return find(name);
          default: return util.encodeHtml(find(name));
          }
        };
        var lines = template.split('\n');
        var len = lines.length;
        var i;
        for (i = 0; i < len; i++) {
          lines[i] = lines[i].replace(regex, callback);
        }
        return lines.join('\n');
      };
    }()),

    transformSection: (function () {
      var regex = new RegExp([
        '^([\\s\\S]*?)',   // $1
        '{{',
        '(#)\\s*(.+)\\s*', // $2, $3
        '}}',
        '\n*([\\s\\S]*?)', // $4
        '{{',
        '\\/\\s*\\3\\s*',
        '}}',
        '\\s*([\\s\\S]*)$' // $5
      ].join(''), 'g');
      return function (template, context) {
        if (!core.includes('#', template)) {
          return false;
        }
        return template.replace(regex, function (match, before, type, name, content, after) {
          var renderedBefore = before ? core.transformTags(before, context) : '';
          var renderedAfter = after ? core.transformTags(after, context) : '';
          var value = core.find(name, context);
          var renderedContent = (function () {
            if (type === '#') {
              if (util.isArray(value)) {
                return (function () {
                  var i;
                  var len = value.length;
                  var array = [];
                  for (i = 0; i < len; i++) {
                    array[i] = core.transform(content, core.createContext(context, value[i]));
                  }
                  return array.join('');
                }());
              }
              if (util.isObject(value)) {
                return core.transform(content, core.createContext(context, value));
              }
              if (value) {
                return core.transform(content, context);
              }
            }
            return '';
          }());
          return renderedBefore + renderedContent + renderedAfter;
        });
      };
    }()),

    transform: function (template, context) {
      var html = core.transformSection(template, context);
      if (html === false) {
        html = core.transformTags(template, context);
      }
      return html;
    },

    createInitialContext: function (data, options) {
      var context = {};
      context[core.TEMPURA_CONTEXT_MARK] = true;
      context[core.TEMPURA_OPTIONS] = options;
      context[core.ROOT_CONTEXT] = context;
      context[core.PARENT_CONTEXT] = null;
      context[core.THIS] = data;
      util.extend(context, data);
      return context;
    },

    toHtml: function (template, data, options) {
      var context = core.createInitialContext(data, options);
      return core.transform(template, context);
    },

    getTemplate: (function () {
      var TEMPURA_ID = "__tempura__";
      var cache = {};
      return function (element) {
        var template;
        var id = element[TEMPURA_ID];
        if (!id) {
          id = util.uniqueId('tempura');
          element[TEMPURA_ID] = id;
        }
        template = cache[id];
        if (template === null || typeof template === 'undefined') {
          template = element.innerHTML;
          cache[id] = template;
        }
        return template;
      };
    }()),

    render: function (element, data, options) {
      var template;
      var html;
      if (!util.isElement(element)) {
        throw new Error('argument "element" is not an element.');
      }
      template = core.getTemplate(element);
      html = core.toHtml(template, data, options);
      // todo. we need to remove children before set html ?
      element.innerHTML = html;
    }

  };

  //noinspection JSUnusedGlobalSymbols
  global.tempura = {

    version: '0.0.1',

    setGlobalOptions: function (options) {
      core.options = options;
    },

    getGlobalOptions: function () {
      return core.options;
    },

    render: function (element, data, options) {
      var opts = options || {};
      opts = util.extend({}, opts, core.options);
      core.render(element, data, opts);
      opts.afterRender(element);
    },

    // internal
    internal: {
      util: util,
      core: core
    }
  };

}(window));