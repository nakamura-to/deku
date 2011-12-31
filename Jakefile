var util = require('util');
var fs = require('fs');
var path         = require("path");
var childProcess = require("child_process");

var pkg = JSON.parse(fs.readFileSync('./package.json').toString());
var version = pkg.version;

var SRC_DIR = './src';
var DIST_DIR = './dist';
var PEGJS_FILE = SRC_DIR + '/tempura.pegjs';
var PARSER_FILE = DIST_DIR + '/parser.js';
var TEMPURA_FILE = 'tempura.js';
var TEMPURA_MIN_FILE = 'tempura-min.js';
var TEMPURA_DIST_FILE = DIST_DIR + '/tempura.js';
var TEMPURA_MIN_DIST_FILE = DIST_DIR + '/tempura-min.js';

var mkdirUnlessExists = function (dir)  {
  try {
    fs.statSync(dir);
  } catch (e) {
    fs.mkdirSync(dir, 0755);
  }
};

var cleanDir = function (dir) {
  fs.readdirSync(dir).every(function (file) {
    var file = dir + '/' + file;
    var stats = fs.statSync(file);
    if (stats.isDirectory()) {
      removeDir(file);
    } else {
      fs.unlinkSync(file);
    }
    return true;
  });
};

var removeDir = function (dir) {
  fs.readdirSync(dir).every(function (file) {
    var file = dir + '/' + file;
    var stats = fs.statSync(file);
    if (stats.isDirectory()) {
      removeDir(file);
    } else {
      fs.unlinkSync(file);
    }
    return true;
  });
  fs.rmdirSync(dir);
};

var copyFile = function (src, dest) {
  fs.writeFileSync(dest, fs.readFileSync(src));
};

desc('Clean dist directory.');
task('clean', function () {
  mkdirUnlessExists(DIST_DIR);
  cleanDir(DIST_DIR);
});

desc('Generate parser.js.');
task('parser', ['clean'], function () {
  var process = childProcess.spawn(
    'pegjs',
    ['-e', 'var parser', PEGJS_FILE, PARSER_FILE],
    {customFds: [0, 1, 2]}
  );
  process.on('exit', function () { complete(); });
}, {async: true});

desc('Generate tempura.js.');
task('build', ['parser'], function () {
  var parser = fs.readFileSync(PARSER_FILE, 'utf-8');
  var tempura = fs.readFileSync(TEMPURA_FILE, 'utf-8');
  tempura = tempura.replace(/(@VERSION@)/g, version);
  tempura = tempura.replace(/(version: ').+?(',)/g, '$1' + version + '$2');
  tempura = tempura.replace(/(\/\/ BEGIN PARSER\n)[\s\S]*?(\/\/ END PARSER)/g, '$1' + parser + '$2');
  fs.writeFileSync(TEMPURA_DIST_FILE, tempura, 'utf-8');
  fs.unlinkSync(PARSER_FILE);
});

desc('Generate tempura-min.js.');
task('minify', ['build'], function () {
  var process = childProcess.spawn(
    'uglifyjs',
    ['-o', TEMPURA_MIN_DIST_FILE, TEMPURA_DIST_FILE],
    { customFds: [0, 1, 2] }
  );
  process.on('exit', function () { complete(); });
}, {async: true});

//desc('Run test.');
//task('test', function () {
//  var process = childProcess.spawn('./test/it/run');
//  process.on('exit', function () { complete(); });
//}, {async: true});

task('dist', ['minify', 'test'], function () {
  copyFile(TEMPURA_DIST_FILE, TEMPURA_FILE);
  copyFile(TEMPURA_MIN_DIST_FILE, TEMPURA_MIN_FILE);
  console.log('dist task done.');
});

task('default', ['dist']);


