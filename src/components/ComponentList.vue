<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <KaText v-bind="item"></KaText>
    </div>
  </div>
  <StyledUploader @success="onImageUploaded"></StyledUploader>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import KaText from './KaText.vue'
import StyledUploader from './StyledUploader.vue'
export default defineComponent({
  name: 'ComponentList',
  components: {
    KaText,
    StyledUploader
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  setup(props, context) {
    const onItemClick = (data: any) => {
      context.emit('on-item-click', data)
    }
    const onImageUploaded = () => {
      console.log(' onImageUploaded ')
    }
    return {
      onItemClick,
      onImageUploaded
    }
  }
})
</script>

<style>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
.component-item > * {
  position: static !important;
}
</style>
