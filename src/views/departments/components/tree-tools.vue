<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager

import { delDepartments } from '@/api/departments'

export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    // 定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true,
      default: () => ({})// 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {

    async handleCommand(type) {
      if (type === 'add') {
        this.$emit('checkaddLayerThickn', this.treeNode)
      } else if (type === 'edit') {
        this.$emit('checkemidLayerThickn')
        this.$emit('editDepts', this.treeNode.id)
      } else {
        try {
          await this.$confirm('此操作将删除该部门, 是否继续?', '提示')
          await this.delDepartments(this.treeNode.id)
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        } catch (error) {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      }
    }
  }
}
</script>

