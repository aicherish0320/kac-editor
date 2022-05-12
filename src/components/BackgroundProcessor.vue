<template>
  <div class="background-processer">
    <styled-uploader v-if="!value" @success="onImageUploaded">
    </styled-uploader>
    <ImageProcessor
      v-else
      :value="value"
      @change="handleUploadUrl"
      :showDelete="true"
    >
    </ImageProcessor>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { message } from 'ant-design-vue'
import ImageProcessor from './ImageProcessor.vue'
import StyledUploader from './StyledUploader.vue'
import { RespUploadData } from '../store/respTypes'
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    }
  },
  components: {
    ImageProcessor,
    StyledUploader
  },
  emits: ['change'],
  setup(props, context) {
    const onImageUploaded = (data: { resp: RespUploadData; file: File }) => {
      const { resp } = data
      message.success('上传成功')
      context.emit('change', resp.data.urls[0])
    }
    const handleUploadUrl = (url: string) => {
      context.emit('change', url)
    }
    return {
      onImageUploaded,
      handleUploadUrl
    }
  }
})
</script>

<style></style>
