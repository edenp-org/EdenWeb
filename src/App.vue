<template>
  <n-config-provider  :theme-overrides="myThemeOverrides">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">


// 定义全局的主题覆盖配置
const myThemeOverrides = {
  common: {
    // 通用主色
    primaryColor: '#C10200',
    primaryColorHover: '#C10200',
    primaryColorPressed: '#A70100',
    primaryColorFocus: '#C10200',

  },
  Button: {
    // 按钮的背景色
    colorPrimary: '#C10200',
  },
}
</script>
