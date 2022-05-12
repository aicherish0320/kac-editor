<template>
  <div class="editor-container">
    <!-- 上部分 -->
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img
              alt="KacEditor"
              src="../assets/logo-simple.png"
              class="logo-img"
            />
          </router-link>
          <InlineEdit :value="page.title" @change="titleChange" />
        </div>
      </a-layout-header>
    </a-layout>
    <!-- 下部分 -->
    <a-layout>
      <!-- 左侧组件列表 -->
      <a-layout-sider width="300" style="background: #fff">
        <div class="sidebar-container">组件列表</div>
        <ComponentList
          :list="defaultTextTemplates"
          @onItemClick="addItem"
        ></ComponentList>
      </a-layout-sider>
      <!-- 画布编辑区域 -->
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <div class="preview-list" id="canvas-area">
            <div class="body-container" :style="page.props">
              <EditWrapper
                v-for="component in components"
                :hidden="component.isHidden"
                :key="component.id"
                :id="component.id"
                :active="component.id === currentElement?.id"
                @set-active="setActive"
              >
                <component :is="component.name" v-bind="component.props" />
              </EditWrapper>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <!-- 右侧组件属性 -->
      <a-layout-sider
        width="300"
        style="background: #fff"
        class="settings-panel"
      >
        <a-tabs type="card" v-model:activeKey="activePanel">
          <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
            <div v-if="currentElement">
              <EditGroup
                v-if="!currentElement.isLocked"
                :props="currentElement.props"
                @change="handleChange"
              ></EditGroup>
              <div v-else>
                <a-empty>
                  <template #description>
                    <p>该元素被锁定，无法编辑</p>
                  </template>
                </a-empty>
              </div>
            </div>
            <pre>
            {{ currentElement && currentElement.props }}
          </pre
            >
          </a-tab-pane>
          <a-tab-pane key="layer" tab="图层设置">
            <LayerList
              :list="components"
              :selectedId="currentElement && currentElement.id"
              @change="handleChange"
              @select="setActive"
            >
            </LayerList>
          </a-tab-pane>
          <a-tab-pane key="page" tab="页面设置">
            <PropsTable :props="page.props" @change="pageChange"></PropsTable>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
    <!-- <pre>{{ currentElement?.props }}</pre> -->
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from '@/store'
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import KaText from '@/components/KaText.vue'
import KaImage from '@/components/KaImage.vue'
import ComponentList from '@/components/ComponentList.vue'
import { defaultTextTemplates } from '@/defaultTemplates'
import EditWrapper from '@/components/EditWrapper.vue'
import { ComponentData } from '@/store/editor'
import PropsTable from '@/components/PropsTable.vue'
import EditGroup from '../components/EditGroup.vue'
import LayerList from '../components/LayerList.vue'
import InlineEdit from '@/components/InlineEdit.vue'

export type TabType = 'component' | 'layer' | 'page'
export default defineComponent({
  name: 'Editor',
  components: {
    KaText,
    KaImage,
    ComponentList,
    EditWrapper,
    PropsTable,
    EditGroup,
    LayerList,
    InlineEdit
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const page = computed(() => store.state.editor.page)
    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentElement
    )
    const activePanel = ref<TabType>('component')

    const addItem = (component: any) => {
      store.commit('addComponent', component)
    }

    const setActive = (id: string) => {
      store.commit('setActive', id)
    }

    const pageChange = (e: any) => {
      store.commit('updatePage', e)
    }

    const handleChange = (e: any) => {
      store.commit('updateComponent', e)
    }

    return {
      components,
      defaultTextTemplates,
      addItem,
      setActive,
      currentElement,
      pageChange,
      activePanel,
      handleChange,
      page
    }
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
