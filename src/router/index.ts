import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

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
      title: '登录到爱鹊絮',
      disableLoading: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
