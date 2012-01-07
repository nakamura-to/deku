#!/usr/bin/env node

var fs = require('fs');
var assert = require('assert');
var path = require('path');
var tempura = require('../..');
var compare = function (file, template, expected, data) {
  var message;
  var actual;
  try {
    console.log(file + ' Begun');
    actual = tempura.prepare(template).render(data);
    assert.equal(actual, expected);
    console.log(file + ' Passed');
  } catch (e) {
    message = e.name;
    if (e.message) {
      message += ': ' + e.message;
    }
    console.error(file + ' FAILED');
    console.error(message);
    console.error('\nStack:\n\n' + e.stack);
    try {
      console.error('\nActual[' + actual.length + ']:\n\n' + actual);
      console.error('\nExpected[' + expected.length + ']:\n\n' + expected);
    } catch (ignored) {
    }
    process.exit();
  }
};

fs.readdir(__dirname, function (err, files) {
  if (err) throw err;
  files = files.map(function (name) {
    return path.join(__dirname, name);
  });
  files.forEach(function (file) {
    var match = file.match(/^([\s\S]*)\.tempura$/);
    var base;
    var load = function (scope) {
      fs.readFile(file, 'utf8', function (err, template) {
        if (err) throw err;
        fs.readFile(base + '.html', 'utf8', function (err, expected) {
          if (err) throw err;
          compare(path.basename(file), template, expected, scope);
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
