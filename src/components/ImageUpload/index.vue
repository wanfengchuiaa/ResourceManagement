<template>

  <div>
    <el-upload
      action="#"
      :http-request="updataa"
      list-type="picture-card"
      :before-upload="beforeupload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="onchange"
      :file-list.sync="list"
      :limit="1"
      :class="{coms:lennum}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-progress v-if="showprogress" style="width: 200px" :percentage="percentage" />
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDKVSAdsseDYhbLn10lIchX7Rjma8QVMzP',
  SecretKey: 'FG2ZrvkLivvgCTWKxLVS9bqqb7OQEpCL'
})
export default {
  data() {
    return {
      showprogress: false,
      percentage: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      list: [{
        url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F11%2F20210711201715_a0d66.thumb.1000_0.webp&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662273471&t=74b9aac0060ef65cd24665d228fbc868'
      }]
    }
  },
  computed: {
    lennum() {
      return this.list.length === 1
    }
  },
  methods: {
    updataa({ file }) {
      if (file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'wanfengchui-1313213476', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: file.name, // 文件名
          Body: file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          onProgress: ({ percent }) => {
            this.percentage = percent * 100
          }
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          if (err) {
            return this.$message.error(err?.message || '图片上传失败')
          }
          this.list.forEach(item => {
            if (item.uid === file.uid) {
              item.url = `http://${data.Location}`
              item.aa = true
            }
          })

          setTimeout(() => {
            this.showprogress = false
            this.percentage = 0
          }, 2000)
        })
      }
    },
    beforeupload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024 // 1M=1024KB 1KB = 1024B
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.showprogress = true
      return true
    },
    onchange(file, fileList) {
      this.list = fileList
    },
    handleRemove(file, fileList) {
      this.list = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style scoped lang="scss">
.coms {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
