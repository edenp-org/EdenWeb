// src/utils/axiosConfig.ts
import axios from 'axios'

// 判断环境自动设置 baseURL
const isDev = import.meta.env.DEV

axios.defaults.baseURL = isDev
  ? '/api' // 开发环境走代理（Vite 自动转发）
  : import.meta.env.VITE_API_BASE_URL || 'http://47.76.72.104'

// 是否携带 cookie（后端支持才开启）
axios.defaults.withCredentials = false // 可改为 true，看后端是否配置了 allow-credentials

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // token 鉴权，也可以加上 headers
    // config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error),
)

// 响应拦截器
axios.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn('未认证或登录已过期，请重新登录！')
          break
        case 404:
          console.warn('请求的资源不存在！')
          break
        case 500:
          console.error('服务器发生错误！')
          break
        default:
          console.error('未知错误', error.response.data)
      }
    }
    else {
      console.error('网络或跨域异常', error.message)
    }
    return Promise.reject(error)
  },
)

export default axios
