<template>
  <div class="auth-page">
    <div class="anth-inner">
      <!-- 卡片容器：左右滑动 -->
      <div class="card-container" :class="{ 'show-register': !isLogin }">
        <!-- 登录卡片 -->
        <div class="login-box card-panel">
          <div class="top-logo">
            <img src="@/assets/EDEN_LOGO.png" alt="" />
            <div>看见每一种兴趣</div>
          </div>
          <!-- 登录表单 -->
          <n-form @submit.prevent="handleLogin">
            <n-form-item label="邮箱：">
              <n-input
                v-model:value="loginForm.username"
                placeholder=""
                style="height: 2.396vw;"
                @blur="validateLoginEmail"
              />
              <template v-if="loginEmailError">
                <div style="color: red; font-size: 0.729vw; margin-top: 0.2vw">
                  {{ loginEmailError }}
                </div>
              </template>
            </n-form-item>
            <n-form-item label="验证码：" class="verfirycode-inp">
              <n-input
                v-model:value="loginForm.password"
                type="password"
                placeholder=""
                style="height: 2.396vw;"
                :maxlength="7"
              />
              <span
                class="verfirycode-btn"
                @click="handleSendCode"
                :style="{ color: codeDisabled ? '#ccc' : '#C10200', pointerEvents: codeDisabled ? 'none' : 'auto' }"
              >
                {{ codeButtonText }}
              </span>
            </n-form-item>
          </n-form>
          <n-button color="#C10200" round class="p-btn" @click="handleLogin" :loading="loading">
            登录
          </n-button>
          <n-button round strong secondary class="c-btn" @click="toggleForm">
            注册
          </n-button>
          <n-checkbox class="else-btn" v-model:checked="agreed">
            我已阅读并同意
            <span @click="showAgreementModal = true">《Eden用户协议与隐私》</span>
          </n-checkbox>
        </div>
        <!-- 注册卡片 -->
        <div class="register-box card-panel">
          <div class="register-inner">
            <div class="register-title">注册账号</div>
            <n-form @submit.prevent="handleRegister">
              <n-form-item label="用户名">
                <n-input
                  v-model:value="registerForm.username"
                  placeholder=""
                  style="height: 2.396vw;"
                />
              </n-form-item>
              <n-form-item label="邮箱">
                <n-input
                  v-model:value="registerForm.email"
                  placeholder=""
                  style="height: 2.396vw;"
                  @blur="validateRegisterEmail"
                />
              </n-form-item>
              <n-form-item label="密码">
                <n-input
                  v-model:value="registerForm.password"
                  type="password"
                  placeholder=""
                  style="height: 2.396vw;"
                />
              </n-form-item>
              <n-form-item label="确认密码">
                <n-input
                  v-model:value="registerForm.confirm"
                  type="password"
                  placeholder=""
                  style="height: 2.396vw;"
                  @blur="validateRegisterConfirm"
                />
              </n-form-item>
            </n-form>
            <n-button color="#C10200" round class="p-btn" @click="handleRegister" :loading="loading">
              注册
            </n-button>
            <n-button round strong secondary class="c-btn" @click="toggleForm">
              返回
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户协议弹窗 -->
    <n-modal
      v-model:show="showAgreementModal"
      preset="dialog"
      title="Eden用户协议与隐私"
      style="max-width: 600px"
    >
      <div style="max-height: 300px; overflow-y: auto; padding: 10px;">
        <p>这里是《Eden用户协议与隐私》的内容，你可以在这里放真实内容或从接口加载～</p>
      </div>
    </n-modal>

    <!-- 图形验证码弹窗 -->
    <n-modal
      v-model:show="showCaptchaModal"
      preset="dialog"
      :show-icon="false"
      style="max-width: 400px;"
    >
      <!-- 自定义标题 -->
      <template #header>
        <div class="captcha-header">图形验证码验证</div>
      </template>
      
      <!-- 弹窗主体内容 -->
      <template #default>
        <div class="captcha-body">
          
          <img 
            :src="`data:image/png;base64,${captchaImage}`" 
            alt="图形验证码" 
            class="captcha-image" 
          />
          <div class="captcha-hint">
            为保障您的账户安全，请输入上方图形验证码
          </div>
          <n-input
            v-model:value="captchaInput"
            placeholder=""
            class="captcha-input"
          />
        </div>
      </template>
      
      <!-- 按钮区域，使用 action 插槽 -->
      <template #action>
        <div class="captcha-footer">
          <n-button size="small" @click="cancelCaptcha">取消</n-button>
          <n-button size="small" type="primary" @click="confirmCaptcha" class="p-btn" >确认</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { getCaptcha } from '@/api'

const isLogin = ref(true)
const loading = ref(false)
const codeDisabled = ref(false)
const codeButtonText = ref('获取验证码')
const agreed = ref(false)
const showAgreementModal = ref(false)
const loginEmailError = ref('')

// 图形验证码相关状态
const showCaptchaModal = ref(false)
const captchaImage = ref('')        // 后端返回的 Base64 字符串
const captchaID = ref('')           // 接口返回的验证码ID
const captchaInput = ref('')        // 用户输入的验证码

const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', email: '', password: '', confirm: '' })

const authStore = useAuthStore()
const message = useMessage()
const router = useRouter()

function toggleForm() {
  isLogin.value = !isLogin.value
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateLoginEmail() {
  loginEmailError.value = ''
  if (!isValidEmail(loginForm.value.username)) {
    message.warning('请输入有效的邮箱地址')
  }
}

function validateRegisterEmail() {
  if (!registerForm.value.email.trim()) {
    message.warning('邮箱不能为空')
    return
  }
  if (!isValidEmail(registerForm.value.email)) {
    message.warning('请输入有效的邮箱地址')
  }
}

function validateRegisterConfirm() {
  if (registerForm.value.password.trim() && registerForm.value.confirm.trim()) {
    if (registerForm.value.password !== registerForm.value.confirm) {
      message.warning('两次密码输入不一致')
    }
  }
}

async function handleLogin() {
  if (!loginForm.value.username.trim() || !loginForm.value.password.trim()) {
    message.warning('邮箱和验证码不能为空')
    return
  }
  if (!isValidEmail(loginForm.value.username)) {
    message.warning('请输入有效的邮箱地址')
    return
  }
  if (loginForm.value.password.length !== 7) {
    message.warning('验证码必须是7位数字')
    return
  }
  if (!agreed.value) {
    message.warning('请阅读并勾选《Eden用户协议与隐私》')
    return
  }

  loading.value = true
  try {
    await authStore.login(loginForm.value.username, loginForm.value.password)
    message.success('登录成功')
    router.push('/')
  } catch (error: any) {
    message.error(error.message)
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (
    !registerForm.value.username.trim() ||
    !registerForm.value.email.trim() ||
    !registerForm.value.password.trim() ||
    !registerForm.value.confirm.trim()
  ) {
    message.warning('请填写完整信息，且不要只填写空格')
    return
  }
  if (!isValidEmail(registerForm.value.email)) {
    message.error('请输入有效的邮箱地址')
    return
  }
  if (registerForm.value.password !== registerForm.value.confirm) {
    message.error('两次密码输入不一致')
    return
  }

  loading.value = true
  try {
    await authStore.register({
      username: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password,
      confirm: registerForm.value.confirm
    })
    message.success('注册成功，请登录')
    isLogin.value = true
  } catch (error: any) {
    message.error(error.message)
  } finally {
    loading.value = false
  }
}

// 点击“获取验证码”：先弹出图形验证码弹窗
function handleSendCode() {
  if (codeDisabled.value) return
  if (!isValidEmail(loginForm.value.username)) {
    message.warning('请输入有效的邮箱地址')
    return
  }
  fetchCaptcha()
}

// 调用接口获取图形验证码
async function fetchCaptcha() {
  try {
    console.log('当前的 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
    const data = await getCaptcha()
    captchaID.value = data.captchaID
    captchaImage.value = data.base64
    showCaptchaModal.value = true
  } catch (error) {
    message.error('获取图形验证码出错')
  }
}

// 图形验证码弹窗“确认”
function confirmCaptcha() {
  if (!captchaInput.value.trim()) {
    message.warning('请输入图形验证码')
    return
  }
  // 此处可将 captchaInput 与 captchaID 一并提交后端验证，目前默认验证通过
  showCaptchaModal.value = false
  sendEmailCode()
  captchaInput.value = ''
}

// 图形验证码弹窗“取消”
function cancelCaptcha() {
  showCaptchaModal.value = false
  captchaInput.value = ''
}

// 发送邮箱验证码（倒计时模拟）
function sendEmailCode() {
  codeDisabled.value = true
  let countdown = 60
  codeButtonText.value = `${countdown}s`
  const timer = setInterval(() => {
    countdown--
    codeButtonText.value = `${countdown}s`
    if (countdown === 0) {
      clearInterval(timer)
      codeDisabled.value = false
      codeButtonText.value = '获取验证码'
    }
  }, 1000)
}
</script>

<style scoped lang="less">
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.p-btn {
  background-color: #c10200 !important;
}
/* 外层卡片 */
.anth-inner {
  background-color: #fff;
  width: 25.833vw;
  height: 31.146vw;
  border-radius: 1.25vw;
  padding: 1.042vw 2.5vw;
  position: relative;
  overflow: hidden;

  .card-container {
    display: flex;
    width: 200%;
    height: 100%;
    transition: transform 0.5s ease;
    transform: translateX(0);
  }
  .show-register {
    transform: translateX(-30.8vw);
  }
  .card-panel {
    width: 50%;
    box-sizing: border-box;
  }
  .card-panel:nth-child(2) {
    margin-left: 10vw;
  }
  .n-form {
    width: 100%;
    .n-form-item {
      margin-bottom: 0.781vw;
    }
  }
  .login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  
    .p-btn,
    .c-btn {
      width: 20.833vw;
      height: 2.396vw;
    }
    .else-btn {
      font-size: 0.729vw;
      margin-top: 2.24vw;
      color: #989ba0 !important;
      span {
        color: #c10200;
        cursor: pointer;
      }
    }
    .top-logo {
      img {
        width: 6.979vw;
        height: auto;
      }
      font-size: 0.729vw;
      color: #4e5969;
      font-family: 'Source Han Sans CN-Regular';
      letter-spacing: 0.3vw;
    }
    .verfirycode-inp {
      position: relative;
      cursor: pointer;
      z-index: 99;
      .verfirycode-btn {
        position: absolute;
        font-size: 0.625vw;
        right: 1.042vw;
      }
    }
  }
  .register-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    .register-title {
      font-size: 1.042vw;
      color: #333333;
      text-align: center;
      margin-bottom: 1vw;
    }
    .p-btn,
    .c-btn {
      width: 20.833vw;
      height: 2.396vw;
    }
    .p-btn {
      margin-top: 0.9vw;
      margin-bottom: 0.521vw;
    }
  }
}

/* 图形验证码弹窗样式 */
.captcha-header {
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  padding: 0;
  margin: 0;
}

.captcha-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
}

.captcha-hint {
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #555;
  text-align: center;
}

.captcha-image {
  margin: 0 auto 16px auto;
  max-width: 120px;
  display: block;
}

.captcha-input {
  width: 70%;
  margin-bottom: 8px;
}

.captcha-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 0 16px 16px;

}

</style>
