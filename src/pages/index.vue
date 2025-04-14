<script setup lang="ts">
import HeaderBar from '@/components/home/HeaderBar.vue'
import PostList from '@/components/home/PostList.vue'
import SideBar from '@/components/home/SideBar.vue'

const collapsed = ref(false)
</script>

<template>
  <div class="home-layout">
    <!-- 顶部导航栏 -->
    <HeaderBar class="header-bar" />

    <!-- 内容区域：左边栏 + 主内容 -->
    <div class="content-wrapper">
      <SideBar class="sidebar" :collapsed="collapsed" @toggle-collapse="collapsed = !collapsed" />
      <div class="main-box">
        <PostList class="post-list" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f4f5;
  padding: 0.521vw;
}

.header-bar {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 15vw;
  min-width: 180px;
  max-width: 240px;
  background-color: #fff;
  border-right: 1px solid #eee;
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 56px;
  min-width: 56px;
}

.main-box {
  width: 100%;
  padding: 1rem 5rem;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main-box::-webkit-scrollbar {
  display: none;
}
/* .post-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  min-width: 0;
  max-width: 100%;
} */
</style>
