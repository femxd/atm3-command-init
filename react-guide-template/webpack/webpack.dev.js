/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const project = require("./project.json");

// PostCSS plugins
const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');

const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic'));
const publicPath = "http://localhost:3000/"

module.exports = require('./webpack.base')({
  // Emit a source map for easier debugging
  devtool: 'cheap-source-map',

  // Add hot reloading in development
  entry: project.entrys.reduce((sum, item) => {
    sum[item.chunk] = [
      `webpack-hot-middleware/client?path=${publicPath}__webpack_hmr`,
      path.resolve(__dirname, item.entry)
    ]
    return sum;
  }, {}),

  // Don't use hashes in dev mode for better performance
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name]-chunk.js',
    publicPath
  },

  // Load the CSS in a style tag in development
  cssLoaders: 'style-loader?name=css/[name].[ext]!css?importLoaders=2&localIdentName=[local]___[hash:base64:5]!postcss-loader',

  sassLoaders: 'style?name=css/[name].[ext]!css?importLoaders=2!postcss!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true',

  // Process the CSS with PostCSS
  postcssPlugins: [
    postcssFocus(), // Add a :focus to every :hover
    cssnext({ // Allow future CSS features to be used, also auto-prefixes the CSS...
      browsers: ['last 2 versions', 'IE >= 10'], // ...based on this browser list
    }),
    postcssReporter({ // Posts messages from plugins to the terminal
      clearMessages: true,
    }),
  ],

  // Add hot reloading
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    new webpack.NoErrorsPlugin(),
    webpackIsomorphicToolsPlugin.development(),
  ].concat(project.entrys.map(entry => {
    return new HtmlWebpackPlugin({
      template: path.resolve(__dirname, entry.template),
      chunks: [entry.chunk],
      filename: entry.filename,
      inject: 'body'
    })
  })),

  // Tell babel that we want to hot-reload
  babelQuery: {
    cacheDirectory: true,
    compact: false,
    comments: false,
    "presets": [
      "es2015",
      "react",
      "stage-0"
    ]
  }
});
