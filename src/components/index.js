import TooBar from '../components/PageTools/index'
import UploadExcel from './UploadExcel/index'
import ImageUpload from './ImageUpload/index'

export default {
  install(Vue) {
    Vue.component(TooBar.name, TooBar)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
  }
}
