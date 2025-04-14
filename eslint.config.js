// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  formatters: true,
  ignores: [
    '**/.dockerignore', // 忽略所有 .dockerignore 文件
    'src/assets/**/*.png', // 忽略 src/assets 目录及其所有子目录下的 .png 文件
    'src/assets/**/*.webp', // 忽略 src/assets 目录及其所有子目录下的 .webp 文件
  ],
})
