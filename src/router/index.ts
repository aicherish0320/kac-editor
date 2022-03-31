import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: () => import("@/views/Index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Home.vue"),
        meta: { title: "欢迎来到慕课乐高" },
      },
      {
        path: "template/:id",
        name: "template",
        component: () => import("@/views/TemplateDetail.vue"),
        meta: { title: "模版详情" },
      },
    ],
  },
  {
    path: "/editor/:id",
    name: "editor",
    component: () =>
      import(/* webpackChunkName: "editor" */ "../views/Editor.vue"),
    meta: { requiredLogin: true, title: "编辑我的设计" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
