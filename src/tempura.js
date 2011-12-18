/**
 * @preserve tempura - simple templating library in javascript.
 * https://github.com/nakamura-to/tempura
 */
/*jslint browser: true, forin: true, indent:2, plusplus: true, vars: true */
/*global module:false */
//noinspection ThisExpressionReferencesGlobalObjectJS
(function (global) {
  'use strict';

  var undef;

  var util = {

    toString: Object.prototype.toString,

    slice: Array.prototype.slice,

    isObject: function (obj) {
      var toObject = Object;
      return obj === toObject(obj);
    },

    isPlainObject: function (obj) {
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
      if (s === null || s === undef) {
        return '';
      }
      return s.replace(/^\s+/, '').replace(/\s+$/, '');
    },

    extend: function (target) {
      var args = util.slice.call(arguments, 1);
      var len = args.length;
      var i;
      var source;
      var key;
      if (target === null || target === undef || len === 0) {
        return target;
      }
      for (i = 0; i < len; i++) {
        source = args[i];
        if (source !== null && source !== undef) {
          for (key in source) {
            if (target[key] === undef) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    },

    deepExtend: function (target) {
      var args = util.slice.call(arguments, 1);
      var len = args.length;
      var i;
      var source;
      var mergeRec;
      if (target === null || target === undef || len === 0) {
        return target;
      }
      mergeRec = function (target, source) {
        var key;
        var sourceProp;
        var targetProp;
        var newProp;
        for (key in source) {
          sourceProp = source[key];
          targetProp = target[key];
          var isArray = util.isArray(sourceProp);
          if (isArray || util.isPlainObject(sourceProp)) {
            newProp = targetProp || (isArray ? [] : {});
            mergeRec(newProp, sourceProp);
            target[key] = newProp;
          } else if (targetProp === undef) {
            target[key] = sourceProp;
          }
        }
      };
      for (i = 0; i < len; i++) {
        source = args[i];
        if (source !== null && source !== undef) {
          mergeRec(target, source);
        }
      }
      return target;
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

    TEMPURA_OPTIONS: '__tempura__options',

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

    walk: function (name, context) {
      var segments = name.split('.');
      var value = context[segments.shift()];
      while (value !== null && value !== undef && segments.length > 0) {
        context = core.createContext(context, value);
        value = context[segments.shift()];
      }
      return {
        found: value !== undef && segments.length === 0,
        value: value,
        context: context
      };
    },

    applyPipes: function (value, pipeNames, context) {
      var options = context[core.TEMPURA_OPTIONS] || {};
      var pipes = options.pipes || {};
      var noSuchPipe = options.noSuchPipe;
      var walkResult;
      var contextPipe;
      var optionPipe;
      var i;
      var len = pipeNames.length;
      var pipeName;      
      for (i = 0; i < len; i++) {
        pipeName = pipeNames[i];
        walkResult = core.walk(pipeName, context);
        contextPipe = walkResult.value;
        if (util.isFunction(contextPipe)) {
          value = contextPipe.call(walkResult.context, value);
        } else {
          optionPipe = pipes[pipeName];
          if (util.isFunction(optionPipe)) {
            value = optionPipe.call(context, value);
          } else {
            if (util.isFunction(noSuchPipe)) {
              value = noSuchPipe.call(context, pipeName, i, value);
            }
          }
        }
      }
      return value;
    },

    applyPreRender: function (value, context, render) {
      var options = context[core.TEMPURA_OPTIONS] || {};
      var preRender = options.preRender;
      if (util.isFunction(preRender)) {
        return preRender.call(context, value, render);
      } else {
        return render(value);
      }
    },

    noSuchValue: function (name, context) {
      var option = context[core.TEMPURA_OPTIONS] || {};
      var noSuchValue = option.noSuchValue;
      if (util.isFunction(noSuchValue)) {
        return noSuchValue.call(context, name);
      }
      return undef;
    },

    resolveValue: function (name, pipeNames, context) {
      var pipe = function (value) {
        return core.applyPipes(value, pipeNames, context);
      };
      var walkResult = core.walk(name, context);
      var value = walkResult.found ? walkResult.value : core.noSuchValue(name, context);
      if (util.isFunction(value)) {
        value = value.call(walkResult.context);
      }
      return core.applyPreRender(value, context, pipe);
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
        var results = [];
        if (pipeNamesDef !== null && pipeNamesDef !== undef) {
          names = pipeNamesDef.split('|');
          len = names.length;
          for (i = 0; i < len; i++) {
            name = util.trim(names[i]);
            if (name) {
              results.push(name);
            }
          }
        }
        return results;
      };
      var getValue = function (valueName, pipeNamesDef, context) {
        var name = util.trim(valueName);
        var pipeNames = getPipeNames(pipeNamesDef);
        var value = core.resolveValue(name, pipeNames, context);
        return (value === null || value === undef) ? '' : String(value);
      };
      return function (template, context) {
        var callback = function (match, directive, valueName, pipeNamesDef) {
          switch (directive) {
          case '#':
            return '{{#' + valueName + '}}';
          case '^':
            return '{{^' + valueName + '}}';
          case '/':
            return '{{/' + valueName + '}}';
          case '!':
            return '';
          case '{':
            return getValue(valueName, pipeNamesDef, context);
          default:
            return util.encode(getValue(valueName, pipeNamesDef, context));
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
      var getRenderedContent = function (type, content, value, context) {
        var i;
        var len = value.length;
        var array = [];
        if (type === '#') {
          if (util.isArray(value)) {
            for (i = 0; i < len; i++) {
              array[i] = core.transform(content, core.createContext(context, value[i]));
            }
            return array.join('');
          } else if (util.isFunction(value)) {
            if (value.call(context)) {
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
      };
      return function (template, context) {
        if (!core.includes('#', template) && !core.includes('^', template)) {
          return false;
        }
        return template.replace(regex, function (match, before, type, name, content, after) {
          var renderedBefore = before ? core.transformTags(before, context) : '';
          var renderedAfter = after ? core.transform(after, context) : '';
          var renderedContent;
          var walkResult = core.walk(name, context);
          var value = walkResult.found ? walkResult.value : core.noSuchValue(name, context);
          renderedContent = getRenderedContent(type, content, value, walkResult.context);
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
        render: function (data) {
          return core.toHtml(template, data, options);
        }
      };
    }

  };

  var tempura =  (function () {

    var undef;

    //noinspection JSUnusedLocalSymbols
    var defaultSettings = {
      pipes: {},
      preRender: function (value, pipe) {
        var result = pipe(value);
        return result === undef ? '' : result;
      },
      noSuchValue: function (name) {
        return undef;
      },
      noSuchPipe: function (name, index, value) {
        return value;
      }
    };

    var settings = util.deepExtend({}, defaultSettings);

    return {
      name: 'tempura',

      version: '0.0.1',

      getSettings: function () {
        return settings;
      },

      setSettings: function (userSettings) {
        settings = userSettings;
      },

      mergeSettings: function (userSettings) {
        settings = util.deepExtend({}, userSettings, settings);
      },

      prepare: function (template, options) {
        options = util.deepExtend({}, options, settings);
        return core.prepare(template, options);
      },

      internal: {
        util: util,
        core: core
      }
    };
  }());

  if (typeof module !== 'undefined') {
    module.exports = tempura;
  } else {
    global.tempura = tempura;
  }

}(this));