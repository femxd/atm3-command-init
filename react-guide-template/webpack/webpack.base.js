const path = require('path');
const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic'));
const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');

module.exports = (options) => ({
  devtool: options.devtool,
  context: path.resolve(__dirname, '..'),
  target: 'web', // Make web variables accessible to webpack, e.g. window
  stats: { colors: true }, // Don't show stats in the console
  progress: true,
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    loaders: [
       {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        loader: 'babel-loader',
        include: /src|webpack/,
        query: options.babelQuery,
      },
      {
        // Transform our own .css files with PostCSS and CSS-modules
        test: /\.css$/,
        exclude: /node_modules/,
        loader: options.cssLoaders,
      },
      {
        // Do not transform vendor's CSS with CSS-modules
        // The point is that they remain in global scope.
        // Since we require these CSS files in our JS or CSS files,
        // they will be a part of our compilation either way.
        // So, no need for ExtractTextPlugin here.
        test: /\.css$/,
        include: /node_modules/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        include: /src|xiaoshuo/,
        loader: options.sassLoaders,
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader?limit=10000&name=img/[name].[ext]',
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]&mimetype=application/font-woff',
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]&mimetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]',
      },
      // {
      //   test: /\.html$/,
      //   loader: 'html-loader',
      // },
      {
        test: /\.json$/,
        loader: 'json-loader',
      }],
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, "../src")
    ]
  },
  plugins: options.plugins.concat([
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest/betalib1.json'),
    }),
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: NODE_ENV
      },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: NODE_ENV === 'development',
      __PROD__: NODE_ENV === 'production'
    }),
  ]),
  postcss: () => options.postcssPlugins,
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: [
      '',
      '.js',
      '.jsx',
      '.es6.js',
      '.react.js',
    ],
    packageMains: [
      'jsnext:main',
      'main',
    ],
    alias: {
      guide: path.resolve(__dirname, "../node_modules/@tencent/react-guide/src"),
    }
  },
});
