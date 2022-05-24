<template>
  <router-link to="/login" v-if="!user.isLogin">
    <a-button type="primary" class="user-profile-component" @click="login">
      登录
    </a-button>
  </router-link>
  <div v-else>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user.data.nickName }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="createDesign">创建作品</a-menu-item>
          <a-menu-item key="1"
            ><router-link to="/works">我的作品</router-link></a-menu-item
          >
          <a-menu-item key="2" @click="logout" id="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { UserProps } from '@/store/user'
import { message } from 'ant-design-vue'
import axios from 'axios'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const createDesign = async () => {
      const payload = {
        title: '未命名作品',
        desc: '未命名作品',
        coverImg:
          'http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png'
      }
      const postData = {
        method: 'post',
        data: payload,
        opName: 'createDesign'
      } as any
      const { data } = await axios('/works', postData)
      message.success('创建作品成功', 2)
      router.push(`/editor/${data.data.id}`)
    }

    const login = () => {
      store.commit('login')
      message.success('登录成功', 2)
    }
    const logout = () => {
      store.commit('logout')
      message.success('退出登录成功，2秒后跳转到登陆页', 2)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
    return {
      createDesign,
      login,
      logout
    }
  }
})
</script>

<style scoped></style>
