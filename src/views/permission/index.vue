<template>
  <div class="dashboard-container">
    <div class="app-container">
      <too-bar>
        <template #after>
          <el-button size="mini" type="primary" @click="addquanxian('0',1)">添加权限</el-button>
        </template>
      </too-bar>
      <el-table :data="list" border row-key="id">
        <el-table-column label="序号" type="index" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addquanxian(row.id, 2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <el-dialog
      :title="`${title}权限`"
      :visible.sync="dialogVisible"
      width="30%"
      @close="close"
    >

      <el-form ref="formaa" :model="formData" label-width="80px">
        <el-form-item
          label="权限名称"
          prop="name"
          :rules="{ required: true, message: '权限名称不能为空', trigger: 'blur' }"
        >
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="code"
          :rules="{ required: true, message: '权限名称不能为空', trigger: 'blur' }"
        >
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="是否开启">
          <el-switch
            v-model="formData.enVisible"
            inactive-color="red"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="btnok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permisson'
import { transTree } from '@/utils'

export default {
  data() {
    return {
      list: [],
      dialogVisible: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.dialogVisible = true
    },
    async delPermission(id) {
      await this.$confirm('确认删除吗')
      await delPermission(id)
      this.$message.success('删除成功')
      await this.getPermissionList()
    },
    async btnok() {
      await this.$refs.formaa.validate()
      try {
        if (this.formData.id) {
          await updatePermission(this.formData)
        } else {
          await addPermission(this.formData)
        }
        await this.getPermissionList()
        this.$message.success(`${this.title}成功`)
        await this.close()
      } catch (e) {
        this.$message.success(`${this.title}失败`)
        await this.close()
      }
    },
    close() {
      this.dialogVisible = false
      this.$refs.formaa.resetFields()
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
    },
    addquanxian(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.dialogVisible = true
    },
    async getPermissionList() {
      const res = await getPermissionList()
      this.list = transTree(res, '0')
    }
  }

}
</script>

<style>

</style>

