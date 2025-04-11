// 验证邮箱
export function validateEmail(email: string): string | null {
  if (!email.trim())
    return '邮箱不能为空'
  if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email))
    return '邮箱格式不正确'
  return null
}

// 验证用户名
export function validateUsername(username: string): string | null {
  if (!username.trim())
    return '用户名不能为空'
  if (username.length < 3 || username.length > 20)
    return '用户名长度应在3-20位之间'
  return null
}

// 验证密码
export function validatePassword(password: string): string | null {
  if (!password.trim())
    return '密码不能为空'
  if (password.length < 6 || password.length > 20)
    return '密码长度应在6-20位之间'
  return null
}

// 验证确认密码
export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (password !== confirm)
    return '两次密码输入不一致'
  return null
}

// 验证验证码
export function validateVerificationCode(code: string): string | null {
  if (!code.trim())
    return '验证码不能为空'
  if (code.length !== 6)
    return '验证码长度应为6位'
  return null
}
