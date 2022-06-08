import axios from 'axios'
import { Module } from 'vuex'
import { actionWrapper, GlobalDataProps } from '.'
import { RespData, RespListData } from '@/store/respTypes'
import { PageData } from './editor'

export type TemplateProps = Required<Omit<PageData, 'props' | 'setting'>>

// export interface TemplateProps {
//   _id?: string
//   id: number
//   title: string
//   desc?: string
//   coverImg: string
//   author: string
//   copiedCount: number
//   isHot?: boolean
//   isNew?: boolean
//   createdAt?: string
// }

export interface TemplatesProps {
  data: TemplateProps[]
  totalTemplates: number
  works: TemplateProps[]
  totalWorks: number
}

// export const testData: TemplateProps[] = [
//   {
//     _id: '61a739f38d5263ce811e7064',
//     id: 18,
//     title: '前端架构师直播海报',
//     desc: '未命名作品',
//     author: '136****5632',
//     coverImg:
//       'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
//     copiedCount: 1244,
//     isHot: true,
//     createdAt: '2020-11-18T05:47:04.000Z'
//   },
//   {
//     _id: '61a739f38d5263ce811e7065',
//     id: 19,
//     title: '1024 程序员日',
//     desc: '1024 程序员日',
//     author: '185****2625',
//     coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
//     copiedCount: 908,
//     isHot: true,
//     createdAt: '2020-11-26T09:27:19.000Z'
//   },
//   {
//     _id: '61a739f48d5263ce811e7066',
//     id: 20,
//     title: '招聘-慕课乐高',
//     desc: '招聘广告页',
//     author: '185****2625',
//     coverImg:
//       'https://static.imooc-lego.com/upload-files/screenshot-323204.png',
//     copiedCount: 453,
//     isHot: false,
//     createdAt: '2020-11-25T07:37:23.000Z'
//   },
//   {
//     _id: '61a739f48d5263ce811e7067',
//     id: 21,
//     title: '未命名作品',
//     desc: '未命名作品',
//     author: '136****5632',
//     coverImg:
//       'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
//     copiedCount: 248,
//     isHot: false,
//     createdAt: '2020-11-23T06:24:17.000Z'
//   },
//   {
//     _id: '61a739f48d5263ce811e7069',
//     id: 23,
//     title: '慕课资讯',
//     desc: '程序员的早读时间',
//     author: '136****5632',
//     coverImg:
//       'https://static.imooc-lego.com/upload-files/screenshot-726751.png',
//     copiedCount: 223,
//     isHot: false,
//     createdAt: '2020-11-18T14:48:36.000Z'
//   }
// ]

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: [],
    totalTemplates: 0,
    works: [],
    totalWorks: 0
  },
  getters: {
    getTemplateById: (state, getters, rootState) => (id: number) => {
      return state.data.find((t) => t.id === id)
    }
  },
  mutations: {
    fetchTemplates(state, rawData: RespListData<TemplateProps>) {
      const { count, list } = rawData.data
      state.data = [...state.data, ...list]
      state.totalTemplates = count
    },
    fetchWorks(state, rawData: RespListData<TemplateProps>) {
      const { count, list } = rawData.data
      state.works = list
      state.totalWorks = count
    },
    fetchTemplate(state, rawData: RespData<TemplateProps>) {
      state.data = [rawData.data]
    }
  },
  actions: {
    fetchTemplates: actionWrapper('/templates', 'fetchTemplates'),
    fetchWorks: actionWrapper('/works', 'fetchWorks'),
    fetchTemplate: actionWrapper('/templates/:id', 'fetchTemplate')
  }
}
export default templates
