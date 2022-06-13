<template>
  <div class="props-table">
    <div
      v-for="(value, key) in finalProps"
      :key="key"
      class="prop-item"
      :class="{ 'no-text': !value.text }"
      :id="`item-${key}`"
    >
      <template v-if="value">
        <span class="label" v-if="value.text">{{ value.text }}</span>
        <div :class="`prop-component component-${value.component}`">
          <component
            :is="value.component"
            :[value.valueProp]="value.value"
            v-bind="value.extraProps"
            v-on="value.events"
          >
            <template v-if="value.options">
              <component
                :is="value.subComponent"
                v-for="(o, k) in value.options"
                :key="k"
                :value="o.value"
              >
                <RenderVnode :vNode="o.text"></RenderVnode>
              </component>
            </template>
          </component>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import IconSwitch from '@/components/IconSwitch.vue'
import ColorPicker from './ColorPicker.vue'
import BackgroundProcessor from './BackgroundProcessor.vue'
import ShadowPicker from './ShadowPicker.vue'
import RenderVnode from './RenderVNode'
import { mapPropsToForms } from '@/propsMap'
import { reduce } from 'lodash-es'
import { computed, defineComponent, PropType, VNode } from 'vue'
import { AllComponentProps } from 'kac-components'
import ImageProcessor from '@/components/ImageProcessor.vue'

// 在此处定义一个与 PropToForm 类似的数据结构
// 因为有部分属性是在属性表单定义的时候需要的 (initialTransform)
// 而有的属性是在渲染时需要的 (value events)
interface FormProps {
  component: string
  subComponent?: string
  value: string
  extraProps?: { [key: string]: any }
  text?: string
  options?: { text: string | VNode; value: any }[]
  valueProp: string
  eventName: string
  events: { [key: string]: (e: any) => void }
}

export default defineComponent({
  name: 'PropsTable',
  components: {
    IconSwitch,
    RenderVnode,
    ColorPicker,
    ImageProcessor,
    ShadowPicker,
    BackgroundProcessor
  },
  props: {
    props: {
      type: Object as PropType<AllComponentProps>,
      required: true
    }
  },
  emits: ['change'],
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof AllComponentProps
          const item = mapPropsToForms[newKey]

          if (item) {
            const {
              valueProp = 'value',
              eventName = 'change',
              initialTransform,
              afterTransform
            } = item
            const newItem: FormProps = {
              ...item,
              value: initialTransform ? initialTransform(value) : value,
              valueProp,
              eventName,
              events: {
                [eventName]: (e: any) => {
                  context.emit('change', {
                    key,
                    value: afterTransform ? afterTransform(e) : e
                  })
                }
              }
            }
            result[newKey] = newItem
          }

          return result
        },
        {} as { [key: string]: FormProps }
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
.prop-component.component-image-processor,
.prop-component.component-background-processor {
  width: 100%;
}
</style>
