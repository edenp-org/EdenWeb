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
            <!-- 邮箱登录模式 -->
            <template v-if="loginType === 'email'">
              <n-form-item label="邮箱：">
                <n-input
                  v-model:value="loginForm.email"
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
              <n-form-item label="密码：">
                <n-input
                  v-model:value="loginForm.emailPassword"
                  type="password"
                  show-password-on="click"
                  placeholder=""
                  style="height: 2.396vw;"
                />
              </n-form-item>
            </template>
            <!-- 用户名登录模式 -->
            <template v-else>
              <n-form-item label="用户名：">
                <n-input
                  v-model:value="loginForm.username"
                  placeholder=""
                  style="height: 2.396vw;"
                />
              </n-form-item>
              <n-form-item label="密码：">
                <n-input
                  v-model:value="loginForm.password"
                  type="password"
                  show-password-on="click"
                  placeholder=""
                  style="height: 2.396vw;"
                />
              </n-form-item>
            </template>
          </n-form>
          <!-- 登录方式切换 -->
          <div class="register-box">
            <div>
              <span>忘记密码？</span>
            </div>
            <div>
              新用户？<span @click="toggleForm">注册</span>
            </div>
          </div>
          <n-button color="#C10200" round class="p-btn" @click="handleLogin" :loading="loading">
            登录
          </n-button>
          <n-divider>
            其他登录方式
          </n-divider>
          <div class="loginway-tab">
            <div 
              class="login-option" 
              :class="{ active: loginType === 'email' }" 
              @click="loginType = 'email'">
              <img src="@/assets/auth/email.png" alt="邮箱">
              邮箱
            </div>
            <n-divider vertical />
            <div 
              class="login-option" 
              :class="{ active: loginType === 'username' }" 
              @click="loginType = 'username'">
              <img src="@/assets/auth/user.png" alt="用户">
              用户
            </div>
          </div>
          <n-checkbox class="else-btn" v-model:checked="agreed">
            我已阅读并同意
            <span @click="showAgreementModal = true">《Eden用户协议与隐私》</span>
          </n-checkbox>
        </div>
        <!-- 注册卡片（保持原有逻辑） -->
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
              <!-- 注册验证码输入框 -->
              <n-form-item label="验证码：" class="verfirycode-inp">
                <n-input
                  v-model:value="registerForm.verificationCode"
                  placeholder=""
                  style="height: 2.396vw;"
                  :maxlength="7"
                />
                <span
                  class="verfirycode-btn"
                  @click="throttledHandleRegisterSendCode"
                  :style="{ color: codeDisabled ? '#ccc' : '#C10200', pointerEvents: codeDisabled ? 'none' : 'auto' }"
                >
                  {{ codeButtonText }}
                </span>
              </n-form-item>
              <n-form-item label="密码">
                <n-input
                  v-model:value="registerForm.password"
                  type="password"
                  show-password-on="click"
                  placeholder=""
                  style="height: 2.396vw;"
                />
              </n-form-item>
              <n-form-item label="确认密码">
                <n-input
                  v-model:value="registerForm.confirm"
                  type="password"
                  show-password-on="click"
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
        <p>这里是《Eden用户协议与隐私》的内容</p>
      </div>
    </n-modal>

    <!-- 图形验证码弹窗 -->
    <n-modal
      v-model:show="showCaptchaModal"
      preset="dialog"
      :show-icon="false"
      style="max-width: 400px;"
      @update:show="handleCaptchaModalUpdate"
    >
      <template #header>
        <div class="captcha-header">图形验证码验证</div>
      </template>
      <template #default>
        <div class="captcha-body">
          <img :src="`data:image/png;base64,${captchaImage}`" alt="图形验证码" class="captcha-image" />
          <div class="captcha-hint">为保障您的账户安全，请输入上方图形验证码</div>
          <n-input v-model:value="captchaInput" placeholder="" class="captcha-input" />
          <div class="refresh-captcha" 
               style="cursor: pointer; color: #C10200; font-size: 0.8rem; margin-top: 0.5rem;"
               @click="fetchCaptcha">
            看不清楚？换一张咯~
          </div>
        </div>
      </template>
      <template #action>
        <div class="captcha-footer">
          <n-button size="small" @click="cancelCaptcha">取消</n-button>
          <n-button size="small" type="primary" @click="throttledConfirmCaptcha" class="p-btn">
            确认
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import throttle from 'lodash/throttle'
import { getCaptcha, sendEmailVerificationCode, userLogin, userRegister } from '@/api/auth'

const isLogin = ref(true)
const loading = ref(false)
const codeDisabled = ref(false)
const codeButtonText = ref('获取验证码')
const agreed = ref(false)
const showAgreementModal = ref(false)
const loginEmailError = ref('')

// 图形验证码相关状态
const showCaptchaModal = ref(false)
const captchaImage = ref('')     // 接口返回的 Base64 字符串
const captchaID = ref('')        // 获取到的图像验证码 ID
const captchaInput = ref('')     // 用户在弹窗中输入的图形验证码
// 用于区分图形验证码触发上下文：'login-email'、'login-username' 或 'register'
const captchaContext = ref('')
// 验证码失败次数和锁定状态
const captchaFailCount = ref(0)
const captchaLocked = ref(false)

// 登录表单
// - 邮箱登录：使用 email, emailPassword, verificationCode（验证码在弹窗中输入）
// - 用户名登录：使用 username 与 password
const loginForm = ref({
  email: '',
  emailPassword: '',
  verificationCode: '',
  username: '',
  password: ''
})

// 注册表单（保持原有逻辑）
const registerForm = ref({
  username: '',
  email: '',
  verificationCode: '',
  password: '',
  confirm: ''
})

// 默认使用用户名登录
const loginType = ref('username')

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
  if (!isValidEmail(loginForm.value.email)) {
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
  if (
    registerForm.value.password.trim() &&
    registerForm.value.confirm.trim() &&
    registerForm.value.password !== registerForm.value.confirm
  ) {
    message.warning('两次密码输入不一致')
  }
}

/** 登录按钮处理逻辑 */
async function handleLogin() {
  if (loginType.value === 'email') {
    if (!loginForm.value.email.trim() || !loginForm.value.emailPassword.trim()) {
      message.warning('邮箱和密码不能为空')
      return
    }
    if (!isValidEmail(loginForm.value.email)) {
      message.warning('请输入有效的邮箱地址')
      return
    }
    if (!agreed.value) {
      message.warning('请阅读并勾选《Eden用户协议与隐私》')
      return
    }
    captchaContext.value = 'login-email'
    fetchCaptcha()
  } else {
    if (!loginForm.value.username.trim() || !loginForm.value.password.trim()) {
      message.warning('用户名和密码不能为空')
      return
    }
    if (!agreed.value) {
      message.warning('请阅读并勾选《Eden用户协议与隐私》')
      return
    }
    captchaContext.value = 'login-username'
    fetchCaptcha()
  }
}

/** 注册：获取验证码按钮处理 */
function handleRegisterSendCode() {
  if (codeDisabled.value) return
  if (!isValidEmail(registerForm.value.email)) {
    message.warning('请输入有效的邮箱地址')
    return
  }
  captchaContext.value = 'register'
  fetchCaptcha()
}

/** 验证码确认处理 */
async function confirmCaptcha() {
  if (captchaLocked.value) {
    message.error('失败太多次请1分钟后再试')
    return
  }
  if (!captchaInput.value.trim()) {
    message.warning('请输入图形验证码')
    return
  }
  try {
    loading.value = true
    let res
    if (captchaContext.value === 'login-email') {
      res = await userLogin({
        email: loginForm.value.email,
        password: loginForm.value.emailPassword,
        captchaId: captchaID.value,
        captchaInput: captchaInput.value
      })
    } else if (captchaContext.value === 'login-username') {
      res = await userLogin({
        uname: loginForm.value.username,
        password: loginForm.value.password,
        captchaId: captchaID.value,
        captchaInput: captchaInput.value
      })
    } else if (captchaContext.value === 'register') {
      res = await sendEmailVerificationCode({
        email: registerForm.value.email,
        captchaId: captchaID.value,
        captchaInput: captchaInput.value
      })
    }

    if (res && res.status === 200) {
      // 根据 captchaContext 分情况处理：
      if (captchaContext.value === 'register') {
        message.success(res.message)
        // 注册流程中不关闭弹窗，而是启动验证码倒计时
        sendEmailCode()
      } else {
        // 登录流程：验证成功立即关闭弹窗，并跳转首页
        message.success('登录成功')
        router.push('/')
        showCaptchaModal.value = false
      }
      // 重置失败计数和验证码输入
      captchaFailCount.value = 0
      captchaInput.value = ''
    } else {
      // 验证失败：累加失败次数并自动刷新验证码，不关闭弹窗
      captchaFailCount.value++
      if (captchaFailCount.value >= 5) {
        captchaLocked.value = true
        message.error('失败太多次请1分钟后再试')
        setTimeout(() => {
          captchaLocked.value = false
          captchaFailCount.value = 0
        }, 60000)
      } else {
        message.error((res && res.message) || (captchaContext.value === 'register' ? '验证码发送失败' : '登录失败'))
      }
      fetchCaptcha()
    }
  } catch (error: any) {
    message.error('请求失败：' + error.message)
  } finally {
    loading.value = false
  }
}


/** 图形验证码弹窗“取消” */
function cancelCaptcha() {
  showCaptchaModal.value = false
  captchaInput.value = ''
}

/** 监听 Modal 显示状态变化，关闭时清空输入框 */
function handleCaptchaModalUpdate(val: boolean) {
  if (!val) {
    cancelCaptcha()
  }
}

// 使用 lodash 的 throttle 包装相关函数（3秒内只响应一次）
const throttledConfirmCaptcha = throttle(confirmCaptcha, 3000, { trailing: false })
const throttledHandleRegisterSendCode = throttle(handleRegisterSendCode, 3000, { trailing: false })

/** 调用接口获取图形验证码 */
async function fetchCaptcha() {
  try {
    const data = await getCaptcha()
    captchaID.value = data.captchaID
    captchaImage.value = data.base64
    showCaptchaModal.value = true
  } catch (error: any) {
    message.error(error.message || '获取图形验证码出错')
  }
}

/** 启动邮箱验证码倒计时（注册流程使用） */
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

/** 注册处理逻辑 */
async function handleRegister() {
  if (
    !registerForm.value.username.trim() ||
    !registerForm.value.email.trim() ||
    !registerForm.value.verificationCode.trim() ||
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
  try {
    loading.value = true
    const res = await userRegister({
      email: registerForm.value.email,
      uname: registerForm.value.username,
      password: registerForm.value.password,
      passwordSecond: registerForm.value.confirm,
      captcha: registerForm.value.verificationCode
    })
    if (res.status === 200) {
      message.success('注册成功，请登录')
      isLogin.value = true
    } else {
      message.error(res.message || '注册失败')
    }
  } catch (error: any) {
    message.error('注册请求失败：' + error.message)
  } finally {
    loading.value = false
  }
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
  /* 高度调高以容纳更多输入项 */
  height: 35vw;
  border-radius: 1.25vw;
  padding: 1.042vw 2.5vw;
  position: relative;
  overflow: hidden;

  //登录盒子
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
  }
  // 注册盒子
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
  //共同样式设置
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
.loginway-tab{
  width: 8.125vw;
  height: 1.875vw;
  border-radius: 10vw;
  border: 1px solid #C9CDD4;
  font-size: .625vw;
  color:#86909C;
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: .781vw;
    margin-right: .3vw;
  }
  div{
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  div:hover{
    color: #c10200;
  }
}
.register-box{
  width: 100%;
  display: flex;
  flex-direction:row !important;
  align-items: flex-start !important;
  justify-content: space-between;
  font-size: .625vw;
  height: 3vw !important;
  span{
    color: #c10200;
    cursor: pointer;
  }
}
</style>
