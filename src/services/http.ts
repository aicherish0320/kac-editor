import store from '@/store'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'

export type ICustomAxiosConfig = AxiosRequestConfig & {
  opName?: string
}

const baseBackendURL = 'http://182.92.168.192:8081'
axios.defaults.baseURL = `${baseBackendURL}/api/`

axios.interceptors.request.use((config) => {
  const newConfig = config as ICustomAxiosConfig
  store.commit('setError', { status: false, message: '' })
  store.commit('startLoading', { opName: newConfig.opName })
  return config
})

axios.interceptors.response.use(
  (resp) => {
    const { config, data } = resp
    const newConfig = config as ICustomAxiosConfig
    store.commit('finishLoading', { opName: newConfig.opName })
    const { errno, message } = data
    if (errno && errno !== 0) {
      store.commit('setError', { status: true, message })
      return Promise.reject(data)
    }
    return resp
  },
  (e: AxiosError) => {
    const newConfig = e.config as ICustomAxiosConfig
    store.commit('setError', { status: true, message: '服务器错误' })
    store.commit('finishLoading', { opName: newConfig.opName })
    return Promise.reject(e)
  }
)
