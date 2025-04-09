// src/utils/axiosConfig.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// 设置全局 baseURL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://47.76.72.104'

axios.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理 401、404 等状态码
    return Promise.reject(error)
  }
)

export default axios
