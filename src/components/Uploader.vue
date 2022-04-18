<template>
  <div class="file-upload">
    <div
      class="upload-area"
      :class="{ 'is-dragover': drag && isDragOver }"
      v-on="events"
    >
      <slot name="loading" v-if="isUploading">
        <button disabled>正在上传</button>
      </slot>
      <slot
        name="uploaded"
        v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
      >
        <button>点击上传</button></slot
      >
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input
      ref="fileInput"
      type="file"
      name="file"
      :style="{ display: 'none' }"
      @change="handleFileChange"
    />
    <ul>
      <li
        v-for="file in filesList"
        :key="file.uid"
        :class="`uploaded-file upload-${file.status}`"
      >
        <img
          v-if="file.url && listType === 'picture'"
          class="upload-list-thumbnail"
          :src="file.url"
          :alt="file.name"
        />

        <span v-if="file.status === 'loading'" class="file-icon"
          ><LoadingOutlined
        /></span>
        <span v-else class="file-icon"><FileOutlined /></span>
        <span class="filename">{{ file.name }}</span>
        <span class="delete-icon" @click="removeFile(file.uid)"
          ><DeleteOutlined
        /></span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref } from 'vue'
import {
  DeleteOutlined,
  LoadingOutlined,
  FileOutlined
} from '@ant-design/icons-vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { last } from 'lodash-es'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckUpload = (file: File) => boolean | Promise<File>
type FileListType = 'picture' | 'text'

export interface UploadFile {
  uid: string
  size: number
  name: string
  status: UploadStatus
  raw: File
  resp?: any
  url?: string
}

export default defineComponent({
  name: 'Uploader',
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined
  },
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>
    },
    drag: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String as PropType<FileListType>,
      default: 'text'
    }
  },
  setup(props) {
    // 上传 input
    const fileInput = ref<null | HTMLInputElement>(null)
    // 文件列表 包含不同状态
    const filesList = ref<UploadFile[]>([])
    // 是否开启拖拽
    const isDragOver = ref(false)
    // 文件列表中，只要有正在上传的就是正在上传
    const isUploading = computed(() =>
      filesList.value.some((file) => file.status === 'loading')
    )
    const lastFileData = computed(() => {
      const lastFile = last(filesList.value)
      if (lastFile) {
        return {
          loaded: lastFile.status === 'success',
          data: lastFile.resp
        }
      }
      return false
    })
    // 从文件列表移除文件
    const removeFile = (id: string) => {
      filesList.value = filesList.value.filter((file) => file.uid !== id)
    }
    // trigger upload
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    // 上传文件
    const postFile = async (readyFile: UploadFile) => {
      const formData = new FormData()
      formData.append('file', readyFile.raw)

      readyFile.status = 'loading'

      try {
        const resp = await axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        readyFile.status = 'success'
        readyFile.resp = resp.data
      } catch (_) {
        readyFile.status = 'error'
      } finally {
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      }
    }

    let events: { [key: string]: (e: any) => void } = {
      click: triggerUpload
    }
    // file input change
    const handleFileChange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      beforeUploadCheck(target.files)
    }
    // add file to list
    const addFileToList = (uploadedFile: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: 'ready',
        raw: uploadedFile
      })

      if (props.listType === 'picture') {
        // ! createObjectURL
        // try {
        //   fileObj.url = URL.createObjectURL(uploadedFile)
        // } catch (error) {
        //   console.log('upload File error', error)
        // }
        // ! FileReader
        const fileReader = new FileReader()
        fileReader.readAsDataURL(uploadedFile)
        fileReader.addEventListener('load', () => {
          fileObj.url = fileReader.result as string
        })
      }

      filesList.value.push(fileObj)
      // 自动上传
      if (props.autoUpload) {
        postFile(fileObj)
      }
    }
    // before upload check
    const beforeUploadCheck = (files: null | FileList) => {
      if (files) {
        // 上传的原始文件
        const uploadedFile = files[0]
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile)
          if (result && result instanceof Promise) {
            result
              .then((processedFile) => {
                if (processedFile instanceof File) {
                  addFileToList(processedFile)
                } else {
                  throw new Error(
                    'beforeUpload Promise should return File object'
                  )
                }
              })
              .catch((e) => {
                console.log(e)
              })
          } else if (result === true) {
            addFileToList(uploadedFile)
          }
        } else {
          addFileToList(uploadedFile)
        }
      }
    }

    // 拖动
    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault()
      isDragOver.value = over
    }
    // 放下
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      isDragOver.value = false
      if (e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files)
      }
    }
    // 拖拽上传
    if (props.drag) {
      events = {
        ...events,
        dragover: (e: DragEvent) => {
          handleDrag(e, true)
        },
        dragleave: (e: DragEvent) => {
          handleDrag(e, false)
        },
        drop: handleDrop
      }
    }

    return {
      fileInput,
      triggerUpload,
      handleFileChange,
      isUploading,
      filesList,
      removeFile,
      lastFileData,
      events,
      isDragOver
    }
  }
})
</script>

<style lang="scss">
.upload-area {
  width: 300px;
  height: 200px;
  &:hover {
    border: 1px solid red;
  }
  &.is-dragover {
    border: 1px solid green;
  }
}
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.upload-list li {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 200px;
  position: relative;
  &:first-child {
    margin-top: 10px;
  }
  .upload-list-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 1;
    background-color: #fff;
    object-fit: cover;
  }
  .file-icon {
    svg {
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .filename {
    margin-left: 5px;
    margin-right: 40px;
  }
  &.upload-error {
    color: #f5222d;
    svg {
      color: #f5222d;
    }
  }
  .file-status {
    display: block;
    position: absolute;
    right: 5px;
    top: 0;
    line-height: inherit;
  }
  .delete-icon {
    display: none;
    position: absolute;
    right: 7px;
    top: 0;
    line-height: inherit;
    cursor: pointer;
  }
  &:hover {
    background-color: #efefef;
    .file-status {
      display: none;
    }
    .delete-icon {
      display: block;
    }
  }
}
</style>
