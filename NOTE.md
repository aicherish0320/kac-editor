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
