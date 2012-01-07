var pot = module.exports = require('./api');
pot.internal = {
  parser: require('./internal/parser'),
  compiler: require('./internal/compiler'),
  core: require('./internal/core')
};