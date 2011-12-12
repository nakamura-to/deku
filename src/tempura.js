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

    trim: (function () {
      var regex = /^¥s*|¥s*$/g;
      return function (s) {
        return s.replace(regex, '');
      };
    }()),

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
            if (obj[prop] === undefined) {
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
        html = (html === null || html === undefined) ? '' : String(html);
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

  var dom = {

    hasTempuraAttr: function (el) {
      return el && el.hasAttribute && el.hasAttribute('data-tempura');
    },

    isNested: function (el) {
      var p = el.parentNode;
      while (p) {
        if (dom.hasTempuraAttr(p)) {
          return true;
        }
        p = p.parentNode;
      }
      return false;
    },

    clear: function (el) {
      var i;
      var child;
      if (el && el.childNodes) {
        for (i = el.childNodes.length; i >= 0; i--) {
          child = el.childNodes[i];
          if (child && dom.hasTempuraAttr(child)) {
            el.removeChild(child);
          }
        }
      }
    }

  };

  var core = {

    tempuraProp: '$tempura',

    rootProp: '$root',

    parentProp: '$parent',

    dataProp: '$data',

    includes: function (directive, template) {
      return template.indexOf('{{' + directive) !== -1;
    },

    walkObject: function (name, object) {
      var path = name.split('.');
      var context = object;
      var value = context[path.shift()];
      while (value !== undefined && value !== null && path.length > 0) {
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
      if (!data[core.tempuraProp]) {
        if (!parent[core.tempuraProp]) {
          throw new Error('illegal parent context.');
        }
        context = {};
        context[core.tempuraProp] = parent[core.tempuraProp];
        context[core.rootProp] = parent[core.rootProp];
        context[core.parentProp] = parent;
        context[core.dataProp] = data;
        util.extend(context, data);
      }
      return context;
    },

    transformTags: (function () {
      var regex = new RegExp([
        '{{',
        '([#/!{])?(.+?)\\1?', // $1, $2
        '}}'
      ].join(''), 'g');
      return function (template, context) {
        var find = function (name) {
          var value = core.find(name, context);
          // todo how to handle undefined ?
          return value === undefined ? '' : value;
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

    createInitialContext: function (data) {
      var context = {};
      context[core.tempuraProp] = true;
      context[core.rootProp] = data;
      context[core.parentProp] = null;
      context[core.dataProp] = data;
      util.extend(context, data);
      return context;
    },

    render: function (container, data) {
      if (typeof container === 'string') {
        container = document.getElementById(container);
      }
      var template = core.parse(container);
      return core.transform(template, core.createInitialContext(data));
    }

  };

  //noinspection JSUnusedGlobalSymbols
  global.tempura = {

    // public
    version: '0.0.1',
    render: core.render,

    // internal
    internal: {
      util: util,
      dom: dom,
      core: core
    }
  };

}(window));