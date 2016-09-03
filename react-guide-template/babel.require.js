//  enable runtime transpilation to use ES6/7 in node

var fs = require('fs');
var path = require('path');

var babelrc = fs.readFileSync(path.resolve(__dirname, './.babelrc'));
var config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your babelrc file');
  console.error(err);
}
config.ignore = function (filename) {
  if (filename.indexOf("/react-guide/") !== -1) {
    return false;
  } else if (filename.indexOf("node_modules/") !== -1) {
    return true;
  } else {
    return false;
  }
}

require('babel-register')(config);
require.extensions['.scss'] = () => {
  return;
};
require.extensions['.css'] = () => {
  return;
};
