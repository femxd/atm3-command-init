#!/usr/bin/env node
// babel registration (runtime transpilation for node)
require('../../babel.require.js');
const path = require('path');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const rootDir = path.resolve(__dirname, '../..');
const env = process.env.NODE_ENV;

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = !!(env === 'development' || env === 'dev');
global.__PROD__ = (env === 'prod' || env === 'production');

// 避免return时报在外层return的错误, 包在函数内
(function () {
  if (__DEVELOPMENT__) {
    if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
      return;
    }
  }

  // https://github.com/halt-hammerzeit/webpack-isomorphic-tools

  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack.isomorphic'))
    // .development(__DEVELOPMENT__)
    .server(rootDir, function () {
      require('../webpack-dev-server.js');
    });
})();
