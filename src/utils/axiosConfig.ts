import axios from 'axios'

// 全局 baseURL 设置
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://47.76.72.104'

// 必须开启，允许携带cookie进行跨域请求
axios.defaults.withCredentials = true

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 无需再从store获取token，自动携带Cookie
    return config
  },
  error => Promise.reject(error),
)

// 响应拦截器
axios.interceptors.response.use(
  response => response,
  (error) => {
    // 全局错误处理示例：
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 身份过期或未认证，跳转至登录页面或刷新token
          console.warn('未认证或登录已过期，请重新登录！')
          // 可以进行store清空操作或router跳转到登录页
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
