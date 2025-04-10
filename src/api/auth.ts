// src/api/auth.ts
import axios from '@/utils/axiosConfig'

export interface CaptchaResponse {
  captchaID: string
  base64: string
}

/**
 * 获取图形验证码接口
 * GET /Captcha/Captcha
 * 返回数据格式：{ status, data: { captchaID, base64 } }
 */
export async function getCaptcha(): Promise<CaptchaResponse> {
  const res = await axios.get('/Captcha/Captcha')
  if (res.data.status === 200) {
    return res.data.data
  } else {
    throw new Error('获取图形验证码失败，请重试')
  }
}

/**
 * 发送邮箱验证码接口
 * POST /User/SendEmailVerificationCode
 * 请求体参数： { Data: { email, captchaId, captchaInput } }
 * 返回示例格式：{ status, message }
 */
export async function sendEmailVerificationCode(payload: {
  email: string
  captchaId: string
  captchaInput: string
}): Promise<{ status: number; message: string }> {
  const res = await axios.post('/User/SendEmailVerificationCode', { Data: payload })
  return res.data
}

/**
 * 用户登录接口
 * POST /User/Login
 * 请求体格式：
 * {
 *   Data: {
 *     password: string,         // 密码
 *     captchaId: string,        // 图像验证码ID
 *     captchaInput: string,     // 用户输入的图形验证码
 *     uname: string,            // 用户名（仅传此项时，email 必须为空或不传）
 *     email: string             // 邮箱（仅传此项时，uname 必须为空或不传）
 *   }
 * }
 *
 * 说明：uname 与 email 是互斥的，只能传一个。
 */

/** 联合类型：要么传 uname（username 登录），要么传 email（邮箱登录） */
export type LoginPayload = {
  password: string
  captchaId: string
  captchaInput: string
} & (
  | { uname: string; email?: never }
  | { email: string; uname?: never }
)

/** 登录接口返回结构 */
export interface LoginResponse {
  status: number
  message: string
  token?: string
  data?: {
    token?: string
    // 补充其他字段
  }
}

export async function userLogin(payload: LoginPayload): Promise<LoginResponse> {
  const res = await axios.post('/User/Login', { data: payload })
  return res.data
}

/**
 * 用户注册接口
 * POST /User/Register
 * 请求体格式：
 * {
 *   Data: {
 *     email: string,          // 注册邮件
 *     uname: string,          // 用户名
 *     password: string,       // 用户密码
 *     passwordSecond: string, // 确认密码
 *     captcha: string         // 邮箱验证码
 *   }
 * }
 */
export async function userRegister(payload: {
  email: string
  uname: string
  password: string
  passwordSecond: string
  captcha: string
}): Promise<{ status: number; message: string }> {
  const res = await axios.post('/User/Register', { data: payload })
  return res.data
}
