// import { AllComponentProps, TextComponentProps } from '@/defaultProps'
import { insertAt } from '@/helper'
import { message } from 'ant-design-vue'
import {
  AllComponentProps,
  TextComponentProps,
  textDefaultProps,
  imageDefaultProps
} from 'kac-components'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { Module } from 'vuex'
import store, { GlobalDataProps } from '.'
import { RespWorkData } from './respTypes'

export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'

export interface UpdateComponentData {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>
  value: string | string[]
  id: string
  isRoot?: boolean
}

export interface HistoryProps {
  id: string
  componentId: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number
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

const debounceChange = (callback: (...args: any) => void, timeout = 1000) => {
  let timer = 0
  return (...args: any) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      timer = 0
      callback(...args)
    }, timeout)
  }
}

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
  copiedComponent?: ComponentData
  // 当前操作的历史记录
  histories: HistoryProps[]
  // 当前历史记录的操作位置
  historyIndex: number
  // 开始更新时的缓存值
  cachedOldValues: any
  // 保存最多历史条目记录数
  maxHistoryNumber: number
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

const modifyHistory = (
  state: EditorProps,
  history: HistoryProps,
  type: 'undo' | 'redo'
) => {
  const { componentId, data } = history
  const { key, oldValue, newValue } = data
  const newKey = key as keyof AllComponentProps | Array<keyof AllComponentProps>
  const updatedComponent = state.components.find(
    (component) => component.id === componentId
  )
  if (updatedComponent) {
    // check if key is array
    if (Array.isArray(newKey)) {
      newKey.forEach((keyName, index) => {
        updatedComponent.props[keyName] =
          type === 'undo' ? oldValue[index] : newValue[index]
      })
    } else {
      updatedComponent.props[newKey] = type === 'undo' ? oldValue : newValue
    }
  }
}

const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  // check historyIndex is already moved
  if (state.historyIndex !== -1) {
    // if moved, delete all the records greater than the index
    state.histories = state.histories.slice(0, state.historyIndex)
    // move historyIndex to unmoved
    state.historyIndex = -1
  }
  // check length
  if (state.histories.length < state.maxHistoryNumber) {
    state.histories.push(historyRecord)
  } else {
    // larger than max number
    // shift the first
    // push to last
    state.histories.shift()
    state.histories.push(historyRecord)
  }
}

const pushModifyHistory = (
  state: EditorProps,
  { key, value, id }: UpdateComponentData
) => {
  pushHistory(state, {
    id: uuidv4(),
    componentId: id || state.currentElement,
    type: 'modify',
    data: { oldValue: state.cachedOldValues, newValue: value, key }
  })
  state.cachedOldValues = null
}

const pushHistoryDebounce = debounceChange(pushModifyHistory)

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    page: {
      props: pageDefaultProps,
      title: 'test title'
    },
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 5
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(
        (component) => component.id === state.currentElement
      )
    },
    getElement: (state, id: string | undefined) => {
      state.components.find(
        (component) => component.id === (id || state.currentElement)
      )
    },
    checkUndoDisable(state) {
      // 1 no history item
      // 2 move to the first item
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true
      }
      return false
    },
    checkRedoDisable(state) {
      if (
        state.histories.length === 0 ||
        state.historyIndex === state.histories.length ||
        state.historyIndex === -1
      ) {
        return true
      }
      return false
    }
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      component.layerName = `图层` + state.components.length + 1
      state.components.push(component)
      // history
      state.histories.push({
        id: uuidv4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component)
      })
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    },
    undo(state) {
      // never undo before
      if (state.historyIndex === -1) {
        // undo the last item of array
        state.historyIndex = state.histories.length - 1
      } else {
        // undo to the previous step
        state.historyIndex--
      }
      // get the history record
      const history = state.histories[state.historyIndex]
      switch (history.type) {
        case 'add':
          // if create a component, we should remove it
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          )
          break
        case 'delete':
          // if delete a component, we should restore it to the right position
          state.components = insertAt(
            state.components,
            history.index as number,
            history.data
          )
          break
        case 'modify': {
          modifyHistory(state, history, 'undo')

          break
        }
        default:
          break
      }
    },
    redo(state) {
      // can't redo when historyIndex is the last item or historyIndex is never moved
      if (state.historyIndex === -1) {
        return
      }
      // get the record
      const history = state.histories[state.historyIndex]
      // process the history data
      switch (history.type) {
        case 'add':
          state.components.push(history.data)
          // state.components = insertAt(state.components, history.index as number, history.data)
          break
        case 'delete':
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          )
          break
        case 'modify': {
          modifyHistory(state, history, 'redo')
          break
        }
        default:
          break
      }
      state.historyIndex++
    },
    copyComponent(state, id) {
      const currentComponent = state.components.find(
        (component) => component.id === id
      )
      if (currentComponent) {
        state.copiedComponent = currentComponent
        message.success('已拷贝当前图层', 1)
      }
    },
    pasteCopiedComponent(state) {
      if (state.copiedComponent) {
        const clone = cloneDeep(state.copiedComponent)
        clone.id = uuidv4()
        clone.layerName = clone.layerName + '副本'
        state.components.push(clone)
        message.success('已粘贴当前图层', 1)
      }
    },
    deleteComponent(state, id) {
      const currentComponent = state.components.find(
        (component) => component.id === id
      )
      if (currentComponent) {
        const componentIndex = state.components.findIndex(
          (component) => component.id === id
        )
        state.components = state.components.filter(
          (component) => component.id !== id
        )
        // history
        state.histories.push({
          id: uuidv4(),
          componentId: currentComponent.id,
          type: 'delete',
          data: currentComponent,
          index: componentIndex
        })

        message.success('删除当前图层成功', 1)
      }
    },
    moveComponent(
      state,
      data: { direction: MoveDirection; amount: number; id: string }
    ) {
      const currentComponent = state.components.find(
        (component) => component.id === data.id
      )
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || '0')
        const oldLeft = parseInt(currentComponent.props.left || '0')
        const { direction, amount } = data
        switch (direction) {
          case 'Up': {
            const newValue = oldTop - amount + 'px'
            store.commit('updateComponent', {
              key: 'top',
              value: newValue,
              id: data.id
            })
            break
          }
          case 'Down': {
            const newValue = oldTop + amount + 'px'
            store.commit('updateComponent', {
              key: 'top',
              value: newValue,
              id: data.id
            })
            break
          }
          case 'Left': {
            const newValue = oldLeft - amount + 'px'
            store.commit('updateComponent', {
              key: 'left',
              value: newValue,
              id: data.id
            })
            break
          }
          case 'Right': {
            const newValue = oldLeft + amount + 'px'
            store.commit('updateComponent', {
              key: 'left',
              value: newValue,
              id: data.id
            })
            break
          }

          default:
            break
        }
      }
    },
    updateComponent(state, { key, value, id, isRoot }: UpdateComponentData) {
      const updatedComponent = state.components.find(
        (component) => component.id === (id || state.currentElement)
      )
      if (updatedComponent) {
        if (isRoot) {
          ;(updatedComponent as any)[key as string] = value
        } else {
          // history
          const oldValue = Array.isArray(key)
            ? key.map((key) => updatedComponent.props[key])
            : updatedComponent.props[key]

          if (!state.cachedOldValues) {
            state.cachedOldValues = oldValue
          }

          pushHistoryDebounce(state, { key, value, id })

          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName, index) => {
              updatedComponent.props[keyName] = value[index]
            })
          } else if (typeof key === 'string' && typeof value === 'string') {
            updatedComponent.props[key] = value
          }
        }
      }
    },
    updatePage(state, { key, value, isRoot }) {
      if (isRoot) {
        state.page[key as keyof PageData] = value
      } else if (state.page.props) {
        state.page.props[key as keyof PageProps] = value
      }
    },
    /*
      Editor 中的数据结构
      {
        page: {
          id: '',
          title: ''
          props: {
            backgroundColor: ''
          }
        },
        components: [{}, {}]
      }
      后端
      {
        id: '',
        title: '',
        content: {
          components: [],
          props: {
            backgroundColor: ''
          }
        }
      }
    */
    fetchWork(state, { data }: RespWorkData) {
      const { content, ...rest } = data
      state.page = { ...state.page, ...rest }
      if (content.props) {
        state.page.props = content.props
      }
      state.components = content.components
    }
  }
}

export default editor
