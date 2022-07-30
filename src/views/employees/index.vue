<template>
  <div class="dashboard-container">

    <div class="app-container">
      <TooBar>
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('import')">导入</el-button>
          <el-button size="small" type="danger" @click="asasd">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </TooBar>

    </div>
    <el-card style="padding: 20px;margin: 0 20px 0">
      <el-table
        :data="list"
        stripe
        border
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
        />
        <el-table-column
          prop="username"
          label="姓名"
          width="100"
        />
        <el-table-column
          prop="staffPhoto"
          label="头像"
        />
        <el-table-column
          prop="workNumber"
          label="公号"
        />
        <el-table-column
          prop="formOfEmployment"
          label="聘用形式"
          :formatter="formatter"
        />
        <el-table-column
          prop="departmentName"
          label="部门名称"
        />
        <el-table-column
          prop="timeOfEntry"
          label="入职时间"
        >
          <template v-slot="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="账户状态"
          prop="formOfEmployment"
        >
          <template v-slot="">
            <el-switch
              :v-model="false"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>

        </el-table-column>
        <el-table-column
          label="操作"
          width="400"
        >
          <template>
            <el-row>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          :current-page="page.page"
          :page-sizes="[1, 3, 5, 10]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <add-employee :show-dialog.sync="showDialog" />
  </div>

</template>

<script>

import { getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from '@/views/employees/components/add-employee'

export default {
  components: { AddEmployee },
  data() {
    return {
      list: [],
      showDialog: false,
      page: {
        page: 1, // 当前页码
        size: 10
      },
      total: 0 // 总数
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async asasd() {
      const tHeader = ['111', '222']
      const { export_json_to_excel } = await import('@/utils/Export2Excel')

      export_json_to_excel({
        header: tHeader, // 表头 必填
        data: [['22', '11'], ['22', '11']], // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    async getEmployeeList() {
      const { total, rows } = await getEmployeeList(this.page)
      this.total = total
      this.list = rows
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getEmployeeList()
    },
    handleCurrentChange(val) {
      this.page.page = val
      this.getEmployeeList()
    },
    formatter(row, column, cellvalue) {
      const name = EmployeeEnum.hireType.find(item => item.id === cellvalue)?.value
      return name || '位置'
    }
  }

}
</script>

<style>

</style>

