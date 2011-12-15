/*jslint browser: true, forin: true, indent:2, plusplus: true, vars: true */
(function (global) {
  'use strict';

  var undef;

  var util = {

    toString: Object.prototype.toString,

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

    trim: function (s) {
      return (s === null || s === undef) ? '' :  s.replace(/^\s*|\s*$/g, '');
    },

    extend: function (obj) {
      var args = util.slice.call(arguments, 1);
      var len = args.length;
      var i;
      var source;
      var prop;
      if (obj === null || obj === undef) {
        return obj;
      }
      for (i = 0; i < len; i++) {
        source = args[i];
        if (source !== null && source !== undef) {
          for (prop in source) {
            if (obj[prop] === undef) {
              obj[prop] = source[prop];
            }
          }
        }
      }
      return obj;
    },

    encode: function (html) {
      html = (html === null || html === undef) ? '' : String(html);
      return html.replace(/[&"'<>]/g, function (s) {
        switch (s) {
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        default: return s;
        }
      });
    }

  };

  var core = {

    TEMPURA_CONTEXT_MARK: '__tempura__',

    TEMPURA_OPTIONS: '$options',

    ROOT_CONTEXT: '$root',

    PARENT_CONTEXT: '$parent',

    THIS: '$this',

    includes: function (directive, template) {
      return template.indexOf('{{' + directive) !== -1;
    },

    createContext: function (parent, data) {
      var context;
      if (data[core.TEMPURA_CONTEXT_MARK]) {
        return data;
      } else {
        if (!parent[core.TEMPURA_CONTEXT_MARK]) {
          throw new Error('illegal parent context.');
        }
        context = {};
        context[core.TEMPURA_CONTEXT_MARK] = true;
        context[core.TEMPURA_OPTIONS] = parent[core.TEMPURA_OPTIONS];
        context[core.ROOT_CONTEXT] = parent[core.ROOT_CONTEXT];
        context[core.PARENT_CONTEXT] = parent;
        context[core.THIS] = data;
        return util.extend(context, data);
      }
    },

    walk: function (path, context) {
      var names;
      var value;
      path = util.trim(path);
      names = path.split('.');
      value = context[names.shift()];
      while (value !== null && value !== undef && names.length > 0) {
        context = core.createContext(context, value);
        value = context[names.shift()];
      }
      return {
        value: value,
        context: context
      };
    },

    format: function (value, fmtName, context) {
      var wrapper;
      var contextFormatter;
      var optionFormatter;
      var globalFormatter;
      var options = context[core.TEMPURA_OPTIONS];
      fmtName = util.trim(fmtName);
      if (options !== undef) {
        if (options.formatters !== undef) {
          optionFormatter = options.formatters[fmtName];
        }
        globalFormatter = options.globalFormatter;
      }
      wrapper = core.walk(fmtName, context);
      contextFormatter = wrapper.value;
      if (util.isFunction(contextFormatter)) {
        value = contextFormatter.call(wrapper.context, value);
      } else if (util.isFunction(optionFormatter)) {
        value = optionFormatter.call(context, value);
      }
      if (util.isFunction(globalFormatter)) {
        value = globalFormatter.call(context, value);
      }
      return value;
    },

    resolve: function (path, fmtName, context) {
      var wrapper = core.walk(path, context);
      var value = wrapper.value;
      context = wrapper.context;
      if (util.isFunction(value)) {
        value = value.call(context);
      }
      return core.format(value, fmtName, context);
    },

    transformTags: (function () {
      var regex = new RegExp([
        '{{',
        '([#\\^/!{])?(.+?)(?:\\|(.*?))?', // $1, $2, $3
        '}}+'
      ].join(''), 'g');
      return function (template, context) {
        var callback = function (match, directive, path, fmtName) {
          var value;
          switch (directive) {
          case '#':
            return '{{#' + path + '}}';
          case '^':
            return '{{^' + path + '}}';
          case '/':
            return '{{/' + path + '}}';
          case '!':
            return '';
          case '{':
            return core.resolve(path, fmtName, context);
          default:
            value = core.resolve(path, fmtName, context);
            return util.encode(value);
          }
        };
        var lines = template.split('\n');
        var line;
        var i;
        var len = lines.length;
        for (i = 0; i < len; i++) {
          line = lines[i];
          lines[i] = line.replace(regex, callback);
        }
        return lines.join('\n');
      };
    }()),

    transformSection: (function () {
      var regex = new RegExp([
        '^([\\s\\S]*?)',   // $1
        '{{',
        '([#\\^])\\s*(.+)\\s*', // $2, $3
        '}}',
        '\n*([\\s\\S]*?)', // $4
        '{{',
        '\\/\\s*\\3\\s*',
        '}}',
        '\n*([\\s\\S]*)$' // $5
      ].join(''), 'g');
      return function (template, context) {
        if (!core.includes('#', template) && !core.includes('^', template)) {
          return false;
        }
        return template.replace(regex, function (match, before, type, name, content, after) {
          var renderedBefore = before ? core.transformTags(before, context) : '';
          var renderedAfter = after ? core.transform(after, context) : '';
          var wrapper = core.walk(name, context);
          var renderedContent = (function (value, context) {
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
              } else if (util.isFunction(value)) {
                var bool = value.call(context);
                if (bool) {
                  return core.transform(content, context);
                }
              } else if (util.isObject(value)) {
                return core.transform(content, core.createContext(context, value));
              } else if (value) {
                return core.transform(content, context);
              }
            } else if (type === '^') {
              if ((util.isArray(value) && value.length === 0) || !value) {
                return core.transform(content, context);
              }
            }
            return '';
          }(wrapper.value, wrapper.context));
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

    prepare: function (template, options) {
      return function (data) {
        return core.toHtml(template, data, options);
      };
    }

  };

  //noinspection JSUnusedGlobalSymbols
  var tempura = global.tempura = {

    name: 'tempura',

    version: '0.0.1',

    formatters: {},

    globalFormatter: function (value) {
      return typeof value === 'undefined' ? '' : value;
    },

    prepare: function (template, options) {
      var opts = {
        formatters: {},
        globalFormatter: tempura.globalFormatter
      };
      if (options) {
        util.extend(opts.formatters, options.formatters, tempura.formatters);
      }
      return core.prepare(template, options);
    },

    internal: {
      util: util,
      core: core
    }
  };

}(window));