import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import KacComponents from 'kac-components'
import 'kac-components/dist/bundle.css'

import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.less'

import 'cropperjs/dist/cropper.css'
import './services/http.ts'

const app = createApp(App)

app.use(Antd).use(KacComponents).use(store).use(router)
app.mount('#app')
