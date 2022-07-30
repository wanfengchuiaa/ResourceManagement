<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="角色管理" name="first">
        <el-card style="padding: 20px">
          <el-button type="success" icon="el-icon-plus" size="medium" @click="showdiable=true">角色管理</el-button>
          <el-table
            :data="list"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="180"
            />
            <el-table-column
              prop="name"
              label="角色名称"
              width="180"
            />
            <el-table-column
              prop="description"
              label="描述"
            />
            <el-table-column
              prop="address"
              label="操作"
            >
              <template v-slot="{row}">
                <el-button type="success" size="medium">分配权限</el-button>
                <el-button type="primary" size="medium" @click="emid(row.id)">编辑</el-button>
                <el-button type="danger" size="medium" @click="del(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 40px" type="flex" justify="center">
            <el-pagination
              :current-page="page.page"
              :page-sizes="[1, 2, 3, 4]"
              :page-size="page.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="公司设置" name="second">
        <el-alert
          title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
          type="info"
          show-icon
          :closable="false"
        />
        <el-form label-width="120px" style="margin-top:50px">
          <el-form-item label="公司名称">
            <el-input v-model="formData.name" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input v-model="formData.companyAddress" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formData.mailbox" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

    </el-tabs>
    <el-dialog :visible="showdiable" :title="`${this.rowFormdata.id?'编辑':'新增'}角色`" @close="close">
      <el-form ref="rowref" :model="rowFormdata" label-width="100px">
        <el-form-item
          label="角色"
          prop="name"
          :rules="{ required: true, message: '角色名称不能为空', trigger: 'blur' }"
        >
          <el-input v-model="rowFormdata.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="rowFormdata.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="btnok">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, deleteRole, getCompanyInfo, getRoleDetail, getRoleList, updateRole } from '@/api/setting'

export default {
  data() {
    return {
      rowFormdata: {
        description: '',
        name: ''
      },
      showdiable: false,
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 3,
        total: 0 // 记录总数
      },
      list: [],
      formData: {},
      activeName: 'second'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async btnok() {
      await this.$refs.rowref.validate()
      if (this.rowFormdata.id) {
        await updateRole(this.rowFormdata)
        this.$message.success('修改成功')
      } else {
        await addRole(this.rowFormdata)
        this.$message.success('操作成功')
      }
      await this.getRoleList()
      this.close()
    },
    close() {
      this.showdiable = false
      this.$refs.rowref.resetFields()
      this.rowFormdata = {
        description: '',
        name: ''
      }
    },
    async emid(id) {
      this.showdiable = true
      const res = await getRoleDetail(id)
      this.rowFormdata = res
    },
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
    },
    handleSizeChange(val) {
      this.page.pagesize = val
      this.getRoleList()
    },
    handleCurrentChange(val) {
      this.page.page = val
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.companyId)
    },
    async del(i) {
      try {
        await this.$confirm('确认删除')
        const len = this.list.length
        await deleteRole(i)
        if (len === 1 && this.page.page !== 1) {
          this.page.page--
        }
        await this.getRoleList()
        await this.$message.success('删除成功')
      } catch (e) {
        await this.$message.error('取消删除')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
}
</style>

