// src/utils/security.ts

/**
 * 邮箱脱敏
 * 示例: a****b@example.com
 */
export function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (user.length <= 2) {
    return `${user[0]}****@${domain}`
  }
  return `${user[0]}****${user.slice(-1)}@${domain}`
}
