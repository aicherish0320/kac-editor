import { TextComponentProps } from '@/defaultProps'
import { v4 as uuidv4 } from 'uuid'
import { Module } from 'vuex'
import { GlobalDataProps } from '.'

export interface AllComponentProps {
  text: string
  fontSize: string
  fontFamily: string
  fontWeight: string
  fontStyle: string
  textDecoration: string
  lineHeight: string
  textAlign: string
  color: string
  backgroundColor: string
  actionType?: string
  url?: string
}

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
    props: {
      text: 'hello',
      fontSize: '20px',
      lineHeight: '2',
      color: '#000000'
    }
  },
  {
    id: uuidv4(),
    name: 'ka-text',
    props: {
      text: 'hello2',
      fontSize: '30px',
      lineHeight: '1',
      color: '#f00'
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
  // { id: uuidv4(), name: 'l-image', layerName:'图层4', props: { ...imageDefaultProps, src: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f3e3a17c305b1070f455202.jpg', width: '100px' }},
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
    addComponent(state, props: Partial<TextComponentProps>) {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: 'ka-text',
        props
      }
      state.components.push(newComponent)
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    }
  }
}

export default editor
