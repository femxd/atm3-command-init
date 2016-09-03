# README

## 安装启动指南

- 执行`npm i -d`安装所有的依赖包
这个过程中如果安装node-sass出错了, 很可能是因为sass在执行编译的时候需要下载node的源码头部gzip失败导致的, 请联系@allanyu.

- 执行`npm run dev`, 启动开发服务器

- `webpack/project.json`中有一个`htmls`的配置项, 其配置中的每一个`filename`代表的可访问的html文件路径. 访问路径是`http://localhost:3000/${filename}`
例如, 如下配置代表你可以通过`http://localhost:3000/xiaoshuo/store-index.html`
```json
"htmls": [
  {
      "template": "../xiaoshuo/template.html",
      "chunks": [
        "xiaoshuo-store-index"
      ],
      "filename": "xiaoshuo/store-index.html"
    }
]
```

- 通过浏览器打开上面的url即可访问到html

## todo

- [x] guide:: 整理webpack配置, 搞定prod环境配置
- [x] guide:: 搞定react server render, 并导出成html, 做成atm的插件
- [x] guide:: 将guide库打包成npm包发布到tnpm去
- [x] guide:: 将react-guide发布到wapstatic去, 通知其他同学体验
- guide:: 开发一个生成项目脚手架的atm插件


## xiaoshuo项目开发指南


### 开发react组件技术点


### 迁移html页面技术点


### 本地关联react-guide


### 如何发布项目到测试环境测试?

- 执行`npm run build`执行构建, 将html/js/css分别打包到dist文件夹中
- 启动本地开发服务器`npm run start:prod`, 供下一步下载完整的html用
- 执行`atm genhtml -f webpack/project.json`, 用于生成给开发用的html文件
- 执行`atm release test`将文件发布到wapstatic, 通过浏览器预览

### 如何发布项目给前端开发?

> 以下命令都是在项目根路径执行.

- 执行`npm run build`执行构建, 将html/js/css分别打包到dist文件夹中
- 启动本地开发服务器`npm run start:prod`, 供下一步下载完整的html用
- 执行`atm genhtml -f webpack/project.json`, 用于生成给开发用的html文件
- 执行`atm release test`将文件发布到wapstatic, 通过浏览器预览


