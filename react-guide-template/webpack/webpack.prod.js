// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const project = require('./project.json');

// PostCSS plugins
const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');
const CleanPlugin = require('clean-webpack-plugin');

const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic'));

module.exports = require('./webpack.base')({
  // devtool: 'hidden-source-map',

  // In production, we skip all hot-reloading stuff
  entry: project.entrys.reduce((sum, item) => {
    sum[item.chunk] = [path.resolve(__dirname, item.entry)];
    return sum;
  }, {}),

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: 'js/[name].js', // [chunkhash:5]
    chunkFilename: 'js/[name]-chunk.js',
  },

  // We use ExtractTextPlugin so we get a seperate CSS file instead
  // of the CSS being in the JS and injected as a style tag
  cssLoaders: ExtractTextPlugin.extract(
    {
      fallbackLoader: 'style-loader?name=css/[name].[ext]',
      loader: 'css-loader?importLoaders=2!postcss-loader'
    }
  ),

  sassLoaders: ExtractTextPlugin.extract(
    {
      fallbackLoader: 'style-loader?name=css/[name].[ext]',
      loader: 'css-loader?importLoaders=2!postcss-loader!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true'
    }
  ),

  // In production, we minify our CSS with cssnano
  postcssPlugins: [
    postcssFocus(),
    cssnext({
      browsers: ['last 2 versions', 'IE >= 10'],
    }),
    postcssReporter({
      clearMessages: true,
    }),
  ],

  plugins: [
    // new CleanPlugin(['./dist'], { root: path.resolve(process.cwd()) }),
    // OccurrenceOrderPlugin is needed for long-term caching to work properly.
    // See http://mxs.is/googmv
    new webpack.optimize.OccurrenceOrderPlugin(true),

    // Merge all duplicate modules
    new webpack.optimize.DedupePlugin(),

    // Minify and optimize the JavaScript
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
        warnings: false,
      },
      verbose: true,
      comment: true,
      mangle: true,
      sourceMap: false
    }),

    // Extract the CSS into a seperate file
    new ExtractTextPlugin('css/[name].css'),
    webpackIsomorphicToolsPlugin,
  ].concat(project.entrys.map(entry => {
    return new HtmlWebpackPlugin({
      template: path.resolve(__dirname, entry.template),
      chunks: [entry.chunk],
      filename: entry.filename,
      inject: 'body',
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeRedundantAttributes: true,
      //   useShortDoctype: true,
      //   removeEmptyAttributes: true,
      //   removeStyleLinkTypeAttributes: true,
      //   keepClosingSlash: true,
      //   minifyJS: true,
      //   minifyCSS: true,
      //   minifyURLs: true,
      // },
    })
  })),

  babelQuery: {
    cacheDirectory: true,
    compact: false,
    comments: false,
    "presets": [
      "es2015",
      "react",
      "stage-0"
    ],
    "env": {
      "production": {
        "plugins": [
          "transform-react-remove-prop-types",
          "transform-react-constant-elements",
          "transform-react-inline-elements"
        ]
      }
    }
  }
});
