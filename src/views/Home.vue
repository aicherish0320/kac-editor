<template>
  <div class="content-container">
    <a-row :gutter="16">
      <TemplateList :list="testData"></TemplateList>
    </a-row>
    <a-row type="flex" justify="center">
      <a-button type="primary" size="large">加载更多</a-button>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TemplateList from "@/components/TemplateList.vue";

const testData = [
  {
    _id: "61a739f38d5263ce811e7064",
    id: 18,
    title: "前端架构师直播海报",
    desc: "未命名作品",
    author: "136****5632",
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
    copiedCount: 1244,
    isHot: true,
    createdAt: "2020-11-18T05:47:04.000Z",
  },
  {
    _id: "61a739f38d5263ce811e7065",
    id: 19,
    title: "1024 程序员日",
    desc: "1024 程序员日",
    author: "185****2625",
    coverImg: "http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png",
    copiedCount: 908,
    isHot: true,
    createdAt: "2020-11-26T09:27:19.000Z",
  },
  {
    _id: "61a739f48d5263ce811e7066",
    id: 20,
    title: "招聘-慕课乐高",
    desc: "招聘广告页",
    author: "185****2625",
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-323204.png",
    copiedCount: 453,
    isHot: false,
    createdAt: "2020-11-25T07:37:23.000Z",
  },
  {
    _id: "61a739f48d5263ce811e7067",
    id: 21,
    title: "未命名作品",
    desc: "未命名作品",
    author: "136****5632",
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-677311.png",
    copiedCount: 248,
    isHot: false,
    createdAt: "2020-11-23T06:24:17.000Z",
  },
  {
    _id: "61a739f48d5263ce811e7069",
    id: 23,
    title: "慕课资讯",
    desc: "程序员的早读时间",
    author: "136****5632",
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-726751.png",
    copiedCount: 223,
    isHot: false,
    createdAt: "2020-11-18T14:48:36.000Z",
  },
];

export default defineComponent({
  name: "Home",
  components: { TemplateList },
  setup() {
    return {
      testData,
    };
  },
});
</script>

<style>
.page-title {
  color: #fff;
}
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 50px auto;
  width: 100%;
}
</style>
