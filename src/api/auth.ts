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