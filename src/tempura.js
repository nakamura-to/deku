/*jslint browser: true, forin: true, indent:2, plusplus: true, vars: true */
(function (global, undef) {
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

    trim: function (s) {
      if (!util.isString(s)) {
        throw new Error('"' + s + '" is not string.');
      }
      return s.replace(/^\s*|\s*$/g, '');
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

    encodeHtml: function (html) {
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

    TEMPURA_OPTIONS: '__tempura__options',

    ROOT_CONTEXT: '$root',

    PARENT_CONTEXT: '$parent',

    THIS: '$this',

    includes: function (directive, template) {
      return template.indexOf('{{' + directive) !== -1;
    },

    walk: function (path, context) {
      var nomalizedPath = util.trim(path);
      var names = nomalizedPath.split('.');
      var value = context[names.shift()];
      while (value !== null && value !== undef && names.length > 0) {
        context = value;
        value = context[names.shift()];
      }
      if (util.isFunction(value)) {
        return value.call(context);
      }
      return value;
    },

    find: function (path, obj) {
      return core.walk(path, obj);
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
        '([#\\^/!{])?(.+?)(?:\\|(.*?))?', // $1, $2, $3
        '}}+'
      ].join(''), 'g');
      var format = function (value, fmtName, context) {
        var formatter;
        var globalFormatter;
        var options = context[core.TEMPURA_OPTIONS];
        if (options === undef) {
          return value;
        }
        if (options.formatters !== undef) {
          formatter = options.formatters[fmtName];
        }
        globalFormatter = options.globalFormatter;
        if (util.isFunction(formatter)) {
          value = formatter.call(context, value);
        }
        if (util.isFunction(globalFormatter)) {
          value = globalFormatter.call(context, value);
        }
        return value;
      };
      var getValue = function (path, fmtName, context) {
        var value = core.find(path, context);
        if (util.isFunction(value)) {
          value = value.call(context);
        }
        if (util.isString(fmtName)) {
          fmtName = util.trim(fmtName);
          value = format(value, fmtName, context);
        }
        return value;
      };
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
            // todo
            return getValue(path, fmtName, context);
          default:
            // todo
            value = getValue(path, fmtName, context);
            return util.encodeHtml(value);
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

    prepare: function (template, options) {
      return function (data) {
        var html = core.toHtml(template, data, options);
        return html;
      };
    }

  };

  //noinspection JSUnusedGlobalSymbols
  var tempura = {

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
      util.extend(opts.formatters, options.formatters, tempura.formatters);
      return core.prepare(template, options);
    },

    // internal
    internal: {
      util: util,
      core: core
    }
  };

  global.tempura = tempura;

}(window));