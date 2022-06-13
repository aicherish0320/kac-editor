import { TextComponentProps } from '@/defaultProps'
import store from '@/store'
import { testComponents } from '@/store/editor'
import { clone, last } from 'lodash-es'

const cloneComponents = clone(testComponents)

describe('test vuex store', () => {
  it('should have three modules', () => {
    expect(store.state).toHaveProperty('user')
    expect(store.state).toHaveProperty('templates')
    expect(store.state).toHaveProperty('editor')
  })
  describe('test user module', () => {
    it('test user module', () => {
      store.commit('login')
      expect(store.state.user.isLogin).toBeTruthy()
    })
    it('test logout mutation', () => {
      store.commit('logout')
      expect(store.state.user.isLogin).toBeFalsy()
    })
  })
  describe('test templates module', () => {
    it('should have default templates', () => {
      expect(store.state.templates.data).toHaveLength(testData.length)
    })
    it('should get the correct template by Id', () => {
      const selectTemplate = store.getters.getTemplateById(18)
      expect(selectTemplate.title).toBe('前端架构师直播海报')
    })
  })
  describe('test editor module', () => {
    it('should have default components', () => {
      expect(store.state.editor.components).toHaveLength(cloneComponents.length)
    })
    it('should get current component when set active one component', () => {
      store.commit('setActive', cloneComponents[0].id)
      expect(store.state.editor.currentElement).toBe(cloneComponents[0].id)
      const currentElement = store.getters.getCurrentElement
      expect(currentElement.id).toBe(cloneComponents[0].id)
    })
    it('add component should works find', () => {
      const payload: Partial<TextComponentProps> = {
        text: 'text1'
      }
      store.commit('addComponent', payload)
      expect(store.state.editor.components).toHaveLength(
        cloneComponents.length + 1
      )
      const lastItem = last(store.state.editor.components)
      if (lastItem && lastItem.props) {
        expect(lastItem.props.text).toBe('text1')
      }
    })
    it('update component should works fine', () => {
      // const newProps = {
      //   key: 'key',
      //   value: 'update'
      // }
      // store.commit('updateComponent', newProps)
      // const currentElement: ComponentData = store.getters.getCurrentElement
      // expect(currentElement.props.text).toBe('update')
    })
  })
})
