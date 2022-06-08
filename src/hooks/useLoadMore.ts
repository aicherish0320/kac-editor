import { computed, ComputedRef, ref } from 'vue'
import { useStore } from 'vuex'

interface LoadParams {
  pageIndex: number
  pageSize: number
  [key: string]: any
}

const useLoadMore = (
  actionName: string,
  total: ComputedRef<number>,
  params: LoadParams = { pageIndex: 0, pageSize: 4 }
) => {
  const store = useStore()
  const pageIndex = ref(params.pageIndex)
  const requestParams = computed(() => {
    return {
      ...params,
      pageIndex: pageIndex.value + 1
    }
  })

  const loadMorePage = () => {
    store
      .dispatch(actionName, { searchParams: requestParams.value })
      .then(() => pageIndex.value++)
  }
  const isLastPage = computed(() => {
    // pageIndex 从 0 开始
    return Math.ceil(total.value / params.pageSize) === pageIndex.value + 1
  })
  return { loadMorePage, isLastPage, pageIndex }
}

export default useLoadMore
