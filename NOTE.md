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
