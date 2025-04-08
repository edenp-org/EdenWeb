// src/utils/token.ts
export function getTokenFromLocalStorage(): string | null {
  return localStorage.getItem('token')
}

export function setTokenToLocalStorage(token: string): void {
  localStorage.setItem('token', token)
}

export function removeToken(): void {
  localStorage.removeItem('token')
}
