import { takeScreenshotAndUpload } from '@/helper'
import { GlobalDataProps } from '@/store'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import useSaveWork from './useSaveWork'

function usePublishWork() {
  const store = useStore<GlobalDataProps>()
  const route = useRoute()
  const currentWorkId = route.params.id
  const channels = computed(() => store.state.editor.channels)
  const isPublishing = ref(false)
  const { saveWork } = useSaveWork(true)

  const publishWork = async (el: HTMLElement) => {
    try {
      //1 take screenshot and upload
      const resp = await takeScreenshotAndUpload(el)
      if (resp) {
        // 2 update page coverImg in store
        store.commit('updatePage', {
          key: 'coverImg',
          value: resp.data.urls[0],
          isRoot: true
        })
        // 3 save work
        await saveWork()
        // 4 publish work
        await store.dispatch('publishWork', {
          urlParams: { id: currentWorkId }
        })
        // 5 get channels list
        await store.dispatch('fetchChannels', {
          urlParams: { id: currentWorkId }
        })
        // 6 if channels list length is 0, create a new channel
        if (channels.value.length === 0) {
          await store.dispatch('createChannel', {
            data: { name: '默认', workId: parseInt(currentWorkId as string) }
          })
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      isPublishing.value = false
    }
  }

  return {
    publishWork,
    isPublishing
  }
}

export default usePublishWork
