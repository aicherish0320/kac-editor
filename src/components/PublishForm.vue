<template>
  <div class="publish-channel-container">
    <a-row :style="{ marginBottom: '20px' }">
      <a-col :span="8" class="left-col">
        封面图
        <img :src="page.coverImg" :alt="page.title" />
      </a-col>
      <a-col :span="16" class="right-col">
        <a-row>
          <a-col :span="6">
            <img
              src="http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png"
              :alt="page.title"
            />
          </a-col>
          <a-col :span="18" class="left-gap">
            <h4>{{ page.title }}</h4>
            <p>{{ page.desc }}</p>
          </a-col>
        </a-row>
        <a-tabs type="card" :style="{ marginTop: '20px' }">
          <a-tab-pane key="channels" tab="发布为作品">
            <a-row
              v-for="channel in channels"
              :key="channel.id"
              class="channel-item"
            >
              <a-col :span="6">
                <canvas
                  class="barcode-container"
                  :id="`channel-barcode-${channel.id}`"
                />
              </a-col>
              <a-col :span="18" class="left-gap">
                <h4>{{ channel.name }}</h4>
                <a-row>
                  <a-col :span="18">
                    <a-input
                      :value="generateChannelURL(channel.id)"
                      :readonly="true"
                      :id="`channel-url-${channel.id}`"
                    />
                  </a-col>
                  <a-col :span="6">
                    <a-button
                      class="copy-button"
                      :data-clipboard-target="`#channel-url-${channel.id}`"
                      >复制</a-button
                    >
                  </a-col>
                </a-row>
              </a-col>
              <div class="delete-area">
                <a-button
                  type="danger"
                  size="small"
                  @click="deleteChannel(channel.id)"
                  :disabled="deleteDisabled"
                  >删除渠道</a-button
                >
              </div>
            </a-row>
            <a-form
              layout="inline"
              :style="{ marginTop: '20px' }"
              :model="form"
              :rules="rules"
            >
              <a-form-item name="channelName">
                <a-input
                  placeholder="渠道名称"
                  v-model:value="form.channelName"
                ></a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="createChannel">
                  创建新渠道
                </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="template" tab="发布为模版">
            <a-row
              v-for="channel in channels"
              :key="channel.id"
              class="channel-item"
            >
              <a-col :span="6">
                <canvas
                  class="barcode-container"
                  :id="`channel-barcode-${channel.id}`"
                />
              </a-col>
              <a-col :span="18" class="left-gap">
                <h4>{{ channel.name }}</h4>
                <a-row>
                  <a-col :span="18">
                    <a-input
                      :value="generateChannelURL(channel.id)"
                      :readonly="true"
                      :id="`channel-url-${channel.id}`"
                    />
                  </a-col>
                  <a-col :span="6">
                    <a-button
                      class="copy-button"
                      :data-clipboard-target="`#channel-url-${channel.id}`"
                      >复制</a-button
                    >
                  </a-col>
                </a-row>
              </a-col>
              <div class="delete-area">
                <a-button
                  type="danger"
                  size="small"
                  @click="deleteChannel(channel.id)"
                  :disabled="deleteDisabled"
                  >删除渠道</a-button
                >
              </div>
            </a-row>
            <div class="template-submit">
              <AButton type="primary" shape="round" @click="publishTemplate"
                >发布模版</AButton
              >
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from '@/store'
import { computed, defineComponent, onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Form, message } from 'ant-design-vue'
import { baseH5URL } from '@/services/http'
import { generateQRCode } from '@/helper'
import { last } from 'lodash'
import Clipboard from 'clipboard'
import axios from 'axios'

export default defineComponent({
  name: 'PublishForm',
  setup() {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const useForm = Form.useForm
    const currentWorkId = route.params.id as string
    const page = computed(() => store.state.editor.page)
    const channels = computed(() => store.state.editor.channels)
    const deleteDisabled = computed(() => channels.value.length === 1)
    const form = reactive({
      channelName: ''
    })
    const rules = reactive({
      channelName: [
        { required: true, message: '标题不能为空', trigger: 'blur' }
      ]
    })
    const { validate } = useForm(form, rules)

    const generateChannelURL = (id: number) =>
      `${baseH5URL}/p/${page.value.id}-${page.value.uuid}?channel=${id}`

    const createChannel = async () => {
      const payload = {
        name: form.channelName,
        workId: parseInt(currentWorkId)
      }
      try {
        await validate()
        await store.dispatch('createChannel', { data: payload })
        form.channelName = ''
      } catch (error) {
        console.log(error)
      }
    }

    const deleteChannel = (id: number) => {
      store.dispatch('deleteChannel', { urlParams: { id } })
    }

    onMounted(() => {
      const clipboard = new Clipboard('.copy-button')
      clipboard.on('success', (e) => {
        message.success('复制成功', 1)
        e.clearSelection()
      })
      channels.value.forEach(async (channel) => {
        await generateQRCode(
          `channel-barcode-${channel.id}`,
          generateChannelURL(channel.id)
        )
      })
    })
    //  () => channels 观察一份拷贝，不然传递的是引用类型
    // 使用 deep ，使其在 mutations 的时候都可以被监听
    watch(
      channels,
      async (newChannels, oldChannels) => {
        if (newChannels.length > oldChannels.length) {
          const createChannel = last(newChannels)

          if (createChannel) {
            await generateQRCode(
              `channel-barcode-${createChannel.id}`,
              generateChannelURL(createChannel.id)
            )
          }
        }
      },
      {
        flush: 'post' // DOM 节点生成之后
      }
    )

    const publishTemplate = async () => {
      // api/works/publish-template/2618
      axios.post('/works/publish-template/' + currentWorkId)
    }

    return {
      currentWorkId,
      page,
      channels,
      form,
      rules,
      deleteDisabled,
      generateChannelURL,
      createChannel,
      deleteChannel,
      publishTemplate
    }
  }
})
</script>

<style>
.left-col img {
  width: 80%;
}
.right-col img {
  width: 80px;
}
.left-gap {
  padding-left: 5px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.delete-area {
  position: absolute;
  top: 10px;
  right: 20px;
}
.channel-item {
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
  position: relative;
}
.barcode-container {
  height: 80px;
  width: 80px;
}
.template-submit {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
