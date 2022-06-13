<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <KaText v-bind="item"></KaText>
    </div>
  </div>
  <StyledUploader @success="onImageUploaded"></StyledUploader>
</template>

<script lang="ts">
import { imageDefaultProps, TextComponentProps } from 'kac-components'
import { message } from 'ant-design-vue'
import { v4 as uuidv4 } from 'uuid'
import { ComponentData } from '@/store/editor'
import { defineComponent } from 'vue'
import StyledUploader from './StyledUploader.vue'
import { RespUploadData } from '@/store/respTypes'
import { getImageDimensions } from '../helper'
export default defineComponent({
  name: 'ComponentList',
  components: {
    // KaText,
    StyledUploader
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  setup(props, context) {
    // const onItemClick = (data: any) => {
    //   context.emit('on-item-click', data)
    // }
    const onItemClick = (props: TextComponentProps) => {
      const componentData: ComponentData = {
        name: 'ka-text',
        id: uuidv4(),
        props
      }
      context.emit('on-item-click', componentData)
    }
    const onImageUploaded = (data: { resp: RespUploadData; file: File }) => {
      const { resp, file } = data

      const componentData: ComponentData = {
        name: 'ka-image',
        id: uuidv4(),
        props: {
          ...imageDefaultProps
        }
      }
      message.success('上传成功')

      componentData.props.src = resp.data.urls[0]

      getImageDimensions(file).then(({ width }) => {
        const maxWidth = 373
        componentData.props.width = (width > maxWidth ? maxWidth : width) + 'px'
        context.emit('on-item-click', componentData)
      })
    }
    return {
      onItemClick,
      onImageUploaded
    }
  }
})
</script>

<style>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
.component-item > * {
  position: static !important;
}
</style>
