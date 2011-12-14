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
      return s.replace(/^¥s*|¥s*$/g, '');
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

    encodeHtml: (function () {
      var regex = /[&"'<>]/g;
      return function (html) {
        html = (html === null || html === undef) ? '' : String(html);
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
        var result = value;
        if (util.isFunction(value)) {
          result = value.call(context);
        }
        return result === undef ? '' : result;
      }
    },

    includes: function (directive, template) {
      return template.indexOf('{{' + directive) !== -1;
    },

    walkObject: function (name, obj) {
      var path = name.split('.');
      var context = obj;
      var value = context[path.shift()];
      while (value !== null && value !== undef && path.length > 0) {
        context = value;
        value = context[path.shift()];
      }
      if (util.isFunction(value)) {
        return value.call(context);
      }
      return value;
    },

    find: function (name, obj) {
      var n = util.trim(name);
      return core.walkObject(n, obj);
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
        '([#\\^/!{])?(.+?)\\1?', // $1, $2
        '}}+'
      ].join(''), 'g');
      return function (template, context) {
        var find = function (name) {
          var value = core.find(name, context);
          var options = context[core.TEMPURA_OPTIONS];
          if (options === undef) {
            options = core.options;
          }
          return options.convert(name, value, context);
        };
        var callback = function (match, directive, name) {
          switch (directive) {
          case '#': return '{{#' + name + '}}';
          case '^': return '{{^' + name + '}}';
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
      var opts = util.extend({}, options, core.options);
      return function (data) {
        var html = core.toHtml(template, data, opts);
        return html;
      };
    }

  };

  //noinspection JSUnusedGlobalSymbols
  global.tempura = {

    version: '0.0.1',

    setGlobalOptions: function (options) {
      var original = core.options;
      core.options = util.extend({}, options, original);
    },

    getGlobalOptions: function () {
      return core.options;
    },

    prepare: function (template, options) {
      return core.prepare(template, options);
    },

    // internal
    internal: {
      util: util,
      core: core
    }
  };

}(window));