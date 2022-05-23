import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import createContextMenu, { ActionItem } from '../components/createContextMenu'
const initContextMenu = () => {
  const store = useStore()
  const testActions: ActionItem[] = [
    {
      shortcut: 'Backspace / Delete',
      text: '删除图层',
      action: (cid) => {
        store.commit('deleteComponent', cid)
      }
    },
    {
      shortcut: 'esc',
      text: '取消选中',
      action: () => {
        store.commit('setActive', '')
      }
    }
  ]

  // const testActions2: ActionItem[] = [
  //   {
  //     shortcut: 'Ctrl+C',
  //     text: '复制配置',
  //     action: () => {
  //       console.log(2)
  //     }
  //   }
  // ]
  let destroy: any
  // , destroy2: any
  onMounted(() => {
    destroy = createContextMenu(testActions)
    // destroy2 = createContextMenu(testActions2, 'settings-panel')
  })
  onUnmounted(() => {
    destroy()
    // destroy2()
  })
}

export default initContextMenu
