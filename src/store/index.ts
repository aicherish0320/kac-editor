import { createStore } from 'vuex'
import user, { UserProps } from './user'
import templates, { TemplatesProps } from './templates'
import editor, { EditorProps } from './editor'

export interface GlobalDataProps {
  user: UserProps
  templates: TemplatesProps
  editor: EditorProps
}
// 范型：让自定义的类型流动到函数内部
export default createStore({
  modules: {
    user,
    templates,
    editor
  }
})
