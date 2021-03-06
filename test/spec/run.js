#!/usr/bin/env node

var fs = require('fs');
var assert = require('assert');
var path = require('path');
var deku = require('../..');

var compare = function (file, template, expected, partialName, partial, data) {
  var message;
  var actual;
  try {
    console.log(file + ' Begun');
    if (partial) {
      deku.templates[partialName] = partial;
    }
    actual = deku.compile(template)(data);
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
      console.error('\nActual[' + actual.length + ']:\n\n' + actual.replace(/ /g, '_').replace(/\n/g, '\\n\n'));
      console.error('\nExpected[' + expected.length + ']:\n\n' + expected.replace(/ /g, '_').replace(/\n/g, '\\n\n'));
    } catch (ignored) {
    }
    process.exit();
  }
};

deku.processors.debug = function (value, valueName) {
  var p;
  for (p in value) {
    console.log('[debug] name=%s, key=%s, value=', valueName, p, value[p]);
  }
};

fs.readdir(__dirname, function (err, files) {
  if (err) throw err;
  files = files.map(function (name) {
    return path.join(__dirname, name);
  });
  files.forEach(function (file) {
    var match = file.match(/^([\s\S]*)\.deku$/);
    var ignore = file.match(/^([\s\S]*)\.deku\.ignore$/);
    var base;
    var load = function (scope) {
      fs.readFile(file, 'utf8', function (err, template) {
        if (err) throw err;
        fs.readFile(base + '.html', 'utf8', function (err, expected) {
          if (err) throw err;
          fs.readFile(base, 'utf8', function (err, partial) {
            var partialName = path.basename(base);
            compare(path.basename(file), template, expected, partialName, partial, scope);
          });
        });
      });
    };
    if (ignore) {
      console.log('[ignored] %s', file);
    }
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
