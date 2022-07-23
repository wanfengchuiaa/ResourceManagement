import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { gettime } from '@/utils/auth'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})
const ss = 100000 * 6000

function flag() {
  return Date.now() - gettime() < ss
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = store.getters.token
    if (token) {
      if (flag()) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        Message.error('登录过期,请重新登录')
        store.dispatch('user/logOut')
        router.push('/')
        return Promise.reject('')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use((response) => {
  console.log(response)
  const {
    data: { data, message, success }
  } = response
  if (success) {
    return data
  }
  Message.error(message || '系统错误')
  return Promise.reject(message || '系统错误')
})

export default request
