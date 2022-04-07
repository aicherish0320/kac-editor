import { TextComponentProps } from './defaultProps'

export interface PropToForm {
  component: string
  subComponent?: string
  value?: string
  extraProps?: { [key: string]: any }
  text?: string
  options?: {
    text: string
    value: any
  }[]
  initialTransform?: (v: any) => any
}

export type PropsToForms = {
  [p in keyof TextComponentProps]?: PropToForm
}

export const mapPropsToForms: PropsToForms = {
  text: {
    text: '文本',
    component: 'a-textarea',
    extraProps: {
      row: 3
    }
  },
  fontSize: {
    text: '字号',
    component: 'a-input-number',
    initialTransform: (v: string) => parseInt(v)
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    initialTransform: (v: string) => parseFloat(v)
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
    ]
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
  }
}