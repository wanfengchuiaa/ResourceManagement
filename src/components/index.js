import TooBar from '../components/PageTools/index'
import UploadExcel from './UploadExcel/index'

export default {
  install(Vue) {
    Vue.component(TooBar.name, TooBar)
    Vue.component(UploadExcel.name, UploadExcel)
  }
}
