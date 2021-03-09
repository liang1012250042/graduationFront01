<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>导出管理</el-breadcrumb-item>
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
        <el-input size="small" placeholder="文件名称" v-model="search.fileName" @change="searchFiles()" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <!--        <el-input size="small" placeholder="垃圾类型" v-model="search.garbageDataType" @change="searchGarbageDatas()" clearable></el-input>-->
        <el-select size="small" v-model="search.fileType" placeholder="请选择文件类型" clearable>
          <el-option value="导出" label="导出"></el-option>
          <el-option value="推送" label="推送"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchFiles()">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      border
      style="width: 100%"
      @selection-change="pageInfoFileData(this.pageSize,this.pageNum)"
      :data="FileInfo.list"
      size="medium">
      <el-table-column
        prop="fileName"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="fileType"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="success" :href="scope.row.fileUrl">下载</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.FileInfo.total"
        style="float: right;height: 5px;margin-top: 20px;margin-right: 40px"
        :page-size="this.pageSize"
        @prev-click="prevClick"
        @next-click="nextClick"
        @current-change="currentChange"
        :current-page.sync="this.pageNum"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "exportRecord",
  data(){
    return{
      initPageSize:1,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载,
      date:[],
      search:{
        fileName:'',
        fileType:'',
      },
      FileInfo:[],
      pageSize: 8,
      pageNum: 1,
    }
  },
  created() {
    this.pageInfoFileData(this.pageSize,this.pageNum);
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
    pageInfoFileData(pageSize,pageNum){
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('fileName',this.search.fileName);
      param.append('fileType',this.search.fileType);
      param.append('pageSize',pageSize);
      param.append('pageNum',pageNum);
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/file/pageInfoFileData",param).then(res=>{
        this.FileInfo=res.data.data;
      })
    },
    prevClick(page){
      this.pageNum=page;
      this.pageInfoFileData(this.pageSize,page);
    },
    nextClick(page){
      this.pageNum=page;
      this.pageInfoFileData(this.pageSize,page);
    },
    currentChange(page){
      this.pageNum=page;
      this.pageInfoFileData(this.pageSize,page);
    },
    searchFiles(){
      this.pageNum=1;
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('fileName',this.search.fileName);
      param.append('fileType',this.search.fileType);
      param.append('pageSize',this.pageSize);
      param.append('pageNum',this.pageNum);
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/file/pageInfoFileData",param).then(res=>{
        this.FileInfo=res.data.data;
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
