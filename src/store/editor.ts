// import { AllComponentProps, TextComponentProps } from '@/defaultProps'
import {
  AllComponentProps,
  TextComponentProps,
  textDefaultProps,
  imageDefaultProps
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

export interface HistoryProps {
  id: string
  componentId: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number
}

export interface ChannelProps {
  id: number
  name: string
  workId: number
  status: number
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[]
  // 当前编辑的是哪个元素，uuid
  currentElement: string
  // 当然最后保存的时候还有有一些项目信息，这里并没有写出，等做到的时候再补充
  page: PageData
  // 当前被复制的组件
  // copiedComponent?: ComponentData
  // // 当前操作的历史记录
  // histories: HistoryProps[]
  // // 当前历史记录的操作位置
  // historyIndex: number
  // // 开始更新时的缓存值
  // cachedOldValues: any
  // // 保存最多历史条目记录数
  // maxHistoryNumber: number
  // // 数据是否有修改
  // isDirty: boolean
  // // 当前 work 的 channels
  // channels: ChannelProps[]
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'ka-text',
    layerName: '图层2',
    props: {
      ...textDefaultProps,
      text: '爱鹊絮',
      fontSize: '30px',
      color: '#f00',
      width: '100px',
      height: '100px',
      top: '20px',
      left: '20px',
      backgroundColor: '#ccc'
    }
  }
  // {
  //   id: uuidv4(),
  //   name: 'ka-text',
  //   layerName: '图层1',
  //   props: {
  //     ...textDefaultProps,
  //     text: '爱鹊絮',
  //     fontSize: '30px',
  //     fontWeight: 'bold',
  //     color: '#f00'
  //   }
  // },
  // {
  //   id: uuidv4(),
  //   name: 'ka-image',
  //   layerName: '图层4',
  //   props: {
  //     ...imageDefaultProps,
  //     src: 'https://aic-lego.oss-cn-hangzhou.aliyuncs.com/upload-files/backet-019541.png',
  //     width: '100px'
  //   }
  // }

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

const pageDefaultProps = {
  backgroundColor: '#ffffff',
  // backgroundImage: '',
  backgroundImage:
    'url("https://aic-lego.oss-cn-hangzhou.aliyuncs.com/upload-files/kj-769931.jpeg")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '560px'
}

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    page: {
      props: pageDefaultProps,
      title: 'test title'
    }
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
      console.log(key, value)

      if (updatedComponent) {
        if (isRoot) {
          ;(updatedComponent as any)[key] = value
        } else {
          updatedComponent.props[key as keyof TextComponentProps] = value
        }
      }
    },
    updatePage(state, { key, value }) {
      if (state.page.props) {
        state.page.props[key as keyof PageProps] = value
      }
    }
  }
}

export default editor
