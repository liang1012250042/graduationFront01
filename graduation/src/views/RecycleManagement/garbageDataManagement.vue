<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>垃圾种类管理</el-breadcrumb-item>
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
        <el-input size="small" placeholder="垃圾名称" v-model="search.garbageDataName" @change="searchGarbageDatas()" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
<!--        <el-input size="small" placeholder="垃圾类型" v-model="search.garbageDataType" @change="searchGarbageDatas()" clearable></el-input>-->
        <el-select size="small" v-model="search.garbageDataType" placeholder="请选择垃圾类型" clearable>
          <el-option v-for="type in garbageTypes" :key="type.garbageTypeName" :value="type.garbageTypeName" :label="type.garbageTypeName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchGarbageDatas()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      border
      style="width: 100%"
      @selection-change="pageInfoGarbageData(this.pageSize,this.pageNum)"
      :data="garbageDataInfo.list"
      size="medium">
      <el-table-column
        prop="garbageDataName"
        label="垃圾名称">
      </el-table-column>
      <el-table-column
        prop="garbageDataType"
        label="垃圾类型">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteGarbageData(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.garbageDataInfo.total"
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
        <el-form label-width="100px" ref="editForm" :model="this.garbageData" :rules="rules">
          <el-form-item label="垃圾名称" prop="garbageStationName">
            <el-input size="small" v-model="garbageData.garbageDataName" auto-complete="off" placeholder="请输入垃圾名称" style="width: 202px"></el-input>
          </el-form-item>
          <el-form-item label="垃圾类型" prop="garbageStationHaveCapacity">
<!--            <el-input size="small" v-model="garbageData.garbageDataType" auto-complete="off" placeholder="请输入垃圾类型"></el-input>-->
            <el-select size="small" v-model="garbageData.garbageDataType" placeholder="请选择垃圾类型" clearable>
              <el-option v-for="type in garbageTypes" :key="type.garbageTypeName" :value="type.garbageTypeName" :label="type.garbageTypeName"></el-option>
            </el-select>
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
  name: "garbageDataManagement",
  data(){
    return{
      initPageSize:1,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载,
      title: '添加垃圾种类信息',
      date:[],
      editFormVisible: false, //控制编辑页面显示与隐藏
      garbageData:{//编辑或者添加页面的数据
        id:'',
        garbageDataName:'',
        garbageDataType:'',
      },
      search:{
        garbageDataName:'',
        garbageDataType:'',
      },
      garbageTypes:[],
      garbageDataInfo: [],
      pageSize: 8,
      pageNum: 1,
      // rules表单验证
      closeDialog(dialog) {
        if (dialog == 'edit') {
          this.editFormVisible = false
        }
      },
      rules: {
        garbageDataName: [
          { required: true, message: '请输入垃圾名称', trigger: 'blur' }
        ],
        garbageDataType: [
          { required: true, message: '请输入垃圾类型', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.pageInfoGarbageData(this.pageSize,this.pageNum);
    this.GarbageTypesInfo();
  },
  methods:{
    GarbageTypesInfo() {
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/type/pageTypeInfo").then(res => {
        this.garbageTypes = res.data.data;
        console.log(this.garbageTypes);
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
    pageInfoGarbageData(pageSize,pageNum){
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('garbageDataName',this.search.garbageDataName);
      param.append('garbageDataType',this.search.garbageDataType);
      param.append('pageSize',pageSize);
      param.append('pageNum',pageNum);
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/data/pageInfoGarbageData",param).then(res=>{
        this.garbageDataInfo=res.data.data;
      })
    },
    addGarbageData(){
      var param=new FormData();
      if(this.garbageData.garbageDataName!=''){
        param.append('garbageDataName',this.garbageData.garbageDataName);
      }
      if(this.garbageData.garbageDataType!=''){
        param.append('garbageDataType',this.garbageData.garbageDataType);
      }
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/data/addGarbageData",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageDatas();
        }else{
          this.open2(res.data.msg);
          this.searchGarbageDatas();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    updateGarbageData(){
      var param=new FormData();
      param.append('id',this.garbageData.id);
      if(this.garbageData.garbageDataName!=''){
        param.append('garbageDataName',this.garbageData.garbageDataName);
      }
      if(this.garbageData.garbageDataType!=''){
        param.append('garbageDataType',this.garbageData.garbageDataType);
      }
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/data/updateGarbageData",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageDatas();
        }else{
          this.open2(res.data.msg);
          this.searchGarbageDatas();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    prevClick(page){
      this.pageNum=page;
      this.pageInfoGarbageData(this.pageSize,page);
    },
    nextClick(page){
      this.pageNum=page;
      this.pageInfoGarbageData(this.pageSize,page);
    },
    currentChange(page){
      this.pageNum=page;
      this.pageInfoGarbageData(this.pageSize,page);
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改垃圾种类信息'
        this.garbageData.id=row.id;
        this.garbageData.garbageDataName=row.garbageDataName;
        this.garbageData.garbageDataType=row.garbageDataType;
      } else {
        this.title = '添加垃圾种类信息'
        this.garbageData.garbageDataName='';
        this.garbageData.garbageDataType='';
      }
    },
    submitForm() {//编辑添加方法
      if(this.title=='添加垃圾种类信息'){
        this.addGarbageData();
      }else{
        this.updateGarbageData();
      }
    },
    deleteGarbageData(index, row){
      var param=new FormData();
      param.append('GarbageDataId',row.id)
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/data/deleteGarbageData",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageDatas();
        }else{
          this.open2(res.data.msg);
        }
      },error=>{
        this.open2();
      })
    },
    searchGarbageDatas(){
      this.pageNum=1;
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('garbageDataName',this.search.garbageDataName);
      param.append('garbageDataType',this.search.garbageDataType);
      param.append('pageSize',this.pageSize);
      param.append('pageNum',this.pageNum);
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/data/pageInfoGarbageData",param).then(res=>{
        this.garbageDataInfo=res.data.data;
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
