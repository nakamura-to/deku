var fs = require('fs');
var assert = require('assert');
var childProcess = require('child_process');
var pkg = require('./package.json');

var SRC_DIR = './src';
var DIST_DIR = './dist';
var LIB_DIR = './lib';
var TEMPLATES_DIR = './templates';

var PEGJS_FILE = SRC_DIR + '/deku.pegjs';
var GENERATED_PARSER_FILE = DIST_DIR + '/generated.parser.js';
var DEKU_FILE = DIST_DIR + '/deku-' + pkg.version + '.js';
var DEKU_MIN_FILE = DIST_DIR + '/deku-' + pkg.version + '.min.js';
var DEKU_RUNTIME_FILE = DIST_DIR + '/deku.runtime-' + pkg.version + '.js';
var DEKU_RUNTIME_MIN_FILE = DIST_DIR + '/deku.runtime-' + pkg.version + '.min.js';

var PRELUDE_FILE = LIB_DIR + '/internal/prelude.js';
var PARSER_FILE = LIB_DIR + '/internal/parser.js';
var COMPILER_FILE = LIB_DIR + '/internal/compiler.js';
var CORE_FILE = LIB_DIR + '/internal/core.js';
var API_FILE = LIB_DIR + '/api.js';

var HEADER_TEMPLATE_FILE = TEMPLATES_DIR + '/header.deku';
var deku_TEMPLATE_FILE = TEMPLATES_DIR + '/deku.deku';
var deku_RUNTIME_TEMPLATE_FILE = TEMPLATES_DIR + '/deku.runtime.deku';

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

task('clean', function () {
  mkdirUnlessExists(DIST_DIR);
  cleanDir(DIST_DIR);
});

task('makeParser', ['clean'], function () {
  var process = childProcess.spawn('pegjs', ['-e', 'var parser', PEGJS_FILE, GENERATED_PARSER_FILE]);
  process.on('exit', function () {
    var content = fs.readFileSync(PARSER_FILE, 'utf-8');
    var generatedContent = fs.readFileSync(GENERATED_PARSER_FILE, 'utf-8');
    content = content.replace(/(\/\/ BEGIN PARSER\n)[\s\S]*?(\/\/ END PARSER)/g, '$1' + generatedContent + '$2');
    fs.writeFileSync(PARSER_FILE, content, 'utf-8');
    fs.unlinkSync(GENERATED_PARSER_FILE);
    complete();
  });
}, {async: true});

task('updateVersion', ['clean'], function () {
  var content = fs.readFileSync(API_FILE, 'utf-8');
  content = content.replace(/(deku.version = ').+?(';)/g, '$1' + pkg.version + '$2');
  fs.writeFileSync(API_FILE, content, 'utf-8');
});

task('test', ['makeParser', 'updateVersion'], function () {
  var process = childProcess.execFile('./test/spec/run.js', function (error, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    assert.ifError(error);
  });
  process.on('exit', function () {
    complete();
  });
}, {async: true});

task('test-compiler', [], function () {
  var process = childProcess.execFile('./bin/deku', ['./test/spec/simple.deku'], function (error, stdout, stderr) {
    assert.ifError(error);
  });
  process.on('exit', function () {
    complete();
  });
}, {async: true});

task('build', ['test', 'test-compiler'], function () {
  var deku =require('deku');
  var options = {
    templates: {
      header: fs.readFileSync(HEADER_TEMPLATE_FILE, 'utf-8')
    }
  };
  var template = deku.prepare(fs.readFileSync(deku_TEMPLATE_FILE, 'utf-8'), options);
  var data = {
    preludeName: PRELUDE_FILE,
    prelude: fs.readFileSync(PRELUDE_FILE, 'utf-8'),
    parserName: PARSER_FILE,
    parser: fs.readFileSync(PARSER_FILE, 'utf-8'),
    compilerName: COMPILER_FILE,
    compiler: fs.readFileSync(COMPILER_FILE, 'utf-8'),
    coreName: CORE_FILE,
    core: fs.readFileSync(CORE_FILE, 'utf-8'),
    apiName: API_FILE,
    api: fs.readFileSync(API_FILE, 'utf-8'),
    pkg: pkg
  };
  var content = template.render(data);
  fs.writeFileSync(DEKU_FILE, content, 'utf-8');
  template = deku.prepare(fs.readFileSync(deku_RUNTIME_TEMPLATE_FILE, 'utf-8'), options);
  content = template.render(data);
  fs.writeFileSync(DEKU_RUNTIME_FILE, content, 'utf-8');
});

task('minify', ['build'], function () {
  var uglify = function(dest, src) {
    return childProcess.spawn('uglifyjs', ['-o', dest, src]);
  }
  var process = uglify(DEKU_MIN_FILE, DEKU_FILE);
  process.on('exit', function () {
    var process = uglify(DEKU_RUNTIME_MIN_FILE, DEKU_RUNTIME_FILE);
    process.on('exit', function () { complete(); });
  });
}, {async: true});

task('dist', ['minify'], function () {
  console.log('dist task done.');
});

task('default', ['dist']);


