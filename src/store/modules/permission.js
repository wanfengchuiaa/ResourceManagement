// vuex的权限模块
import { asyncRoutes, constantRoutes } from '@/router'
// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  filterRoutes(context, mouts) {
    const aaa = asyncRoutes.filter((i) => {
      return mouts.includes(i.name)
    })
    context.commit('setRoutes', aaa)
    return aaa
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
