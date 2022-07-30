<template>
  <upload-e-xcel :on-success="success" />
</template>
<script>
import { importEmployee } from '@/api/employees'

const userRelations = {
  '入职日期': 'timeOfEntry',
  '手机号': 'mobile',
  '姓名': 'username',
  '转正日期': 'correctionTime',
  '工号': 'workNumber'
}
export default {
  methods: {
    async success(args) {
      const arr = args.results.map(item => {
        const obj = {}
        for (const itemk in item) {
          if (['timeOfEntry', 'correctionTime'].includes(userRelations[itemk])) {
            obj[userRelations[itemk]] = new Date(this.formatDate(item[itemk], '/')) // 只有这样, 才能入库
          } else {
            obj[userRelations[itemk]] = item[itemk]
          }
        }
        return obj
      })
      await importEmployee(arr)
      this.$message.success('成功了')
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
