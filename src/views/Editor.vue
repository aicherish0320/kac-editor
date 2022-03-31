<template>
  <div class="editor-container">
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img
              alt="慕课乐高"
              src="../assets/logo-simple.png"
              class="logo-img"
            />
          </router-link>
        </div>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <a-layout-sider width="300" style="background: #f00">
        <div class="sidebar-container">组件列表</div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <div class="preview-list" id="canvas-area"></div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="300"
        style="background: #0ff"
        class="settings-panel"
      >
        组件属性
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Editor',
  setup() {
    return {}
  }
})
</script>

<style>
.editor-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.editor-container .preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
.page-title {
  display: flex;
}
.page-title .inline-edit span {
  font-weight: 500;
  margin-left: 10px;
  font-size: 16px;
}
.preview-list.canvas-fix .edit-wrapper > * {
  box-shadow: none !important;
}
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
</style>
