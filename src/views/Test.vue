<template>
  <div>
    <canvas id="canvas"></canvas>
    <div id="ele">Hello</div>
    <a-button @click="drawCanvas">Click</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestComp',
  setup() {
    const drawCanvas = () => {
      // get elements
      const canvas = document.getElementById('canvas') as HTMLCanvasElement
      canvas.width = 400
      canvas.height = 400
      const element = document.getElementById('ele') as HTMLElement
      // create svg file
      const data = `
        <svg xmlns='http://www.w3.org/2000/svg' width='400px' height='400px'>
          <foreignObject width='100%' height='100%'>
            <div xmlns='http://www.w3.org/1999/xhtml'>
              ${element.innerHTML}
            </div>
          </foreignObject>
        </svg>
      `
      const svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
      // create a image element
      const url = URL.createObjectURL(svg)
      const image = new Image()
      image.src = url
      image.addEventListener('load', () => {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(image, 0, 0)
        }
      })
    }
    return {
      drawCanvas
    }
  }
})
</script>

<style scoped></style>
