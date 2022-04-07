<template>
  <div class="props-table">
    <div
      v-for="(value, key) in finalProps"
      :key="key"
      class="prop-item"
      :id="`item-${key}`"
    >
      <template v-if="value">
        <span class="label" v-if="value.text">{{ value.text }}</span>
        <component
          :is="value.component"
          :value="value.value"
          v-bind="value.extraProps"
        >
        </component>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { TextComponentProps } from '@/defaultProps'
import { mapPropsToForms, PropsToForms } from '@/propsMap'
import { reduce } from 'lodash'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'PropsTable',
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true
    }
  },
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps
          const item = mapPropsToForms[newKey]
          if (item) {
            item.value = value
            result[newKey] = item
          }
          return result
        },
        {} as PropsToForms
      )
    })
    return {
      finalProps
    }
  }
})
</script>

<style>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.label {
  width: 28%;
}
.prop-component {
  width: 70%;
}
.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 0 0;
}
#item-fontWeight {
  margin-left: 28%;
}
.component-a-select .ant-select {
  width: 150px;
}
.prop-component.component-shadow-picker,
.prop-component.component-image-processer,
.prop-component.component-background-processer {
  width: 100%;
}
</style>
