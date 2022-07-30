<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tools
          :is-root="false"
          :tree-node="company"
          @checkaddLayerThickn="checkaddLayerThickn"
          @delDepts="getDepartments"
        />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->

      </el-card>
      <el-tree :data="departs" :props="defaultProps" default-expand-all>
        <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
        <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
        <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
        <template v-slot="{ data }">
          <tree-tools
            :is-root="true"
            :tree-node="data"
            @checkaddLayerThickn="checkaddLayerThickn"
            @delDepts="getDepartments"
            @checkemidLayerThickn="checkemidLayerThickn"
            @editDepts="editDepts"
          />
        </template>

      </el-tree>
    </div>
    <add-dept
      ref="addd"
      :isshowadd-layer-thickness.sync="isshowaddLayerThickness"
      :click-on-object="ClickOnObject"
      @getDepartments="getDepartments"
    />
  </div>
</template>

<script>
import TreeTools from '@/views/departments/components/tree-tools'
import { getDepartments } from '@/api/departments'
import { transTree } from '@/utils'
import AddDept from '@/views/departments/components/add-dept'

export default {
  components: { AddDept, TreeTools },
  data() {
    return {
      isshowaddLayerThickness: false,
      ClickOnObject: {},
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      defaultProps: {
        label: 'name'
      },
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }]
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    editDepts(id) {
      this.$refs.addd.getnyid(id)
    },
    checkaddLayerThickn(obj) {
      this.isshowaddLayerThickness = true
      this.ClickOnObject = obj
    },
    checkemidLayerThickn(obj) {
      this.isshowaddLayerThickness = true
      this.ClickOnObject = obj
    },
    async getDepartments() {
      const res = await getDepartments()
      console.log(res)
      this.company = {
        name: res.companyName,
        manager: res.companyManage || '管理员',
        id: ''
      }
      this.departs = transTree(res.depts, '')
    }
  }

}
</script>

<style scoped lang="scss">
.app-container {
  width: 850px;
  border: 1px solid #ccc;
  margin: 30px auto;

  .tree-card {
    background-color: #4878fb;
  }
}
</style>

