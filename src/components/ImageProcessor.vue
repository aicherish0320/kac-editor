<template>
  <div class="image-processor">
    <a-modal
      title="裁剪图片"
      v-model:visible="showModal"
      @ok="handleOk"
      @cancel="showModal = false"
      okText="确认"
      cancelText="取消"
    >
      <div class="image-cropper">
        <img :src="baseImageUrl" id="processed-image" ref="cropperImg" />
      </div>
    </a-modal>
    <div
      class="image-preview"
      :style="{ backgroundImage: backgroundUrl }"
      :class="{ extraHeight: showDelete }"
    ></div>
    <div class="image-process">
      <styled-uploader @success="handleFileUploaded"></styled-uploader>
      <a-button @click="showModal = true">
        <template v-slot:icon><ScissorOutlined /></template>裁剪图片
      </a-button>
      <a-button v-if="showDelete" type="danger" @click="handleDelete">
        <template v-slot:icon><DeleteOutlined /></template>删除图片
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import Cropper from 'cropperjs'
import { DeleteOutlined, ScissorOutlined } from '@ant-design/icons-vue'
import StyledUploader from './StyledUploader.vue'
import { UploadResp } from '../extraType'
import { RespUploadData } from '../store/respTypes'
import axios from 'axios'
interface CropDataProps {
  x: number
  y: number
  width: number
  height: number
}

export default defineComponent({
  name: 'ImageProcessor',
  props: {
    value: {
      type: String,
      required: true
    },
    ratio: {
      type: Number
    },
    showDelete: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DeleteOutlined,
    StyledUploader,
    ScissorOutlined
  },
  emits: ['change', 'uploaded'],
  setup(props, context) {
    const showModal = ref(false)
    const backgroundUrl = computed(() => `url(${props.value})`)
    const baseImageUrl = computed(() => props.value.split('?')[0])
    const cropperImg = ref<null | HTMLImageElement>(null)
    let cropper: Cropper
    let cropData: CropDataProps | null = null
    // 监听 modal 显示
    watch(showModal, async (newValue) => {
      if (newValue) {
        await nextTick()
        if (cropperImg.value) {
          cropper = new Cropper(cropperImg.value, {
            crop(event) {
              const { x, y, width, height } = event.detail
              console.log(event)

              cropData = {
                x: Math.floor(x),
                y: Math.floor(y),
                width: Math.floor(width),
                height: Math.floor(height)
              }
            }
          })
        }
      } else {
        if (cropper) {
          cropper.destroy()
        }
      }
    })
    const handleOk = () => {
      if (cropData) {
        const { x, y, width, height } = cropData
        const cropperURL =
          baseImageUrl.value +
          `?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
        // ! 不使用 阿里云 OSS，拿到截图图片再次上传的处理方法
        // ! 这里实现还是采用原方法，假如同学们愿意使用重新上传的方法的话，请看下面注释的代码
        // cropper.getCroppedCanvas().toBlob((blob) => {
        //   if (blob) {
        //     const formData = new FormData()
        //     formData.append('croppedImage', blob, 'test.png')
        //     axios
        //       .post('http://localhost:3000/api/utils/upload-img', formData, {
        //         headers: {
        //           'Content-Type': 'multipart/form-data'
        //         }
        //       })
        //       .then((resp) => {
        //         // context.emit('change', resp.data.data.url)
        //         context.emit('change', resp.data.data.urls[0])
        //         showModal.value = false
        //       })
        //   }
        // })
        context.emit('change', cropperURL)
      }
      showModal.value = false
    }
    const handleFileUploaded = (data: { resp: RespUploadData; file: File }) => {
      const { resp } = data
      message.success('上传成功')
      context.emit('change', resp.data.urls[0])
      context.emit('uploaded', data)
    }
    const handleDelete = () => {
      context.emit('change', '')
    }
    return {
      handleFileUploaded,
      handleDelete,
      backgroundUrl,
      showModal,
      cropperImg,
      handleOk,
      baseImageUrl
    }
  }
})
</script>

<style>
.image-processor {
  display: flex;
  justify-content: space-between;
}
.image-preview {
  width: 150px;
  height: 84px;
  border: 1px dashed #e6ebed;
  background: no-repeat 50% / contain;
}
.image-preview.extraHeight {
  height: 110px;
}
.image-process {
  padding: 5px 0;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.image-cropper img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
