<template>
  <el-dialog :title="showtitle" :visible="isshowaddLayerThickness" @close="clone">
    <el-form ref="form1" label-width="120px" :rules="rules" :model="formData">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="isshowaddLayerThickness= false">取消</el-button>
      <el-button size="small" type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>

import { addDepartments, getDepartDetail, getDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    isshowaddLayerThickness: {
      type: Boolean,
      default: false
    },
    ClickOnObject: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async(rules, value) => {
      // 1、 接口获取所有的部门
      const { depts } = await getDepartments()
      let currentNodeChilren = null
      // 2、找到当前点击的部门的所有子部门
      if (this.formData.id) {
        currentNodeChilren = depts.filter(item => {
          return item.pid === this.ClickOnObject.pid && item.id !== this.ClickOnObject.id
        })
      } else {
        currentNodeChilren = depts.filter(item => item.pid === this.ClickOnObject.id)
      }
      // 3、判断当前部门的所有子部门名称是否包含用户输入的部门名称
      const isRepeat = currentNodeChilren.some(item => item.name === value)
      // 4、如果包含说明名称重复
      if (isRepeat) {
        return Promise.reject(new Error('部门名称重复'))
      }
      // --> 核心逻辑：用户输入的部门名称跟当前点击的部门的所有的子部门的名称不能重复
    }
    const checkCode = async(rules, value) => {
      // 1、 接口获取所有的部门
      const { depts } = await getDepartments()
      //  2、直接判断当前用户添写的code是否包含在已存在的数据里面

      const isRepeat = depts.some(item => {
        if (item.code !== this.ClickOnObject.code) {
        } else {
          return item.code === value
        }
      })
      if (isRepeat) {
        return Promise.reject('部门code重复')
      }
      // --> 核心逻辑：用户输入的部门code跟任何部门的code都不能重复
    }
    return {
      options: [],
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, {
            validator: checkName,
            trigger: 'blur'
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
            validator: checkCode,
            trigger: 'blur'
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: {
    showtitle() {
      return this.formData.id ? '修改' : '新增'
    }
  },
  methods: {
    async getnyid(id) {
      this.formData = await getDepartDetail(id)
    },
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple()
    },
    async submit() {
      await this.$refs.form1.validate()
      if (this.formData.id) {
        await updateDepartments(this.formData)
      } else {
        await addDepartments({ ...this.formData, pid: this.ClickOnObject.id })
      }
      this.$message.success(`${this.showtitle}成功`)
      this.$emit('getDepartments')
      this.clone()
    },
    clone() {
      this.$emit('update:isshowaddLayerThickness', false)
      this.$refs.form1.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    }
  }
}
</script>
