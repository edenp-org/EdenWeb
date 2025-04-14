<script setup lang="ts">
defineProps<{ post: {
  id: number
  title: string
  author: string
  avatar: string
  tags: string[]
  cover?: string
} }>()
</script>

<template>
  <n-card :hoverable="true" class="post-card">
    <!-- 文案标题 -->
    <div class="title">
      {{ post.title }}
    </div>

    <!-- 标签区域 -->
    <div class="tags">
      <n-tag
        v-for="tag in post.tags"
        :key="tag"
        size="small"
        type="default"
        class="tag"
      >
        {{ tag }}
      </n-tag>
    </div>

    <!-- 图片区域（可选） -->
    <div v-if="post.cover" class="cover-wrapper">
      <img :src="post.cover" alt="cover" class="cover">
    </div>

    <!-- 作者信息 -->
    <div class="author">
      <n-avatar :src="post.avatar" size="small" class="avatar" />
      <span class="author-name">{{ post.author }}</span>
    </div>
  </n-card>
</template>

  <style scoped>
  .post-card {
  width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transition: all 0.3s;
  margin-bottom: 2rem;
}
.post-card:hover {
  transform: translateY(-6px);
}
.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 20px;
}
.tag {
  background: #f4f4f4;
  color: #666;
  border: none;
}
.cover-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  margin-top: 20px;
}
.cover {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}
.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  color: #555;
  margin-top: 20px;
}
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.author-name {
  font-weight: 400;
}
</style>
