<template>
  <uploader
    action="http://localhost:3300/api/upload"
    listType="picture"
  ></uploader>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Uploader from './components/Uploader.vue'
export default defineComponent({
  components: {
    Uploader
  }
})
</script>

<style lang="scss"></style>
