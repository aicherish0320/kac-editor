import { TextComponentProps } from './defaultProps'

export interface PropToForm {
  component: string
  subComponent?: string
  value?: string
  extraProps?: { [key: string]: any }
  text?: string
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
    text: '字体',
    component: 'a-input-number'
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    }
  }
}
