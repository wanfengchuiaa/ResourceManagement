export const imgError = {
  inserted(el, options) {
    console.log(options)
    el.onerror = function() {
      el.src = options.value
    }
  }
}
