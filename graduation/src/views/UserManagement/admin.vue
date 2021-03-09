<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" class="user-search">
      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期"
          value-format="yyyy-MM-dd"
          style="vertical-align: top;width: 380px;height: 32px;margin-top: 5px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" placeholder="输入用户名" v-model="search.adminName" @change="searchAdmins()" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" placeholder="输入手机号" v-model="search.adminPhone" @change="searchAdmins()" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchAdmins()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-search" @click="exportAdmins()">导出</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      border
      style="width: 100%"
      @selection-change="pageInfoAdmin(this.pageSize,this.pageNum)"
      :data="pageInfoAdmins.list"
      size="medium">
      <el-table-column
        prop="adminName"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="adminPhone"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="adminEmail"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="adminPassword"
        label="登录密码">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteAdmin(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.pageInfoAdmins.total"
        style="float: right;height: 5px;margin-top: 20px;margin-right: 40px"
        :page-size="this.pageSize"
        @prev-click="prevClick"
        @next-click="nextClick"
        @current-change="currentChange"
        :current-page.sync="this.pageNum"
      >
      </el-pagination>
    </div>
    <div>
      <!-- 编辑界面 -->
      <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
        <el-form label-width="80px" ref="editForm" :model="this.admin" :rules="rules">
          <el-form-item label="用户名" prop="adminName">
            <el-input size="small" v-model="admin.adminName" auto-complete="off" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="adminPhone">
            <el-input size="small" v-model="admin.adminPhone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="adminPassword">
            <el-input size="small" v-model="admin.adminPassword" placeholder="登录密码"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="adminEmail">
            <el-input size="small" v-model="admin.adminEmail" placeholder="请输入邮箱地址"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
          <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "admin",
  data(){
    return{
      initPageSize:1,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载,
      title: '添加用户',
      editFormVisible: false, //控制编辑页面显示与隐藏
      date:[],
      admin:{//编辑或者添加页面的数据
        id:'',
        adminName:'',
        adminPhone:'',
        adminEmail:'',
        adminPassword:''
      },
      search:{
        adminName:'',
        adminPhone:''
      },
      pageInfoAdmins: [],
      pageSize: 8,
      pageNum: 1,
      // rules表单验证
      closeDialog(dialog) {
        if (dialog == 'edit') {
          this.editFormVisible = false
        }
      },
      rules: {
        adminName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        adminPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1(3\d|47|5((?!4)\d)|7(0|1|[6-8])|8\d)\d{8,8}$/,
            required: true,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        adminPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        adminEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            required: true,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
      },
    }
  },
  created() {
    this.pageInfoAdmin(this.pageSize,this.pageNum);
  },
  methods:{
    exportAdmins(){
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('adminName',this.search.adminName);
      param.append('adminPhone',this.search.adminPhone);
      this.$http.post("http://127.0.0.1:8205/adminExcel/adminExcelExport",param).then(res=>{
        this.open1(res.data.msg)
      })
    },
    open1(info){
      this.$notify({
        title: '成功',
        message: info,
        type: 'success'
      });
    },
    open2(info){
      this.$notify.error({
        title: '失败',
        message: info
      });
    },
    pageInfoAdmin(pageSize,pageNum){
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('adminName',this.search.adminName);
      param.append('adminPhone',this.search.adminPhone);
      param.append('pageSize',pageSize);
      param.append('pageNum',pageNum);
      this.$http.post("http://127.0.0.1:8305/admin/pageInfoAdmin",param).then(res=>{
        this.pageInfoAdmins=res.data.data;
      })
    },
    addAdmin(){
      var param=new FormData();
      if(this.admin.adminName!=''){
        param.append('adminName',this.admin.adminName);
      }
      if(this.admin.adminPhone!=''){
        param.append('adminPhone',this.admin.adminPhone);
      }
      if(this.admin.adminEmail!=''){
        param.append('adminEmail',this.admin.adminEmail);
      }
      if(this.admin.adminPassword!=''){
        param.append('adminPassword',this.admin.adminPassword);
      }
      this.$http.post("http://127.0.0.1:8305/admin/addAdmin",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchAdmins();
        }else{
          this.open2(res.data.msg);
          this.searchAdmins();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    updateAdmin(){
      var param=new FormData();
      param.append('id',this.admin.id);
      if(this.admin.adminName!=''){
        param.append('adminName',this.admin.adminName);
      }
      if(this.admin.adminPhone!=''){
        param.append('adminPhone',this.admin.adminPhone);
      }
      if(this.admin.adminEmail!=''){
        param.append('adminEmail',this.admin.adminEmail);
      }
      if(this.admin.adminPassword!=''){
        param.append('adminPassword',this.admin.adminPassword);
      }
      this.$http.post("http://127.0.0.1:8305/admin/updateAdmin",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchAdmins();
        }else{
          this.open2(res.data.msg);
          this.searchAdmins();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    prevClick(page){
      this.pageNum=page;
      this.pageInfoAdmin(this.pageSize,page);
    },
    nextClick(page){
      this.pageNum=page;
      this.pageInfoAdmin(this.pageSize,page);
    },
    currentChange(page){
      this.pageNum=page;
      this.pageInfoAdmin(this.pageSize,page);
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改管理员'
        this.admin.id=row.id
        this.admin.adminName = row.adminName
        this.admin.adminPhone = row.adminPhone
        this.admin.adminEmail = row.adminEmail
        this.admin.adminPassword=row.adminPassword
      } else {
        this.title = '添加管理员'
        this.admin.adminName = ''
        this.admin.adminPhone = ''
        this.admin.adminEmail = ''
        this.admin.adminPassword=''
      }
    },
    submitForm() {//编辑添加方法
      if(this.title=='添加管理员'){
        this.addAdmin();
      }else{
        this.updateAdmin();
      }
    },
    deleteAdmin(index, row){
      var param=new FormData();
      param.append('adminIds',row.id)
      this.$http.post("http://127.0.0.1:8305/admin/deleteAdmins",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchAdmins();
        }else{
          this.open2(res.data.msg);
        }
      },error=>{
        this.open2();
      })
    },
    searchAdmins(){
      this.pageNum=1;
      var param = new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('adminName',this.search.adminName);
      param.append('adminPhone',this.search.adminPhone);
      param.append('pageSize',this.pageSize);
      param.append('pageNum',this.pageNum);
      this.$http.post("http://127.0.0.1:8305/admin/pageInfoAdmin",param).then(res=>{
        if(res.data.code==1000){
          this.pageInfoAdmins=res.data.data;
        }
      })
    }
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
