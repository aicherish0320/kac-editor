import { VNode } from 'vue'
import { TextComponentProps } from './defaultProps'

export interface PropToForm {
  component: string
  subComponent?: string
  extraProps?: { [key: string]: any }
  text?: string
  options?: { text: string | VNode; value: any }[]
  initialTransform?: (v: any) => any
  afterTransform?: (v: any) => any
  valueProp?: string
  eventName?: string
}

export type PropsToForms = {
  [p in keyof TextComponentProps]?: PropToForm
}

const defaultHandler = {
  component: 'a-input',
  eventName: 'change',
  valueProp: 'value',
  initialTransform: (v: any) => v,
  afterTransform: (e: any) => e
}

const pxToNumberHandler: PropToForm = {
  component: 'a-input-number',
  initialTransform: (v: string) => (v ? parseInt(v) : 0),
  afterTransform: (e: number) => (e ? `${e}px` : '')
}

export const mapPropsToForms: PropsToForms = {
  text: {
    text: '文本',
    component: 'a-textarea',
    extraProps: {
      row: 3
    },
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    text: '字号',
    ...pxToNumberHandler
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    initialTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString()
  },
  textAlign: {
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    text: '对齐',
    options: [
      {
        value: 'left',
        text: '左'
      },
      {
        value: 'center',
        text: '中'
      },
      {
        value: 'right',
        text: '右'
      }
    ],
    afterTransform: (e: any) => e.target.value
  },
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '字体',
    options: [
      {
        value: '',
        text: '无'
      },
      {
        value: '黑体',
        text: 'SimHei'
      },
      {
        value: 'FangSong',
        text: '仿宋'
      }
    ]
  },
  fontWeight: {
    component: 'icon-switch',
    initialTransform: (v: string) => v === 'bold',
    afterTransform: (e: boolean) => (e ? 'bold' : 'normal'),
    valueProp: 'checked',
    extraProps: { iconName: 'BoldOutlined', tip: '加粗' }
  }
}
