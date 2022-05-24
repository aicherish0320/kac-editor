<template>
  <div class="homepage-container">
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">慕课乐高</router-link>
        </div>
        <user-profile :user="user"></user-profile>
      </a-layout-header>
      <a-layout-content class="home-layout">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      © 艾鹊絮（imooc.com）版权所有 | 津ICP备20000929号-2
    </a-layout-footer>
    <!-- <a-layout-header class="header">
      <div class="page-title">
        <router-link to="/">KacEditor</router-link>
      </div>
      <UserProfile :user="user"></UserProfile>
    </a-layout-header>
    <a-layout-content class="home-layout">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer>
      © kacherish（kac.com）版权所有 | 津ICP备20000929号-2
    </a-layout-footer> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import UserProfile from '@/components/UserProfile.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'

export default defineComponent({
  name: 'Index',
  setup() {
    const store = useStore<GlobalDataProps>()
    const user = computed(() => store.state.user)
    return {
      user
    }
  },
  components: { UserProfile }
})
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  color: #fff;
}
</style>
