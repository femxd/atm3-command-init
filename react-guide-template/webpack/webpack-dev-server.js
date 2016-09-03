import http from 'http';
import url from 'url';
import path from 'path';

import Express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'
import uuid from 'uuid'
import accessLogger from './bin/accessLogger'
import reactRender from './bin/reactRender'
import * as project from './project.json'
import genhtml from './bin/genhtml'

const __DEVELOPMENT__ = process.env.NODE_ENV == 'development';
const host = 'localhost';
const port = 3000;
const app = new Express();

app.use((req, res, next) => {
  req.sn = uuid.v4();
  req.startTime = Date.now();
  res.set("Server", "Tencent-Web-Server");
  next();
});
app.use(favicon(path.join(__dirname, './bin/favicon.ico')));
app.use(cookieParser('here is some secret'));
app.use(accessLogger()); // 依赖cookie
app.use(bodyParser.json({
  limit: 100 * 1024 * 1024
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: 100 * 1024 * 1024
}));
app.use(bodyParser.raw({
  limit: 100 * 1024 * 1024
}));
if (__DEVELOPMENT__) {
  var webpack = require('webpack');
  var MemoryFS = require("memory-fs");
  var webpackConfig = require('./webpack.dev.js');
  var compiler = webpack(webpackConfig);
  var fs = new MemoryFS();
  compiler.outputFileSystem = fs;

  var serverOptions = {
    contentBase: 'http://' + host + ':' + port,
    quiet: true,
    noInfo: true,
    silent: true,
    hot: true,
    inline: true,
    lazy: false,
    aggregateTimeout: 300,
    poll: true,
    publicPath: webpackConfig.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: "normal"
  };


  app.use(require('webpack-dev-middleware')(compiler, serverOptions));
  app.use(require('webpack-hot-middleware')(compiler));
}
app.use(Express.static(path.resolve(process.cwd(), './dist')));
app.use(reactRender(project));

app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==>   Webpack development server listening on port %s', port);
    !__DEVELOPMENT__ && genhtml(project);
  }
});
