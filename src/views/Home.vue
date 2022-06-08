<template>
  <div class="content-container">
    <a-row :gutter="16">
      <TemplateList :list="templateLists"></TemplateList>
    </a-row>
    <a-row type="flex" justify="center">
      <a-button
        type="primary"
        size="large"
        @click="loadMorePage"
        :disabled="isLastPage"
        >加载更多
      </a-button>
    </a-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import TemplateList from '@/components/TemplateList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import useLoadMore from '@/hooks/useLoadMore'

export default defineComponent({
  name: 'Home',
  components: { TemplateList },
  setup() {
    const store = useStore<GlobalDataProps>()
    const total = computed(() => store.state.templates.totalTemplates)
    const templateLists = computed(() => store.state.templates.data)

    const { loadMorePage, isLastPage } = useLoadMore('fetchTemplates', total, {
      pageSize: 3,
      pageIndex: 0
    })

    onMounted(() => {
      store.dispatch('fetchTemplates', {
        searchParams: { pageSize: 3, pageIndex: 0 }
      })

      window.addEventListener('scroll', () => {
        const totalPageHeight = document.body.scrollHeight
        const scrollPoint = window.scrollY + window.innerHeight
        if (scrollPoint >= totalPageHeight && !isLastPage.value) {
          loadMorePage()
        }
      })
    })

    return {
      templateLists,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style>
.page-title {
  color: #fff;
}
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 50px auto;
  width: 100%;
}
</style>
