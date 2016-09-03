import React from 'react';
import path from 'path';
import ReactDOM from 'react-dom/server';
import Html from './Html'

export default (project) => (req, res, next) => {
  req.log.info(`===${req.originalUrl}===`);
  const filenames = project.entrys.map(entry => entry.filename);

  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  try {
    const relativeUrl = req.path.substring(1);
    const foundFile = filenames.find(filename => filename.indexOf(relativeUrl) !== -1);
    if (!foundFile) {
      return res.status(404).end();
    }

    const {entry, chunk} = project.entrys.find(entry => entry.filename === foundFile);
    const Root = require(path.resolve(__dirname, '..', entry)).default;
    const assets = webpackIsomorphicTools.assets();

    res.status(200);
    res.send('<!doctype html>\n' +
      ReactDOM.renderToStaticMarkup(
        <Html
          component={<Root/>}
          chunkJs={assets.javascript[chunk]}
          chunkCss={assets.styles[chunk]}
          />)
    );
  } catch (err) {
    req.log.error('Error when loadOnServer.');
    req.log.error(err.stack);
    res.status(500).send({
      message: 'Error when loadOnServer. Error: ' + err
    });
  }
}
