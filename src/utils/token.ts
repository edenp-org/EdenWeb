// utils/token.ts

export function setTokenToLocalStorage(token: string): void {
  try {
    localStorage.setItem('auth_token', token)
  }
  catch (error) {
    console.error('localStorage 存储 token 出错:', error)
    // 可以进一步通过消息提醒用户存储失败，或者记录到日志系统
  }
}

export function getTokenFromLocalStorage(): string | null {
  try {
    return localStorage.getItem('auth_token')
  }
  catch (error) {
    console.error('localStorage 获取 token 出错:', error)
    return null
  }
}

export function removeToken(): void {
  try {
    localStorage.removeItem('auth_token')
  }
  catch (error) {
    console.error('localStorage 删除 token 出错:', error)
  }
}
