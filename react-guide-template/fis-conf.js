var path = require('path');
// fis.project.setProjectRoot(path.resolve(process.cwd(), './dist'));

fis.set("atm", {
  useSprite: true, // 是否在开发阶段使用雪碧图合并
  useOptimize: true, // 是否压缩css
  useHash: false, // 是否给文件名加上hash值
  userName: '__userName__',  // RTX用户名
  projectName: '__projectName__', // 项目名称
  cdnPath: '/2015/market/__userName__/__projectName__', // 上传到CDN的路径/2015/market/allanyu/demo
  wapstatic: 'http://wapstatic.kf0309.3g.qq.com/'
});

fis.set('project.files', ['dist/**'])
  .set('project.ignore', ['node_modules/**', '.gitignore', '**/_*.scss', '.docs/**', 'publish/**', '.dist/**', '.git/**', '.svn/**', 'fis-conf.js']);

fis.hook('relative');

if (!!fis.get("atm").cdnPath) {
  fis.get("atm").useDomain = !!fis.get("atm").cdnPath;
  fis.get("atm").domain = "http://3gimg.qq.com/mig-web/" + fis.get("atm").cdnPath;
}

var atmConf = fis.get("atm");
console.log(fis.project.currentMedia());

var media = fis.project.currentMedia();
/*************************目录规范*****************************/
fis
  .match('*', {
    useHash: false,
    relative: true,
    _isResourceMap: false
  })
  .match(/.*\.(html|htm|php)$/, { //页面模板不用编译缓存
    useCache: false
  })
  .match("/css/(**).{css,less,scss}", {
    useSprite: true,
    spriteRelease: '/pic/$1.png',
    optimizer: fis.plugin('clean-css'),
    postprocessor: fis.plugin('px2rem', {
      mode: 'px2rem',
      baseFont: 16
    })
  }).match("/css/{mixins, guide}/**", {
    // postprocessor: []
  }).match('/css/**.less', {
    rExt: '.css',
    useSprite: true,
    parser: fis.plugin('less')
  })
  .match('/css/**.scss', {
    rExt: '.css',
    useSprite: true,
    optimizer: fis.plugin('clean-css'),
    parser: fis.plugin('node-sass', {
      sourceMap: true
    })
  })
  .match('*.mixin.less', {//less的mixin文件无需发布
    release: false
  })
  .match("/design/**.psd", {
    release: false
  })
  .match("font/**", {})
  .match("img/**", {})
  .match('img/**.png', {
    optimizer: fis.plugin('png-compressor')
  }).match('js/**', {})
  .match('mail/**', {})
  .match('slice/**', {});

fis.match('**', {
  deploy: fis.plugin('local-deliver', {
    to: './publish'
  })
}).match("::packager", {
  spriter: fis.plugin('csssprites', {
    htmlUseSprite: true,
    layout: 'linear',
    margin: '16',
    scale: 0.5,
    styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig
  }),
  postpackager: [fis.plugin('list-html'), fis.plugin('open', {
    baseUrl: atmConf.wapstatic + atmConf.userName + '/' + atmConf.projectName
  })]
});

['test', 'open'].forEach(function (_media) {
  fis.media(_media).match("::packager", {
    spriter: fis.plugin('csssprites', {
      htmlUseSprite: true,
      layout: 'matrix',
      margin: '16',
      scale: 0.5,
      styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig
    })
  }).match('**', {
    deploy: [fis.plugin('local-deliver', {
      to: './publish'
    }), fis.plugin('http-push', {
      receiver: 'http://wapstatic.kf0309.3g.qq.com/deploy',
      type: 'zip',
      to: '/data/wapstatic/' + atmConf.userName + '/' + atmConf.projectName
    })]
  });
});

fis.media('cdn').match("/css/**.{css,less}", {
  useSprite: true,
  optimizer: atmConf.useOptimize && fis.plugin('clean-css')
}).match('**', {
  deploy: fis.plugin('cdn', {
    remoteDir: atmConf.cdnPath,
    uploadUrl: 'http://super.kf0309.3g.qq.com/qm/upload'
  })
});

