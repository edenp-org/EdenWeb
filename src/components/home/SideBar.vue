<script setup lang="ts">
import { NIcon, NMenu } from 'naive-ui'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ collapsed: boolean }>()
// const _emit = defineEmits(['toggleCollapse'])
console.error(props)
const router = useRouter()
const activeKey = ref('home')

const menuOptions: any[] = [
  { label: '首页', key: 'home', icon: 'index' },
  { label: '列表', key: 'list', icon: 'list' },
  { label: '合集', key: 'collection', icon: 'collection' },
  { label: '作品', key: 'work', icon: 'work' },
  { label: '我的主页', key: 'mine', icon: 'my' },
  {
    label: '发布作品',
    key: 'publish',
    icon: 'publish',
    children: [
      { label: '文章', key: 'publish-article', icon: 'article' },
      { label: '图片', key: 'publish-picture', icon: 'article' },
    ],
  },
]

function handleClick(key: string) {
  activeKey.value = key
  const pathMap: Record<string, string> = {
    'home': '/',
    'list': '/list',
    'collection': '/collection',
    'work': '/work',
    'mine': '/mine',
    'publish-article': '/publish/article',
    'publish-picture': '/publish/picture',
  }
  if (pathMap[key])
    router.push(pathMap[key])
}

function renderMenuIcon(option: any) {
  const isActive = option.key === activeKey.value
  const suffix = isActive ? '-f' : ''
  const src = new URL(`../../assets/sidebar/${option.icon}${suffix}.webp`, import.meta.url).href
  return h('img', { src, style: 'width: 20px; height: 20px;' })
}
</script>

<template>
  <div class="sidebar-wrapper" :class="[{ collapsed }]">
    <NMenu
      :collapsed="collapsed"
      :collapsed-width="56"
      :options="menuOptions"
      :default-value="activeKey"
      :render-icon="renderMenuIcon"
      @update:value="handleClick"
    />
    <div class="toggle-btn" @click="$emit('toggleCollapse')">
      <NIcon size="20">
        <img src="@/assets/sidebar/toggle.png" alt="">
      </NIcon>
    </div>
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.3s ease;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 10px;
}
.toggle-btn {
  position: absolute;
  bottom: 1rem;
  right: -10px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}
.toggle-btn:hover {
  transform: scale(1.1);
}
</style>
