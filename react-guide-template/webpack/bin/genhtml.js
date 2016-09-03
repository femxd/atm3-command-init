import fs from 'fs'
import path from 'path'
import request from 'request'
import bluebird from 'bluebird'
import beautify from 'js-beautify'

bluebird.promisifyAll(request);

export default (project, server) => {
  const dist = path.resolve(process.cwd(), './dist');
  const tasks = project.entrys.map((entry) => {
    var url = 'http://127.0.0.1:3000/' + entry.filename.substring(0, entry.filename.lastIndexOf('.'));
    console.info("start request ", url);
    return request.getAsync(url).then(({body}) => new Promise((resolve, reject) => {
      console.info("download html success! now beautify html");
      body = beautify.html(body, {
        "indent_size": 2,
        "indent_char": " ",
        "eol": "\n",
        "indent_level": 0,
        "indent_with_tabs": false,
        "preserve_newlines": true,
        "max_preserve_newlines": 10,
        "jslint_happy": false,
        "space_after_anon_function": false,
        "brace_style": "collapse",
        "keep_array_indentation": false,
        "keep_function_indentation": false,
        "space_before_conditional": true,
        "break_chained_methods": false,
        "eval_code": false,
        "unescape_strings": false,
        "wrap_line_length": 0,
        "wrap_attributes": "auto",
        "wrap_attributes_indent_size": 4,
        "end_with_newline": false
      });
      body = body.replace(/\/css\//, '../css/');
      var htmlPath = path.resolve(dist, entry.filename);
      fs.writeFileSync(htmlPath, body, {
        encoding: 'utf-8'
      });
      console.info("success generate html to ", htmlPath);
      resolve(body);
    }));
  });
  Promise.all(tasks).then(() => {
    console.log("all html page generated success! Just stop webpack dev server!");
    process.exit(0);
  }).catch(err => {
    console.error("generate html failed, ", err.stack);
    console.log("please restart your webpack dev server, or contact @allanyu");
  });
}
