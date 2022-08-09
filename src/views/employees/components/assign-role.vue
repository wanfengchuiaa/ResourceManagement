<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="close">

    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 选项 -->

    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    aid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checkList: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    close() {
      this.checkList = []
      this.$emit('update:showRoleDialog', false)
    },
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
    },
    async btnOK() {
      try {
        await assignRoles({ id: this.aid, roleIds: this.checkList })
        this.$message.success('分配成功')
        this.close()
      } catch (e) {
        this.$message.success('分配失败')
        this.close()
      }
    }
  }
}

</script>
