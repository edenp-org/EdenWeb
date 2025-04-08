// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from 'axios'
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
    async login(username: string, password: string) {
      const res = await axios.post<AuthResponse>('/api/login', { username, password })
      if (res.data.code === 200) {
        this.token = res.data.data.token
        setTokenToLocalStorage(res.data.data.token)
        this.userInfo = res.data.data.userInfo
      } else {
        throw new Error(res.data.message)
      }
    },

    async register(data: {
      username: string
      email: string
      password: string
      confirm?: string
    }) {
      const res = await axios.post('/api/register', data)
      if (res.data.code !== 200) {
        throw new Error(res.data.message)
      }
    },

    logout() {
      this.token = null
      this.userInfo = null
      removeToken()
    }
  }
})