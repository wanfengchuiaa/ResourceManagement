import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, removeToken, settime, setToken } from '@/utils/auth'
// 状态
const state = {
  token: getToken(),
  userInfo: {}
}
// 修改状态
const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  removeUser(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    const res = await login(data)
    settime()
    context.commit('setToken', res)
  },
  async getUserInfo(context) {
    const res = await getUserInfo()
    // 调用获取图片的接口
    const info = await getUserDetailById(res.userId)
    // 添加到vuex中
    context.commit('setUserInfo', {
      ...res,
      ...info
    })
  },
  logOut(context) {
    context.commit('removeToken')
    context.commit('removeUser')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
