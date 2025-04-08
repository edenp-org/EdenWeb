import type { UserModule } from './types'

import { setupLayouts } from 'virtual:generated-layouts'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import naive from 'naive-ui'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
import 'vfonts/Lato.css'


// https://github.com/antfu/vite-ssga
export const createApp = ViteSSG(
  App,
  {
    routes: setupLayouts(routes),
    base: import.meta.env.BASE_URL,
  },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
    ctx.app.use(naive)
  },
)
