import store from '@/store'

export const mixin = {
  methods: {
    addallshow(key) {
      return !store.state.user.userInfo.roles.points.includes(key)
    }
  }
}
