<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>垃圾信息管理</el-breadcrumb-item>
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
          style="vertical-align: top;width: 300px;height: 32px;margin-top: 5px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" style="width: 150px">
        <el-input size="small" placeholder="垃圾名称" v-model="search.garbageDataName" @change="searchGarbageDetails()" clearable></el-input>
      </el-form-item>
      <el-form-item label="" style="width: 150px">
        <!--        <el-input size="small" placeholder="垃圾类型" v-model="search.garbageDataType" @change="searchGarbageDatas()" clearable></el-input>-->
        <el-select size="small" v-model="search.garbageType" placeholder="请选择垃圾类型" clearable>
          <el-option v-for="type in garbageTypes" :key="type.garbageTypeName" :value="type.garbageTypeName" :label="type.garbageTypeName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" style="width: 150px">
        <el-select size="small" v-model="search.garbageStationId" placeholder="请选择回收站点" clearable>
          <el-option v-for="station in garbageStations" :key="station.garbageStationName" :value="station.id" :label="station.garbageStationName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" style="width: 150px">
        <el-select size="small" v-model="search.garbageState" placeholder="请选择垃圾状态" clearable>
          <el-option value="1" label="未回收"></el-option>
          <el-option value="0" label="已回收"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchGarbageDetails()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">投入垃圾</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      border
      style="width: 100%;text-align: center"
      @selection-change="pageInfoGarbageDetails(this.pageSize,this.pageNum)"
      :data="garbageDetailInfo.list"
      size="medium">
      <el-table-column
        prop="garbageName"
        label="垃圾名称">
      </el-table-column>
      <el-table-column
        prop="garbageType"
        label="垃圾类型">
      </el-table-column>
      <el-table-column
        prop="garbageStationName"
        label="所属站点">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.garbageState==0" style="margin: auto">已回收</span>
          <span v-if="scope.row.garbageState==1" style="margin: auto">未回收</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteGarbageDetail(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.garbageDetailInfo.total"
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
        <el-form label-width="100px" ref="editForm" :model="this.garbageDetail" :rules="rules">
          <el-form-item label="垃圾名称" prop="garbageName">
<!--            <el-input size="small" v-model="garbageDetail.garbageName" auto-complete="off" placeholder="请输入垃圾名称" style="width: 202px"></el-input>-->
            <el-select size="small" v-model="garbageDetail.garbageName" placeholder="请选择垃圾种类" @change="GetGarbageDetailType">
              <el-option v-for="data in garbageDatas" :key="data.garbageDataName" :value="data.id" :label="data.garbageDataName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="垃圾类型" prop="garbageType">
            <el-input size="small" v-model="garbageDetail.garbageType" auto-complete="off" disabled style="width: 202px"></el-input>
          </el-form-item>
          <el-form-item label="所属站点" prop="garbageStationId">
            <el-select size="small" v-model="garbageDetail.garbageStationId" placeholder="请选择回收站点" clearable>
              <el-option v-for="station in garbageStations" :key="station.garbageStationName" :value="station.id" :label="station.garbageStationName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="garbageState">
            <el-input size="small" v-model="garbageDetail.garbageState" auto-complete="off" placeholder="请输入垃圾名称" style="width: 202px" disabled></el-input>
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
  name: "garbageDetailManagement",
  data(){
    return{
      initPageSize:1,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载,
      title: '投入垃圾',
      editFormVisible: false, //控制编辑页面显示与隐藏
      date:[],
      garbageDetail:{//编辑或者添加页面的数据
        id:'',
        garbageName:'',
        garbageType:'',
        garbageStationId:'',
        garbageState:'未回收',
      },
      search:{
        garbageName:'',
        garbageType:'',
        garbageStationId:'',
        garbageState:'',
      },
      garbageTypes:[],
      garbageDetailInfo: [],
      garbageStations:[],
      garbageDatas:[],
      pageSize: 8,
      pageNum: 1,
      // rules表单验证
      closeDialog(dialog) {
        if (dialog == 'edit') {
          this.editFormVisible = false
        }
      },
      rules: {
        garbageName: [
          { required: true, message: '请输入垃圾名称', trigger: 'blur' }
        ],
        garbageType: [
          { required: true, message: '请输入垃圾类型', trigger: 'blur' }
        ],
        garbageStationId: [
          { required: true, message: '请选择所属站点', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.pageInfoGarbageDetails(this.pageSize,this.pageNum);
    this.GarbageTypesInfo();
    this.GetGarbageStations();
    this.GetGarbageDatas();
  },
  methods:{
    GetGarbageDetailType(val){
      this.garbageDatas.forEach(e=>{
        if(e.id==val){
          this.garbageDetail.garbageName=e.garbageDataName;
          this.garbageDetail.garbageType=e.garbageDataType;
        }
      });
    },
    GetGarbageDatas(){
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/data/SelectAllGarbageData").then(res => {
        this.garbageDatas = res.data.data;
        console.log(this.garbageStations);
      })
    },
    GetGarbageStations(){
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/station/GarbageStationInfo").then(res => {
        this.garbageStations = res.data.data;
        console.log(this.garbageStations);
      })
    },
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
    pageInfoGarbageDetails(pageSize,pageNum){
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('garbageName',this.search.garbageName);
      param.append('garbageType',this.search.garbageType);
      param.append('garbageStationId',this.search.garbageStationId);
      param.append('garbageState',this.search.garbageState);
      param.append('pageSize',pageSize);
      param.append('pageNum',pageNum);
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/details/pageInfoGarbageDetails",param).then(res=>{
        this.garbageDetailInfo=res.data.data;
        console.log(this.garbageDetailInfo);
      })
    },
    addGarbageDetails(){
      var param=new FormData();
      if(this.garbageDetail.garbageName!=''){
        param.append('garbageName',this.garbageDetail.garbageName);
      }
      if(this.garbageDetail.garbageType!=''){
        param.append('garbageType',this.garbageDetail.garbageType);
      }
      if(this.garbageDetail.garbageStationId!=''){
        param.append('garbageStationId',this.garbageDetail.garbageStationId);
      }
      if(this.garbageDetail.garbageState!=''){
        param.append('garbageState',1);
      }
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/details/addGarbageDetails",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageDetails();
        }else{
          this.open2(res.data.msg);
          this.searchGarbageDetails();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    prevClick(page){
      this.pageNum=page;
      this.pageInfoGarbageDetails(this.pageSize,page);
    },
    nextClick(page){
      this.pageNum=page;
      this.pageInfoGarbageDetails(this.pageSize,page);
    },
    currentChange(page){
      this.pageNum=page;
      this.pageInfoGarbageDetails(this.pageSize,page);
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      console.log(this.title)
      if (row != undefined && row != 'undefined') {
      } else {
        this.title = '投入垃圾'
        this.garbageDetail.garbageName='';
        this.garbageDetail.garbageType='';
        this.garbageDetail.garbageStationId='';
        this.garbageDetail.garbageState='未回收';
      }
    },
    submitForm() {//编辑添加方法
      if(this.title=='投入垃圾'){
        this.addGarbageDetails();
      }
    },
    deleteGarbageDetail(index, row){
      var param=new FormData();
      param.append('garbageDetailsId',row.id)
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/details/deleteGarbageDetails",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageDetails();
        }else{
          this.open2(res.data.msg);
        }
      },error=>{
        this.open2();
      })
    },
    searchGarbageDetails(){
      this.pageNum=1;
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('garbageName',this.search.garbageName);
      param.append('garbageType',this.search.garbageType);
      param.append('garbageStationId',this.search.garbageStationId);
      param.append('garbageState',this.search.garbageState);
      param.append('pageSize',this.pageSize);
      param.append('pageNum',this.pageNum);
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/details/pageInfoGarbageDetails",param).then(res=>{
        this.garbageDetailInfo=res.data.data;
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
.table{
  text-align: center;
}
</style>
