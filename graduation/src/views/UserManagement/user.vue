<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>普通用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
<!--    <div class="block">-->
<!--      <span class="demonstration">创建时间</span>-->
<!--      <el-date-picker-->
<!--        v-model="date"-->
<!--        type="daterange"-->
<!--        range-separator="至"-->
<!--        start-placeholder="开始日期"-->
<!--        end-placeholder="结束日期">-->
<!--      </el-date-picker>-->
<!--    </div>-->
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
        <el-input size="small" placeholder="输入用户名" v-model="search.userName" @change="searchUsers()" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" placeholder="输入手机号" v-model="search.userPhone" @change="searchUsers()" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchUsers()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-search" @click="exportUsers()">导出</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      border
      style="width: 100%"
      @selection-change="pageInfoUser(this.pageSize,this.pageNum)"
      :data="pageInfoUsers.list"
      size="medium">
      <el-table-column
        prop="userName"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="userEmail"
        label="邮箱">
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
          <el-button type="text" size="small" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.pageInfoUsers.total"
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
        <el-form label-width="80px" ref="editForm" :model="this.user" :rules="rules">
          <el-form-item label="用户名" prop="userName">
            <el-input size="small" v-model="user.userName" auto-complete="off" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="userPhone">
            <el-input size="small" v-model="user.userPhone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
            <el-input size="small" v-model="user.userEmail" placeholder="请输入邮箱地址"></el-input>
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
  name: "user",
  data(){
    return{
      initPageSize:1,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载,
      title: '添加用户',
      editFormVisible: false, //控制编辑页面显示与隐藏
      date:[],
      user:{//编辑或者添加页面的数据
        id:'',
        userName:'',
        userPhone:'',
        userEmail:'',
      },
      search:{
        userName:'',
        userPhone:'',
      },
      pageInfoUsers: [],
      pageSize: 8,
      pageNum: 1,
      // rules表单验证
      closeDialog(dialog) {
        if (dialog == 'edit') {
          this.editFormVisible = false
        }
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1(3\d|47|5((?!4)\d)|7(0|1|[6-8])|8\d)\d{8,8}$/,
            required: true,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        userEmail: [
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
    this.pageInfoUser(this.pageSize,this.pageNum);
  },
  methods:{
    exportUsers(){
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('userName',this.search.userName);
      param.append('userPhone',this.search.userPhone);
      this.$http.post("http://127.0.0.1:8205/userExcel/userExcelExport",param).then(res=>{
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
    pageInfoUser(pageSize,pageNum){
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('userName',this.search.userName);
      param.append('userPhone',this.search.userPhone);
      param.append('pageSize',pageSize);
      param.append('pageNum',pageNum);
      this.$http.post("http://localhost:8106/user/pageInfoUser",param).then(res=>{
        this.pageInfoUsers=res.data.data;
      })
    },
    addUser(){
      var param=new FormData();
      if(this.user.userName!=''){
        param.append('userName',this.user.userName);
      }
      if(this.user.userPhone!=''){
        param.append('userPhone',this.user.userPhone);
      }
      if(this.user.userEmail!=''){
        param.append('userEmail',this.user.userEmail);
      }
      this.$http.post("http://localhost:8106/user/addUser",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchUsers();
        }else{
          this.open2(res.data.msg);
          this.searchUsers();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    updateUser(){
      var param=new FormData();
      param.append('id',this.user.id);
      if(this.user.userName!=''){
        param.append('userName',this.user.userName);
      }
      if(this.user.userPhone!=''){
        param.append('userPhone',this.user.userPhone);
      }
      if(this.user.userEmail!=''){
        param.append('userEmail',this.user.userEmail);
      }
      this.$http.post("http://localhost:8106/user/updateUser",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchUsers();
        }else{
          this.open2(res.data.msg);
          this.searchUsers();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    prevClick(page){
      this.pageNum=page;
      this.pageInfoUser(this.pageSize,page);
    },
    nextClick(page){
      this.pageNum=page;
      this.pageInfoUser(this.pageSize,page);
    },
    currentChange(page){
      this.pageNum=page;
      this.pageInfoUser(this.pageSize,page);
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改用户'
        this.user.id=row.id
        this.user.userName = row.userName
        this.user.userPhone = row.userPhone
        this.user.userEmail = row.userEmail
      } else {
        this.title = '添加用户'
        this.user.userName = ''
        this.user.userPhone = ''
        this.user.userEmail = ''
      }
    },
    submitForm() {//编辑添加方法
      if(this.title=='添加用户'){
        this.addUser();
      }else{
        this.updateUser();
      }
    },
    deleteUser(index, row){
      var param=new FormData();
      param.append('userIds',row.id)
      this.$http.post("http://localhost:8106/user/deleteUsers",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchUsers();
        }else{
          this.open2(res.data.msg);
        }
      },error=>{
        this.open2();
      })
    },
    searchUsers(){
      this.pageNum=1;
      var param = new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('userName',this.search.userName);
      param.append('userPhone',this.search.userPhone);
      param.append('pageSize',this.pageSize);
      param.append('pageNum',this.pageNum);
      this.$http.post("http://localhost:8106/user/pageInfoUser",param).then(res=>{
        if(res.data.code==1000){
          this.pageInfoUsers=res.data.data;
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
