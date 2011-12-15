/*!
 * tempura - simple templating library in javascript.
 * https://github.com/nakamura-to/tempura
 */
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

    applyPipes: function (value, pipeNames, context) {
      var options = context[core.TEMPURA_OPTIONS] || {};
      var pipes = options.pipes || {};
      var wrapper;
      var contextPipe;
      var optionPipe;
      var i;
      var len = pipeNames.length;
      var pipeName;      
      for (i = 0; i < len; i++) {
        pipeName = pipeNames[i];
        wrapper = core.walk(pipeName, context);
        contextPipe = wrapper.value;
        if (util.isFunction(contextPipe)) {
          value = contextPipe.call(wrapper.context, value);
        } else {
          optionPipe = pipes[pipeName];
          if (util.isFunction(optionPipe)) {
            value = optionPipe.call(context, value);
          } 
        }
      }
      return value;
    },

    applyFilter: function (value, context, pipeline) {
      var options = context[core.TEMPURA_OPTIONS] || {};
      var filter = options.filter;
      if (util.isFunction(filter)) {
        return filter.call(context, value, pipeline);
      } else {
        return pipeline(value);
      }
    },

    resolveValue: function (path, pipeNames, context) {
      var pipeline = function (value) {
        return core.applyPipes(value, pipeNames, context);
      };
      var wrapper = core.walk(path, context);
      var value = wrapper.value;
      if (util.isFunction(value)) {
        value = value.call(wrapper.context);
      }
      return core.applyFilter(value, context, pipeline);
    },

    transformTags: (function () {
      var regex = new RegExp([
        '{{',
        '([#\\^/!{])?(.+?)(?:\\|(.*?))?', // $1, $2, $3, $4
        '}}+'
      ].join(''), 'g');
      var getPipeNames = function (pipeNamesDef) {
        var names;
        var i;
        var len;
        var name;
        var results;
        if (pipeNamesDef === null || pipeNamesDef === undef) {
          return [];
        }
        names = pipeNamesDef.split('|');
        len = names.length;
        results = [];
        for (i = 0; i < len; i++) {
          name = util.trim(names[i]);
          if (name) {
            results.push(name);
          }
        }
        return results;
      };
      var getValue = function (path, pipeNamesDef, context) {
        var pipeNames = getPipeNames(pipeNamesDef);
        var value = core.resolveValue(path, pipeNames, context);
        return (value === null || value === undef) ? '' : String(value);
      };
      return function (template, context) {
        var callback = function (match, directive, path, pipeNamesDef) {
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
            return getValue(path, pipeNamesDef, context);
          default:
            return util.encode(getValue(path, pipeNamesDef, context));
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
      return {
        toHtml: function (data) {
          return core.toHtml(template, data, options);
        }
      };
    }

  };

  var tempura = global.tempura = (function () {

    var defaultSettings = {
      pipes: {},
      filter: function (value, next) {
        value = next(value);
        return typeof value === 'undefined' ? '' : value;
      }
    };

    var cloneDefaultSettings = function () {
      return {
        pipes: util.extend({}, defaultSettings.pipes),
        filter: defaultSettings.filter
      };
    };

    var settings = cloneDefaultSettings();

    return {
      name: 'tempura',

      version: '0.0.1',

      setSettings: function (userSettings) {
        settings = userSettings;
      },

      getSettings: function () {
        return settings;
      },

      prepare: function (template, options) {
        var opts = util.extend({}, options || {}, settings);
        return core.prepare(template, opts);
      },

      internal: {
        util: util,
        core: core
      }
    };
  }());

}(window));