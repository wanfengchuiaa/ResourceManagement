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
        >
          <template v-slot="{row}">
            <el-avatar
              style="width: 80px;height: 80px"
              :src="row.staffPhoto"
              @click.native="showQrCode(row.staffPhoto)"
            />
          </template>
        </el-table-column>
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
          <template v-slot="{ row }">
            <el-row>
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small" :disabled="addallshow('qwer')">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="showRoleDia(row.id)">角色</el-button>
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

    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <assign-role ref="tankuang" :aid="aid" :show-role-dialog.sync="showRoleDialog" />
  </div>

</template>

<script>

import { getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from '@/views/employees/components/add-employee'
import { formatDate } from '@/filters'
import { getUserDetailById } from '@/api/user'
import QrCode from 'qrcode'
import AssignRole from '@/views/employees/components/assign-role'
import { mixin } from '@/utils/miming'

const headers = {
  '姓名': 'username',
  '手机号': 'mobile',
  '入职日期': 'timeOfEntry',
  '聘用形式': 'formOfEmployment',
  '转正日期': 'correctionTime',
  '工号': 'workNumber',
  '部门': 'departmentName'
}
export default {
  components: { AssignRole, AddEmployee },
  mixins: [mixin],
  data() {
    return {
      showCodeDialog: false,
      showRoleDialog: false,
      aid: '',
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
    async showRoleDia(id) {
      this.aid = id || ''
      await this.$refs.tankuang.getUserDetailById(id)
      this.showRoleDialog = true
    },
    showQrCode(url) {
      // url存在的情况下 才弹出层
      this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
      // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
      this.$nextTick(() => {
        // 此时可以确认已经有ref对象了
        QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
        // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
      })
    },
    async asasd() {
      const { export_json_to_excel } = await import('@/utils/Export2Excel')
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      const fromdata = this.fromdataaa(rows, headers)
      export_json_to_excel({
        header: Object.keys(headers), // 表头 必填
        data: fromdata, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    fromdataaa(row, headers) {
      return row.map(key => {
        return Object.keys(headers).map(item => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[item])) {
            return formatDate(key[headers[item]])
          }
          if (['formOfEmployment'].includes(headers[item])) {
            return EmployeeEnum.hireType.find(i => i.id === key[headers[item]])?.value || '未知'
          }
          return key[headers[item]]
        })
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

