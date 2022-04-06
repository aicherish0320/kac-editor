import { TextComponentProps } from '@/defaultProps'
import { pick } from 'lodash-es'
import { computed } from 'vue'

// 使用范型将 props 类型流动到函数中，使得函数返回值可以得到类型
const useComponentCommon = (
  props: Readonly<Partial<TextComponentProps>>,
  picks: string[]
) => {
  const styleProps = computed(() => pick(props, picks))
  const handleClick = () => {
    if (props.actionType === 'url' && props.url) {
      window.location.href = props.url
    }
  }

  return {
    styleProps,
    handleClick
  }
}

export default useComponentCommon
