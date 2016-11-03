const webpack = require('webpack');
const path = require('path');
const pkgInfo = require("../package.json");

const betalib1 = [
  'babel-polyfill',
  'react',
  'react-dom',
  'lodash',
]

module.exports = {
  output: {
    path: 'webpack/lib',
    filename: `[name]-dll.js`,
    library: '[name]',
  },
  entry: {
    betalib1: betalib1,
  },
  resolve: {
    root: [
      path.resolve('../src'),
      path.resolve('../buglyui')
    ],
    modulesDirectories: [
      'src',
      'node_modules'
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'webpack/manifest/[name].json',
      name: '[name]',
      context: __dirname,
    }),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),

    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     sequences: true,
    //     dead_code: true,
    //     conditionals: true,
    //     booleans: true,
    //     unused: true,
    //     if_return: true,
    //     join_vars: true,
    //     drop_console: true,
    //     warnings: false,
    //   },
    //   verbose: true,
    //   comment: true,
    //   mangle: true,
    //   sourceMap: false
    // }),
  ],
};
