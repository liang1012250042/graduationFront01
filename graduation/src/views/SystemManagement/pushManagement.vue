<!--推送管理-->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>推送管理</el-breadcrumb-item>
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
        <el-input size="small" placeholder="输入推送人姓名" v-model="search.pushName" @change="searchPushs()" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" placeholder="输入邮箱" v-model="search.pushEmail" @change="searchPushs()" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchPushs()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      border
      style="width: 100%"
      @selection-change="pageInfoPush(this.pageSize,this.pageNum)"
      :data="pageInfoPushs.list"
      size="medium">
      <el-table-column
        prop="pushName"
        label="推送人姓名">
      </el-table-column>
      <el-table-column
        prop="pushEmail"
        label="推送人邮箱">
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
          <el-button type="text" size="small" @click="deletePush(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.pageInfoPushs.total"
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
        <el-form label-width="100px" ref="editForm" :model="this.push" :rules="rules">
          <el-form-item label="推送人姓名" prop="pushName">
            <el-input size="small" v-model="push.pushName" auto-complete="off" placeholder="请输入推送人姓名"></el-input>
          </el-form-item>
          <el-form-item label="推送人邮箱" prop="pushEmail">
            <el-input size="small" v-model="push.pushEmail" placeholder="请输入推送人邮箱地址"></el-input>
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
  name: "pushManagement",
  data(){
    return{
      initPageSize:1,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载,
      title: '添加推送人信息',
      editFormVisible: false, //控制编辑页面显示与隐藏
      date:[],
      push:{//编辑或者添加页面的数据
        id:'',
        pushName:'',
        pushEmail:'',
      },
      search:{
        pushName:'',
        pushEmail:''
      },
      pageInfoPushs: [],
      pageSize: 8,
      pageNum: 1,
      // rules表单验证
      closeDialog(dialog) {
        if (dialog == 'edit') {
          this.editFormVisible = false
        }
      },
      rules: {
        pushName: [
          { required: true, message: '请输入推送人姓名', trigger: 'blur' }
        ],
        pushEmail: [
          { required: true, message: '请输入推送人邮箱', trigger: 'blur' },
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
    this.pageInfoPush(this.pageSize,this.pageNum);
  },
  methods:{
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
    pageInfoPush(pageSize,pageNum){
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('pushName',this.search.pushName);
      param.append('pushEmail',this.search.pushEmail);
      param.append('pageSize',pageSize);
      param.append('pageNum',pageNum);
      this.$http.post("http://127.0.0.1:8305/push/pageInfoPushDetails",param).then(res=>{
        this.pageInfoPushs=res.data.data;
        console.log(this.pageInfoPushs);
      })
    },
    addPush(){
      var param=new FormData();
      if(this.push.pushName!=''){
        param.append('pushName',this.push.pushName);
      }
      if(this.push.pushEmail!=''){
        param.append('pushEmail',this.push.pushEmail);
      }
      this.$http.post("http://127.0.0.1:8305/push/addPushDetails",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchPushs();
        }else{
          this.open2(res.data.msg);
          this.searchPushs();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    updatePush(){
      var param=new FormData();
      param.append('id',this.push.id);
      if(this.push.pushName!=''){
        param.append('pushName',this.push.pushName);
      }
      if(this.push.pushEmail!=''){
        param.append('pushEmail',this.push.pushEmail);
      }
      this.$http.post("http://127.0.0.1:8305/push/updatePushDetails",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchPushs();
        }else{
          this.open2(res.data.msg);
          this.searchPushs();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    prevClick(page){
      this.pageNum=page;
      this.pageInfoPush(this.pageSize,page);
    },
    nextClick(page){
      this.pageNum=page;
      this.pageInfoPush(this.pageSize,page);
    },
    currentChange(page){
      this.pageNum=page;
      this.pageInfoPush(this.pageSize,page);
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改推送人信息'
        this.push.id=row.id
        this.push.pushName = row.pushName
        this.push.pushEmail = row.pushEmail
      } else {
        this.title = '添加推送人信息'
        this.push.pushName = ''
        this.push.pushEmail = ''
      }
    },
    submitForm() {//编辑添加方法
      if(this.title=='添加推送人信息'){
        this.addPush();
      }else{
        this.updatePush();
      }
    },
    deletePush(index, row){
      var param=new FormData();
      param.append('PushDetailsId',row.id)
      this.$http.post("http://127.0.0.1:8305/push/deletePushDetails",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchPushs();
        }else{
          this.open2(res.data.msg);
        }
      },error=>{
        this.open2();
      })
    },
    searchPushs(){
      this.pageNum=1;
      var param = new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('pushName',this.search.pushName);
      param.append('pushEmail',this.search.pushEmail);
      param.append('pageSize',this.pageSize);
      param.append('pageNum',this.pageNum);
      this.$http.post("http://127.0.0.1:8305/push/pageInfoPushDetails",param).then(res=>{
        if(res.data.code==1000){
          this.pageInfoPushs=res.data.data;
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
