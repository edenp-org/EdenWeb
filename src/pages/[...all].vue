<!-- src/pages/[...all].vue -->
<template>
    <div class="not-found">
      <n-result status="404" title="404" subTitle="页面未找到">
        <template #extra>
          <n-button type="primary" @click="goHome">返回首页</n-button>
        </template>
      </n-result>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  const router = useRouter()
  function goHome() {
    router.push('/')
  }
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
  }
  </style>
  