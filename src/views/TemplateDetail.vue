<template>
  <div class="work-detail-container">
    <a-row type="flex" justify="center" v-if="template">
      <a-col :span="8" class="cover-img">
        <a :href="template.coverImg"
          ><img :src="template.coverImg" alt="" id="cover-img"
        /></a>
      </a-col>
      <a-col :span="8">
        <h2>{{ template.title }}</h2>
        <p>{{ template.desc }}</p>
        <div class="author">
          <a-avatar>V</a-avatar>
          该模版由 <b>{{ template.author }}</b> 创作
        </div>
        <div class="bar-code-area">
          <span>扫一扫，手机预览</span>
          <canvas id="barcode-container"></canvas>
        </div>
        <div class="use-button">
          <router-link :to="`/editor/${template.id}`">
            <a-button type="primary" size="large"> 使用模版 </a-button>
          </router-link>
          <a-button size="large"> 下载图片海报 </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const testTemplate = {
  _id: "61a739f38d5263ce811e7064",
  id: 18,
  title: "前端架构师直播海报",
  desc: "未命名作品",
  author: "136****5632",
  coverImg: "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
  copiedCount: 1244,
  isHot: true,
  createdAt: "2020-11-18T05:47:04.000Z",
};

export default defineComponent({
  name: "TemplateDetail",
  setup() {
    return {
      template: testTemplate,
    };
  },
});
</script>

<style scoped>
.work-detail-container {
  margin-top: 50px;
}
.cover-img {
  margin-right: 30px;
}
.cover-img img {
  width: 100%;
}
.use-button {
  margin: 30px 0;
}
.ant-avatar {
  margin-right: 10px;
}
.bar-code-area {
  margin: 20px 0;
}
#barcode-container {
  display: block;
}
</style>
