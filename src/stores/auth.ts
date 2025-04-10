// src/stores/auth.ts
import { defineStore } from 'pinia'
import { getTokenFromLocalStorage, setTokenToLocalStorage, removeToken } from '@/utils/token'

export interface UserInfo {
  id: number
  username: string
  avatarUrl?: string
  // 补充其他字段
}

export interface AuthResponse {
  code: number
  message: string
  data: {
    token: string
    userInfo: UserInfo
  }
}

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: getTokenFromLocalStorage(),
    userInfo: null as UserInfo | null
  }),
  actions: {
    /**
     * 设置登录信息
     * 调用该方法时，组件可将 API 请求返回的认证数据（如 token 与用户信息）传入 store，
     * store 内部只负责保存状态，并持久化 token
     */
    setAuthData(data: AuthResponse['data']) {
      this.token = data.token
      setTokenToLocalStorage(data.token)
      this.userInfo = data.userInfo
    },
    /**
     * 清除登录状态
     */
    clearAuthData() {
      this.token = null
      this.userInfo = null
      removeToken()
    }
  }
})
