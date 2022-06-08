import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'
import axios from 'axios'
import { message } from 'ant-design-vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/Index.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: { title: 'Welcome KacEditor' }
      },
      {
        path: 'template/:id',
        name: 'template',
        component: () => import('@/views/TemplateDetail.vue'),
        meta: { title: '模版详情' }
      }
    ]
  },
  {
    path: '/editor/:id',
    name: 'editor',
    component: () => import('../views/Editor.vue'),
    meta: { requiredLogin: true, title: '编辑我的设计' }
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      redirectAlreadyLogin: true,
      title: '登录到艾鹊絮',
      disableLoading: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to) => {
  const { user } = store.state
  const { token, isLogin } = user
  const { redirectAlreadyLogin, requiredLogin, title } = to.meta

  if (title) {
    document.title = title as string
  }
  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      try {
        await store.dispatch('fetchCurrentUser')
        if (redirectAlreadyLogin) {
          return '/'
        }
      } catch {
        message.error('登陆状态已过期 请重新登陆', 2)
        store.commit('logout')
        return '/login'
      }
    } else {
      if (requiredLogin) {
        return '/login'
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      return '/'
    }
  }
})

export default router
