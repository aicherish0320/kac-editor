<template>
  <div
    class="edit-wrapper"
    ref="editWrapper"
    :data-component-id="id"
    @click="onItemClick(id)"
    :style="styles"
    :class="{ active: active, hidden: hidden }"
    @mousedown="startMove"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { pick } from 'lodash-es'

export default defineComponent({
  name: 'EditWrapper',
  props: {
    id: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object
    }
  },
  emits: ['set-active'],
  setup(props, context) {
    const editWrapper = ref<null | HTMLElement>(null)

    const onItemClick = (id: string) => {
      context.emit('set-active', id)
    }

    const styles = computed(() =>
      pick(props.props, ['position', 'top', 'left', 'width', 'height'])
    )

    const gap = {
      x: 0,
      y: 0
    }

    const calculateMovePosition = (e: MouseEvent) => {
      const container = document.getElementById('canvas-area')
      const containerOffsetLeft = container?.offsetLeft || 0
      const containerOffsetTop = container?.offsetTop || 0
      const left = e.clientX - gap.x - containerOffsetLeft
      const top = e.clientY - gap.y - containerOffsetTop

      return {
        left,
        top
      }
    }

    const startMove = (e: MouseEvent) => {
      const currentElement = editWrapper.value
      if (currentElement) {
        const { left, top } = currentElement.getBoundingClientRect()
        gap.x = e.clientX - left
        gap.y = e.clientY - top
        console.log(e.clientX, left)
      }
      const handleMove = (e: MouseEvent) => {
        const { left, top } = calculateMovePosition(e)
        if (currentElement) {
          currentElement.style.top = top + 'px'
          currentElement.style.left = left + 'px'
        }
      }
      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMove)
      }

      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return {
      onItemClick,
      styles,
      editWrapper,
      startMove
    }
  }
})
</script>

<style>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  box-sizing: content-box !important;
}
.edit-wrapper > * {
  position: static !important;
  width: 100% !important;
  height: 100% !important;
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.edit-wrapper.hidden {
  display: none;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
.edit-wrapper .resizers {
  display: none;
}
.edit-wrapper.active .resizers {
  display: block;
}
.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #1890ff;
  position: absolute;
}
.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
