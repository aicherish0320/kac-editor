<template>
  <component
    :is="tag"
    :style="styleProps"
    class="ka-text-component"
    @click="handleClick"
  >
    {{ text }}
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useComponentCommon from '../hooks/useComponentCommon'
import {
  textDefaultProps,
  textStylePropNames,
  transformToComponentProps
} from '@/defaultProps'

const defaultProps = transformToComponentProps(textDefaultProps)

export default defineComponent({
  name: 'KaText',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    ...defaultProps
  },
  setup(props) {
    const { styleProps, handleClick } = useComponentCommon(
      props,
      textStylePropNames
    )
    return { styleProps, handleClick }
  }
})
</script>

<style scoped>
h2.ka-text-component,
p.ka-text-component {
  margin-bottom: 0;
}
button.ka-text-component {
  padding: 5px 10px;
  cursor: pointer;
}
.ka-text-component {
  box-sizing: border-box;
  white-space: pre-wrap;
  position: relative !important;
}
</style>
