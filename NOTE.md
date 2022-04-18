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
