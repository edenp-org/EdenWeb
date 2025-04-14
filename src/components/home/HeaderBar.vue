<script setup lang="ts">
const keyword = ref('')

function onSearch() {
  console.warn('搜索关键词:', keyword.value)
  // TODO: 跳转或触发搜索逻辑
}
</script>

<template>
  <div class="header-wrapper">
    <!-- 左侧 Logo 可选插槽 -->
    <div class="logo">
      <img src="@/assets/EDEN_LOGO.png">
    </div>

    <!-- 中部搜索框 -->
    <n-input
      v-model:value="keyword"
      class="search-input"
      placeholder="搜索作品"
      style="height: 35px;border-radius: 5px;background-color:#F7F7F7;"
      @keydown.enter="onSearch"
    >
      <template #prefix>
        <img src="@/assets/sidebar/Search.png" alt="" style="width: 15px;">
      </template>
    </n-input>

    <!-- 右侧头像 -->
    <n-avatar
      round
      size="medium"
      src="https://i.pravatar.cc/150?img=12"
      class="user-avatar"
    />
  </div>
</template>

  <style scoped>
  .header-wrapper {
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  border-radius: 10px;
}
.logo {
  margin-left: 50px;
  img {
    width: 69px;
    height: auto;
  }
}
.search-input {
  width: 40%;
  max-width: 500px;
  transition: all 0.3s ease;
}

.user-avatar {
  cursor: pointer;
  transition: transform 0.2s;
}
.user-avatar:hover {
  transform: scale(1.05);
}
</style>
