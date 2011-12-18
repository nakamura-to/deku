/*jslint evil:true, indent: 2, node:true, plusplus: true, sloppy: true, vars: true */
var fs = require('fs');
var assert = require('assert');
var util = require('util');
var tempura = require('../tempura.js');
var compare = function (file, template, expected, data) {
  var message;
  var actual;
  try {
    util.puts(file + ' Begun');
    actual = tempura.prepare(template).render(data);
    assert.equal(actual, expected);
    util.puts(file + ' Passed');
  } catch (e) {
    message = e.name;
    if (e.message) {
      message += ': ' + e.message;
    }
    util.error(file + ' FAILED');
    util.error(message);
    util.error('\nStack:\n\n' + e.stack);
    try {
      util.error('\nActual[' + actual.length + ']:\n\n' + actual);
      util.error('\nExpected[' + expected.length + ']:\n\n' + expected);
    } catch (ignored) {
    }
    process.exit();
  }
};

tempura.setSettings({
  noSuchValue: function (name) {
    throw new Error('noSuchValue: ' + name);
  },
  noSuchPipe: function (name) {
    throw new Error('noSuchPipe: ' + name);
  }
});

fs.readdir('.', function (err, files) {
  files.forEach(function (file) {
    var match = file.match(/^([\s\S]*)\.tempura$/);
    var base;
    var load = function (scope) {
      fs.readFile(file, 'utf8', function (err, template) {
        fs.readFile(base + '.html', 'utf8', function (err, expected) {
          compare(file, template, expected, scope);
        });
      });
    };
    if (!match) {
      return;
    }
    base = match[1];
    if (files.indexOf(base + '.js') !== -1) {
      fs.readFile(base + '.js', 'utf8', function (err, js) {
        var data;
        eval(js);
        load(data);
      });
    } else {
      load({});
    }
  });
});
