<template>
  <div>
    <button @click="handleClick">你点我呀，略略略</button>
    <input type="text" value="Hello" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestComp',
  setup() {
    // 方法一
    // const handleClick = () => {
    //   navigator.clipboard.writeText('Aicherish').then(
    //     () => {
    //       alert('Nice')
    //     },
    //     (e) => {
    //       console.log(e)
    //     }
    //   )
    // }
    // 方法二
    const handleClick = () => {
      const result = document.execCommand('copy')
      console.log('result >>> ', result)
    }
    return {
      handleClick
    }
  }
})
</script>

<style scoped></style>
