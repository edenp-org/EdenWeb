<script setup lang="ts">
import PostCard from './PostCard.vue'
import 'vue-masonry-css' // 必须要导入这句！

const posts = [...Array.from({ length: 20 })].map((_, i) => ({
  id: i + 1,
  title: `测试标题 ${i + 1}`,
  author: `作者 ${i + 1}`,
  avatar: `https://i.pravatar.cc/150?img=${i + 5}`,
  tags: ['#格斗', '#热血'],
  cover: i % 2 === 0 ? `https://picsum.photos/400/300?random=${i}` : '',
}))
</script>

<template>
  <div class="masonry">
    <div v-for="item in posts" :key="item.id" class="masonry-item">
      <PostCard :post="item" />
    </div>
  </div>
</template>

  <style scoped>
  .masonry {
  column-count: 3; /* 必须设置列数 */
  column-gap: 6rem; /* 列间距 */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}
.post-list-wrapper :deep(.post-card) {
  break-inside: avoid;
  margin-bottom: 1.5rem;
  width: 100%;
}
.masonry-item {
  break-inside: avoid; /* 防止拆分 */
  margin-bottom: 1.5rem;
}
</style>
