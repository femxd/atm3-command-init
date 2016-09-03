var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var exists = fs.existsSync;
var write = fs.writeFileSync;
var mkdir = fs.mkdirSync;
var rVariable = /\$\{([\w\.\-_]+)(?:\s+(.+?))?\}/g;
var child_process = require('child_process');

exports.name = 'init';
exports.usage = '<react|mobile|pc|conf>';
exports.desc = 'scaffold with specifed template react/mobile/pc or just update fis-conf.js file. default is react';

exports.register = function (commander) {
  commander
    .option('-u, --username <userName>', 'set username')
    .option('-p, --projectname <projectName>', 'set projectname')
    .action(function (template) {
      var args = [].slice.call(arguments);
      var options = args.pop();

      var settings = {
        userName: trim(options.username),
        projectName: trim(options.projectname),
        template: args[0] || 'mobile'
      };

      // 根据 fis-conf.js 确定 root 目录
      Promise.try(function () {
        return findupAsync(settings);
      }).then(function () {// prompt
        return promptAsync(settings);
      }).then(function () {
        return settings.template == 'react' ? generateReactTemplateAsync(settings) : generateHtmlTemplateAsync(settings);
      });

    });
};

function findupAsync(settings) {
  if (!settings.root) {
    var findup = require('findup');

    return new Promise(function (resolve, reject) {
      var fup = findup(process.cwd(), 'fis-conf.js');
      var dir = null;

      fup.on('found', function (found) {
        dir = found;
        fup.stop();
      });

      fup.on('error', reject);

      fup.on('end', function () {
        resolve(dir);
      });
    }).then(function (dir) {
      settings.root = dir || process.cwd();
    });
  } else {
    return Promise.resolve(settings);
  }
}

function promptAsync(settings) {
  return new Promise(function (resolve, reject) {
    fis.log.info('Current Dir: %s', settings.root);

    if (settings.userName && settings.projectName) {
      return resolve(settings);
    } else {
      var schema = [];
      var variables = {
        username: '',
        projectname: ''
      };

      Object.keys(variables).forEach(function (key) {
        schema.push({
          name: key,
          required: true,
          'default': variables[key]
        });
      });

      if (schema.length) {
        var prompt = require('prompt');
        prompt.start();

        prompt.get(schema, function (error, result) {
          if (error) {
            return reject(error);
          }

          settings.userName = trim(result.username);
          settings.projectName = trim(result.projectname);
          resolve(settings);
        });
      } else {
        return resolve(settings);
      }
    }
  });
}

function generateHtmlTemplateAsync(settings) {
  return new Promise(function (resolve, reject) {
    var projectDir = prepareProjectDirHook(settings);
    generateFisConf(settings, projectDir);
    copyHtmlFiles(projectDir, settings.template);

    if (settings.template === 'mobile' || settings.template === 'pc') {
      var dirs = ['design', 'font', 'img', 'slice'];
      dirs.forEach(function (dir) {
        if (!exists(projectDir + '/' + dir)) mkdir(projectDir + '/' + dir);
      });
      fis.log.info('mkdir empty dirs: ', dirs, " [OK]");
      fis.log.info('init ' + settings.template + ' project done!');
    }
  });
}

function generateReactTemplateAsync(settings) {
  return new Promise(function (resolve, reject) {
    var projectDir = prepareProjectDirHook(settings);
    generateFisConf(settings, projectDir);
    fis.util.copy(__dirname + "/react-guide-template", projectDir, null, null, true);
  });
}

function copyHtmlFiles(projectDir, template) {
  var isMobile = template !== 'pc';

  if (template !== 'mobile' && template !== 'pc') {
    fis.log.info("just update fis-conf.js file!");
    return false;
  }

  if (isMobile) {
    fis.util.copy(__dirname + "/html-templates/mobile", projectDir, null, null, true);
  } else {
    fis.util.copy(__dirname + "/html-templates/pc", projectDir, null, null, true);
  }
  fis.log.info("copy html, css, js files OK!");
}

function prepareProjectDirHook(settings) {
  fis.log.info("settings: ", settings);
  if (!settings.userName || !settings.projectName) {
    fis.log.error("userName and projectName is required!");
    return process.exit(0);
  }
  var projectDir = settings.root + '/' + settings.projectName;
  if (path.basename(settings.root) === settings.projectName) {
    projectDir = settings.root;
  }
  if (!exists(projectDir)) {
    mkdir(projectDir);
    fis.log.info("mkdir %s [OK]", projectDir);
  }
  return projectDir;
}

function generateFisConf(settings, projectDir) {
  var isMobile = settings.template !== 'pc';
  var confPath = settings.template == 'react' ? '/react-guide-template/fis-conf.js' : '/html-templates/fis-conf.js';

  var fisConf = fs.readFileSync(__dirname + confPath, { encoding: 'utf8' });
  fisConf = fisConf.replace(/__userName__/g, settings.userName)
    .replace(/__projectName__/g, settings.projectName)
    .replace(/__scale__/g, isMobile ? 0.5 : 1.0);

  write(projectDir + "/fis-conf.js", fisConf, { encoding: 'utf8' });
  fis.log.info("generate fis-conf.js OK");
}

function trim(str) {
  return (str || '').replace(/^\s+|\s+$/g, "");
}