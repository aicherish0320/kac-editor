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
        <div class="prop-component">
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
                >{{ o.text }}
              </component>
            </template>
          </component>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { TextComponentProps } from '@/defaultProps'
import IconSwitch from '@/components/IconSwitch.vue'
import { mapPropsToForms } from '@/propsMap'
import { reduce } from 'lodash'
import { computed, defineComponent, PropType, VNode } from 'vue'

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
    IconSwitch
  },
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true
    }
  },
  emits: ['change'],
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps
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
.prop-component.component-image-processer,
.prop-component.component-background-processer {
  width: 100%;
}
</style>
