import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import KacComponents from 'kac-components'
import 'kac-components/dist/bundle.css'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import 'cropperjs/dist/cropper.css'
// http://182.92.168.192:8081
const app = createApp(App)

app.use(Antd).use(KacComponents).use(store).use(router)
app.mount('#app')
