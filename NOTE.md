# Uploader

## 拖拽上传支持

- dragover 和 dragleave 添加或者删除对应的 class
- drop 时拿到正在被拖拽的文件，删除 class 并且触发上传

## Vue3 中的实例

- Vue2
  - 每个 Vue 应用都是 new Vue 函数创建的一个新的实例
  - 创建的时候将 data 作为 property 添加到响应式系统中
- Vue3

  - createApp 创建一个 Application Instance
  - 应用实例用来注册应用中的全局内容
  - 大多数方法支持链式调用，返回 应用实例

- mount(app) `->` 组件实例（component instance）
- 组件内部实例 - Internal Component Instance
  - 通过 getCurrentInstance 获取
  - proxy 中存储 组件实例
  - appContext 中存储 应用实例（Application Instance）

## 组件之间互相访问的方法

这里的实例说的都是组件实例 component instance

- 父组件访问子组件实例
  - $refs
- 子组件访问父组件实例
  - 在当前组件实例上，有一个特殊的属性称之为 $parent，它可以拿到父组件实例
- 使用 provide & inject 完成字组件到父组件的多级访问
  - 响应式对象也可以被 provide
- 使用事件监听器完成父子组件的通信

## 图片预览的方式

- `URL.createObjectURL()`
  - 一个静态方法，创建一个 DOM String，返回一个 URL，URL 和 document 绑定，表示指定的 File 对象(URL16)
- `FileReader.readAsDataURL()`
  - 一个 FileReader 上面的实例方法，读取指定的 File 对象，读取完成的时候出发回调，返回 URL 格式的字符串(base64)

### 异同

- 返回值
  - `FileReader.readAsDataURL(file)`可以得到一段`base64`的字符串
  - `URL.createObjectURL(file)`可以得到当前文件的一个内存 URL
- 执行机制
  - `FileReader.readAsDataURL(file)`通过回调的形式返回，异步执行
  - `URL.createObjectURL(file)`直接返回，同步执行
- 内存清理
  - `FileReader.readAsDataURL(file)`依照 JS 垃圾回收机制自动从内存中清理
  - `URL.createObjectURL(file)`存在于当前 document 内，清除方式只有 `unload()` 事件或 `revokeObjectURL()` 手动删除
- 总结
  - `URL.createObjectURL(file)`得到本地内存容器的 URL 地址，同步使用，比较方便快捷，多次使用需要注意手动释放内存的问题，性能优秀。
  - `FileReader.readAsDataURL(file)`胜在直接转换为 base64 格式，可以直接用于业务，无需二次转换格式

### 图片获取真实大小的方法

HTMLImageElement -> HTMLElement -> Element -> Node -> EventTarget

## Javascript 模块发展历史

模块就是一组可重用的代码

### 模块化的优点

- 可维护性
- 可重用性

#### ES6 之前没有模块的概念

#### 全局变量 + 命名空间

##### IIFE 自执行函数，创建一个封闭的作用域，赋值给一个全局变量

```js
var namesCollection = (function () {
  return {}
})()
```

**缺点**

- 依赖全局变量，污染全局作用域，不安全
- 依赖约定命名空间来避免冲突，可靠性不高
- 需要手动管理依赖并控制执行顺序，容易出错
- 需要在最终上线前手动合并所有用到的模块

##### Common.js

没法在浏览器里直接运行

##### AMD

- 采用异步方式加载模块
- 仅仅需要在全局环境定义 require 与 define ，不需要其他的全局变量
- 通过文件路径或模块自己声明的模块名定位模块
- 通过打包工具自动分析依赖并合并
- 配合特定的 AMD 加载器使用，RequireJS
- 同时还诞生了很多类似的模块标准 CMD

```js
define(function (require) {
  // 通过相对路径获取依赖模块
  const bar = require('./bar')
  // 模块产出
  return function () {}
})
```

##### ES6

```js
import bar from './bar'
export default function () {}
```

- 引入和暴露的方式更加多样
- 支持复杂的静态分析

#### Bundler 是什么？

诞生原因：使用 import export 这种同步加载的方式在大多数浏览器中无法使用。

#### Bundler 打包工具

将浏览器不支持的模块进行编译，转换，合并最后生成的代码可以在浏览器端良好的运行的工具

#### Webpack Rollup

对于 web 应用来说：一般采用单 Javascript 文件入口

- webpack：大型 SPA 项目的模块化构建，也就是我们常说的 web 应用
  - 通过各种 Loader 处理各种各样的静态资源
  - 通过各种插件 Plugins 对整体文件进行一些处理
  - Code splitting 将公共模块进行提取
  - 提供一个 webpack-dev-server，进行本地开发
  - 支持 HMR 模块热替换
- Rollup：rollup 设计之初就是面向 ES module 的，构建出结构扁平、性能出众的类库
  - ES module 的规则
    - import 只能作为模块顶层的语句出现，不能出现在 function 里面或是 if 里面
    - ES import 的模块名只能是字符串常量
    - 不管 import 的语句出现的位置在哪里，在模块初始化的时候所有的 import 都必须已经导入完成
  - 支持 tree-shaking，目的是将 es modules 打包生成特定的 JS 模块，并减少它的体积

##### webpack 的优势

- 强大的生态插件
- 面向开发应用的特性支持 HRM，按需加载，公共模块提取
- 简化 web 开发环节，图片自动转 base64，资源的缓存（添加 chunk）

##### Rollup 的优势

- 构建高性能的模块文件，这正是类库所需要的
- 编译出来的代码可读性好，内容更小，执行效率更高
- 配置比较简单

### 打包什么类型的文件

- CommonJS、ES6 modules - 需要特殊的 module bundler 支持
- AMD 已经有点过时了 - 需要使用特殊的 Loader - require.js
- 浏览器中直接使用 - UMD

  - 通用的一种 Javascript 格式
  - 兼容 Common.js AMD、浏览器
  - Vue 和 React 都提供了这样的格式
  - 不是一种推荐的格式，太大了，不支持 tree shaking

- 首要格式 - ES modules，并且提供支持 Typescript 的 type 文件
- 备选方案 - UMD

### snowpack

- bundler 的问题
  - 当资源越来越多的时候，打包速度越来越慢
  - 大中型项目，启动时间可能达到好几分钟
- snowpack
  - 利用新版浏览器支持 es modules 的特性
  - 不会被打包
  - 每个文件编译一次，永久被缓存
  - 当一个文件修改的时候，只需要重新 build 那一个文件
  - 处理 node_modules 模块
    - 它扫描 node_modules 中的模块。找到使用的模块
    - 将每个模块都分别转换成单个 js 文件
    - 这些单个文件都是 esm 模块，可以被最新的浏览器直接使用

### Vue 3 的插件系统

一段代码给 Vue 应用实例添加全局功能。它的格式是一个 object 暴露出一个 instal() 方法，或者一个 function

它没有严格的限制，一般有以下几种功能

- 添加全局方法或者属性
- 添加全局资源：指令、过滤器
- 通过全局混入来添加一些组件选项
- 通过 config.globalProperties 来添加 app 实例方法

## NPM 的主要功能

- 从 npm 服务器下载别人编写的第三方包到本地
- 从 npm 服务器下载并安装别人编写的命令程序到本地使用，比如 vue-cli
- 允许用户将自己编写的包或命令行程序上传到 npm 服务器供别人使用

### 语义化版本

版本格式：主版本号.此版本号.修订号

- 主版本号：当你做了不兼容的 API 修改
- 次版本号：当你做了向下兼容的功能性新增
- 修订号：当你做了向下兼容的问题修正

### 编辑器图层开发

- 裁剪图片的实现
  - 借助阿里云 OSS 的图片处理
  - 重新获取裁剪后的图片数据并且重新上传
- 创建 Vue3 钩子函数的原则
- 拖动排序的实现原理
- 复杂正则表达式的分析过程

## 列表拖动

- 拖动开始（dragstart）
  - 被拖动图层的状态变化
  - 会出现一个浮层
- 拖动进行中 （dragmove）
  - 浮层会随着鼠标移动
  - 条目发生换位
- 松开鼠标阶段（drop）
  - 浮层消失
  - 被拖动图层状态复原
  - 数据被更新

## 图片裁剪

- 选择 Cropper.js 作为基础库
- 初始化 Cropper 区域，并且通过事件拿到对应坐标
- 第一种方式：使用阿里云 OSS 完成裁剪功能
- 第二种方式：使用 Cropper.js 获取图片数据
- getCroppedCanvas() -> toBlob() -> 重新上传 Blob 对象

## 让元素动起来

对于一个可视化编辑器，用户的易用性和交互在我看来非常重要，也是整个前端的难点。这些内容，可以写在简历里：“在工作的项目中，你做了什么有挑战性的工作？”

- 拖拽移动图层的实现
- 拖拽改变图层大小的实现
- 复杂快捷键的实现
- HotKey.js
- 插件的概念
- 撤销和重做的实现
- 单元测试
- 函数节流
- 右键菜单的实现
- 函数式创建组件的方式

### 拖拽方案

- h5 dragable
  - 缺点：样式不好自定义
- 自己实现
  - MouseDown 后开始操作
  - 添加 MouseMove 监控更新 top、left 值，拖动过程中，可以使用的值就是鼠标的坐标
  - MouseUp 清除事件，周期完成

### 快捷键操作

- 拷贝图层
- 粘贴图层
- 删除图层
- 取消选中

### 元素移动

- 上下左右移动

### 撤销/重做

HotKeys.js 好用的按键响应库

## 右键菜单

- 在中间编辑器区域拦截默认的右键点击事件
- 判断是否点击在组件元素傻姑娘
- 显示一个自定义菜单，其中包括操作项，显示在鼠标位置
- 点击操作完成 - 重用快捷键已经支持的 mutation，并且关闭自定义菜单

## 大型项目等编译，部署以及性能优化

优化的手段本质就是：减少代码体积，加快响应速度

- VueCLI 编译不同环境的代码
  - 几种环境的概念
  - Vue CLI 中的模式
  - 使用环境变量文件
- Webpack
  - 基础
  - 手写一个 Loader
  - 手写一个 Plugin
- 个性化 VueCli 编译来完成打包分析和优化
  - Vue.config.js
  - 安装分析插件 - Webpack-bundle-analyzer
  - 各种 Webpack 打包优化策略，我们采用渐进式的几种方式不断优化
- 部署以及 HTTP 传输优化
  - Nginx 安装和简介
  - 使用 HTTP 缓存 expires 到 cache-control
  - 使用 HTTP 数据压缩 gzip 到 Brotil 到静态资源
  - 使用 HTTP 协议特性从 keep-alive 到 http/2

## 应用部署流程

### 构建

JavaScript 语言本身是不需要编译的
但是现代的前端项目使用的语言和或者模块系统都无法在浏览器中使用，都需要使用特定的 bundler 将源代码最终转换为浏览器支持的 Javascript 代码

## 前后端联调

## Mock server - JSON Server

## 发布功能点

- html2canvas
  - 基本使用
  - 踩坑之旅
- qrcode - 生产二维码
- Clipboard.js - 复制文本到剪切板
  - 基本使用
  - 原理
- useLoadMore - 钩子函数的进化之旅
  - 支持点击加载更多
  - 支持无限滚动
  - 支持分页
- 前端文件下载的原理
  - 同域文件的下载
  - 跨域文件的下载-
  - FileSaver.js 的使用和原理

## 关于 window.devicePixelRatio

- 设备像素/物理像素
  设备像素也被称为物理像素，它是显示设备中一个最微小的物理部件，在同一个设备中，物理像素的总数是固定的
- 独立像素/css 像素
  CSS 像素是一个抽象的单位，主要使用在浏览器上，用来精确的度量（确定）web 页面中的内容
  CSS 像素被称为与设备无关的像素，(device-independent 像素)，简称 DIPS

在一个标准的现实密度下，一个 CSS 像素对应着一个设备像素

### window.devicePixelRatio

返回当前显示设备的物理像素分辨率与 CSS 像素分辨率之比，简单来说，它告诉浏览器应使用多少屏幕实际像素来绘制单个 CSS 像素。
所以在标准屏幕下，devicePixelRatio 应该为 1

**特例**
视网膜(Retina)显示屏，它会使用更多的屏幕像素绘制相同的对象，从而获得更清晰的图像，devicePixelRatio 为 2

所以虽然我们中间的元素 CSS 尺寸是 375px，但是因为 Apple 是视网膜显示屏，所以使用了两倍于 css 尺寸的设备像素来渲染它，这就是最后图片尺寸为 750px 原因。

## HTML2Canvas 截图原理

**目的**
一个 canvas 元素，上面有绘制有一系列的 HTML 节点
**局限**
canvas 中没法添加具体的 HTML 节点，它只是一张画布

通过 canvas.getContext('2d')可以拿到 canvas 提供的 2d 渲染上下文，然后在里面绘制形状、文本、图像和其他对象

- 矩形 fillRect()
- 文本 fillText()
- 图像 drawImage()

**SVG 来拯救我们**
可缩放矢量图形，是一种用于描述二维的矢量图形，基于 XML 的标记语言

svg 中有一个神奇的元素称之为 foreignObject
foreignObject 元素允许包含来自不同的 XML 命名空间的元素。在浏览器的上下文中，很可能是 XHTML/HTML

### 解题思路

- 创建一个 canvas 元素
- 创建 svg 文件，使用 Blob 构造函数
- 将 svg 中的值填充 foreignObject，然后填充想要复制节点的 HTML
- 创建 image 标签，将 image.src = URL.createObjectURL(svg)
- 在 image 完成读取以后，调用 canvas 的 drawImage 方法，将图片绘制到画布上

## 二维码

- qrcodejs ❌
- node-qrcode ✅

## 复制到剪贴板的原理

看起来很简单的问题，但是由于不同浏览器之间存在不同的 API 实现和各种 hack，所以它的实现很混乱

- 方法一：最现代的 Clipboard API
  - 还在 working draft 阶段，浏览器兼容性有待加强
- 方法二：document.execCommand() 方法
  - 它不仅仅是解决复制的场景，而且是给可编辑区域提供一系列功能

### 实现

document.execCommand('copy') 解决思路分析

- 手动创建可编辑元素，比如 textArea，然后将要拷贝的值设置为它的 value
- 将它插入到页面中，调用 textArea 上的方法，对值进行选中
- 然后再调用 document.execCommand('copy')
- 特别注意 textArea 要不可见，使用特殊的样式让它不出现在任何区域
- 最后要将 textArea 节点删除

## 下载文件的原理
### A 链接
可以创建通向其它网页、文件、同一页面内的位置、电子邮件地址或其它 URL 的超链接
A链接的一个特殊属性：download
此属性指示浏览器下载 URL 而不是导航到它，因此将提示用户将其保存为本地文件
A 链接的另外一个特殊属性：rel
该属性指定了目标对象到链接对象的关系
noopener 一个重要的属性，对于 web  安全来说非常关键
当你使用 target='_blank' 打开一个新的标签页时，新页面的 window 对象上有一个属性 opener，它指向的是前一个页面的 window 对象，因此，后一个页面就获得了前一个页面的控制权

我们模拟这个过程来完成下载
- 创建 A 链接
- 设置 href 以及 download 属性
- 触发 A 链接的点击事件

**download属性仅适用于同源URL**

### 使用 FileSaver.js 完成下载
借助 HTTP 特殊的响应头触发浏览器自动下载

**Content-Disposition**，最佳的下载方式，需要服务器的支持，并且不需要任何的 Javascript，需要在 HTTP 头部添加


## 源代码到浏览器运行的过程
编译阶段（webpack）（所有的环境变量都可用） -> 浏览器运行（客户端）（使用特殊的变量名称，才可用）

- 在客户端使用环境变量
  - VUE_APP 开头的变量
  - NODE_ENV：当前使用的模式
  - BASE_URL：部署到的基础路径

## Webpack 构建优化
### Bundler - 打包工具
将浏览器不支持的模块进行编译，转换，合并最后生成的代码可以在浏览器端良好的运行的工具
- Loader
  用于对模块的源代码进行转换，loader 可以使你在 import 或 load 模块时预处理文件
- Plugin
  插件是 webpack 的支柱功能。webpack 自身也是构建与你在 webpack 配置中用到的 相同的插件系统之上，插件的目的在于解决 loader 无法实现的其它事。我自己的理解，loader 解决的是各种不通资源的问题，plugins 更多解决的是项目整体的事情

Loaders 关注代码中的单个资源，plugins 关注整体流程，可以接触到 webpack 构建流程中的各个阶段并劫持做一些代码处理
插件的格式
- 一个 Javascript 函数或 Javascript 类
- 在它原型上定义的 apply 方法，会在安装插件时被调用，并被 webpack compiler 调用一次
- 指定一个触及到 webpack 本身的事件钩子，即hooks，用于特定时机处理额外的逻辑

## vue.config.js 个性化构建结果
- publicPath: 部署应用包时的基本URL
  - 默认值 '/'，vue-cli 会假设你的应用被部署在一个域名的根路径上
  - 可以设置为子路径，'/abc'
  - 可以设置为 CDN 路径
  - 还可以设置为绝对路径('' './')，这样所有的资源都会被链接为相对路径

## bundle 打包分析工具
webpack-bundle-analyzer

- 可以作为 webpack plugins 使用
- 可以作为 cli 命令工具使用

### 特点和分析过程
- 分析 bundle 由什么模块组成
- 分析什么模块占据了比较大的体积
- 分析是否有什么错误的模块被打包了

## 使用 SplitChunksPlugin 继续优化文件大小
- 充分利用浏览器缓存
- 浏览器支持平行加载多个文件
  - HTTP1 对同一域名并行加载的个数限制
  - HTTP2 完全突破这个限制