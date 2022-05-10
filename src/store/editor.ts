// import { AllComponentProps, TextComponentProps } from '@/defaultProps'
import {
  AllComponentProps,
  TextComponentProps
  // imageDefaultProps
} from 'kac-components'
import { v4 as uuidv4 } from 'uuid'
import { Module } from 'vuex'
import { GlobalDataProps } from '.'

export interface ComponentData {
  // 这个元素的 属性，属性请详见下面
  props: Partial<AllComponentProps>
  // id，uuid v4 生成
  id: string
  // 业务组件库名称 l-text，l-image 等等
  name: 'ka-text' | 'ka-image' | 'ka-shape'
  // 图层是否隐藏
  isHidden?: boolean
  // 图层是否锁定
  isLocked?: boolean
  // 图层名称
  layerName?: string
}

export interface PageProps {
  backgroundColor: string
  backgroundImage: string
  backgroundRepeat: string
  backgroundSize: string
  height: string
}

export interface PageData {
  id?: number
  props?: PageProps
  title?: string
  desc?: string
  coverImg?: string
  uuid?: string
  setting?: { [key: string]: any }
  isTemplate?: boolean
  isHot?: boolean
  isNew?: boolean
  author?: string
  copiedCount?: number
  status?: number
  user?: {
    gender: string
    nickName: string
    picture: string
    userName: string
  }
}

export type AllFormProps = PageProps & AllComponentProps

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[]
  // 当前编辑的是哪个元素，uuid
  currentElement: string
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'ka-text',
    layerName: '图层2',
    props: {
      text: 'hello',
      fontSize: '20px',
      lineHeight: '2',
      color: '#000000',
      textAlign: 'right',
      fontFamily: 'SimHei',
      fontWeight: 'normal'
    }
  },
  {
    id: uuidv4(),
    name: 'ka-text',
    layerName: '图层1',
    props: {
      text: 'hello2',
      fontSize: '30px',
      lineHeight: '1',
      color: '#f00',
      textAlign: 'center',
      fontFamily: '',
      fontWeight: 'bold'
    }
  },
  {
    id: uuidv4(),
    name: 'ka-image',
    layerName: '图层4',
    props: {
      // ...imageDefaultProps,
      src: 'https://aic-lego.oss-cn-hangzhou.aliyuncs.com/upload-files/kj-769931.jpeg',
      width: '100px'
    }
  }

  // {
  //   id: uuidv4(),
  //   name: 'ka-text',
  //   props: {
  //     text: 'hello3',
  //     fontSize: '40px',
  //     color: '#0f0',
  //     actionType: 'url',
  //     url: 'https://www.baidu.com'
  //   }
  // }
  // { id: uuidv4(), name: 'l-text', layerName:'图层2', props: { ...textDefaultProps, text: 'hello2', fontSize: '10px', fontWeight: 'bold', 'lineHeight': '2', textAlign: 'left', fontFamily: '' }},
  // { id: uuidv4(), name: 'l-text', layerName:'图层3', props: { ...textDefaultProps, text: 'hello3', fontSize: '15px', actionType: 'url', url: 'https://www.baidu.com', 'lineHeight': '3', textAlign: 'left', fontFamily: '' }},
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: ''
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(
        (component) => component.id === state.currentElement
      )
    }
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      // const newComponent: ComponentData = {
      //   id: uuidv4(),
      //   name: 'ka-text',
      //   props
      // }
      state.components.push(component)
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    },
    updateComponent(state, { key, value, id, isRoot }) {
      const updatedComponent = state.components.find(
        (component) => component.id === (id || state.currentElement)
      )
      if (updatedComponent) {
        if (isRoot) {
          ;(updatedComponent as any)[key] = value
        } else {
          updatedComponent.props[key as keyof TextComponentProps] = value
        }
      }
    }
  }
}

export default editor
