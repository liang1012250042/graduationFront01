<!--推送管理-->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>垃圾类型管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 70px">

    </div>
    <!--列表-->
    <el-table
      border
      style="width: 100%"
      @selection-change="GarbageTypesInfo()"
      :data="garbageTypes"
      size="medium">
      <el-table-column
        prop="id"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="garbageTypeName"
        label="垃圾类型">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "garbageTypeManagement",
  data() {
    return {
      initPageSize: 1,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载,
      title: '添加推送人信息',
      editFormVisible: false, //控制编辑页面显示与隐藏
      garbageTypes: []//编辑或者添加页面的数据
    }
  },
  created() {
    this.GarbageTypesInfo(this.pageSize, this.pageNum);
  },
  methods: {
    GarbageTypesInfo() {
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/type/pageTypeInfo").then(res => {
        this.garbageTypes = res.data.data;
        console.log(this.garbageTypes);
      })
    },
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>
