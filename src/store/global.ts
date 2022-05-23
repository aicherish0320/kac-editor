import { Module } from 'vuex'
import { GlobalDataProps } from './index'

export interface GlobalStatus {
  opNames: { [key: string]: boolean }
  requestNumber: number
  error: {
    status: boolean
    message?: string
  }
}
const global: Module<GlobalStatus, GlobalDataProps> = {
  state: {
    requestNumber: 0,
    opNames: {},
    error: {
      status: false
    }
  },
  getters: {
    isLoading: (state) => {
      return state.requestNumber > 0
    },
    isOpLoading: (state) => (opName: string) => {
      return state.opNames[opName]
    }
  }
}

export default global
