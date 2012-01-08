var deku = module.exports = require('./api');
deku.internal = {
  parser: require('./internal/parser'),
  compiler: require('./internal/compiler'),
  core: require('./internal/core')
};