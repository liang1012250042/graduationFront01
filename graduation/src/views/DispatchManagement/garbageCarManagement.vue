<!--垃圾车调度管理-->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>出行车辆管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" class="user-search">
      <el-form-item label="">
        <el-input size="small" placeholder="车辆名称" v-model="search.garbageCarName" @change="searchGarbageCars()" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select size="small" v-model="search.garbageCarIsStation" placeholder="请选择所属站点" clearable>
          <el-option v-for="station in garbageStationInfo" :key="station.garbageStationName" :value="station.id" :label="station.garbageStationName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" placeholder="车辆容量限制" v-model="search.garbageCarCapacity" @change="searchGarbageCars()" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select size="small" v-model="search.state" placeholder="所属状态" clearable>
          <el-option value="0" label="未出行" ></el-option>
          <el-option value="1" label="已出行" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchGarbageCars()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      border
      style="width: 100%"
      @selection-change="pageInfoGarbageCar(this.pageSize,this.pageNum)"
      :data="garbageCarInfo.list"
      size="medium">
      <el-table-column
        prop="garbageCarName"
        label="车辆名称">
      </el-table-column>
      <el-table-column
        prop="garbageCarCapacity"
        label="车辆容量">
      </el-table-column>
      <el-table-column
        prop="garbageStationName"
        label="所属站点">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.state==0" style="margin: auto">未出行</span>
          <span v-if="scope.row.state==1" style="margin: auto">已出行</span>
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
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteGarbageCar(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.garbageCarInfo.total"
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
        <el-form label-width="100px" ref="editForm" :model="this.garbageCar" :rules="rules">
          <el-form-item label="车辆名称" prop="garbageCarName">
            <el-input size="small" v-model="garbageCar.garbageCarName" auto-complete="off" placeholder="请输入车辆名称" style="width: 202px"></el-input>
          </el-form-item>
          <el-form-item label="车辆容量" prop="garbageCarCapacity">
            <el-input v-if="this.title=='修改车辆信息'" size="small" v-model="garbageCar.garbageCarCapacity" auto-complete="off" :disabled="true" placeholder="请设置车辆容量" style="width: 202px"></el-input>
            <el-input v-if="this.title=='添加车辆信息'" size="small" v-model="garbageCar.garbageCarCapacity" auto-complete="off" placeholder="请设置车辆容量" style="width: 202px"></el-input>
          </el-form-item>
          <el-form-item label="所属站点" prop="garbageCarIsStation">
            <el-select size="small" v-model="garbageCar.garbageCarIsStation" placeholder="请选择所属站点" clearable>
              <el-option v-for="station in garbageStationInfo" :key="station.garbageStationName" :value="station.id" :label="station.garbageStationName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆状态" prop="state">
            <el-select size="small" v-model="garbageCar.state" placeholder="请设置车辆状态" disabled="true">
              <el-option value="0" label="未出行"></el-option>
              <el-option value="1" label="已出行"></el-option>
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

export default {
  name: "garbageCarManagement",
  data(){
    return{
      initPageSize:1,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载,
      mapDialogVisible: false,
      title: '添加车辆信息',
      editFormVisible: false, //控制编辑页面显示与隐藏
      garbageStationInfo:[],
      temp:{},
      garbageCar:{//编辑或者添加页面的数据
        id:'',
        garbageCarName:'',
        garbageCarIsStation:'',
        garbageCarCapacity:'',
        state:'0',
      },
      search:{
        garbageCarName:'',
        garbageCarIsStation:'',
        garbageCarCapacity:'',
        state:'',
      },
      garbageCarInfo: [],
      pageSize: 8,
      pageNum: 1,
      garbageStations:[],
      // rules表单验证
      closeDialog(dialog) {
        if (dialog == 'edit') {
          this.editFormVisible = false
        }
      },
      rules: {
        garbageCarName: [
          { required: true, message: '请输入车辆名称', trigger: 'blur' }
        ],
        garbageCarIsStation: [
          { required: true, message: '请输入设置所属站点', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.pageInfoGarbageCar(this.pageSize,this.pageNum);
    this.getGarbageStationInfo();
  },
  methods:{
    getGarbageStationInfo(){
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/station/GarbageStationInfo").then(res=>{
        this.garbageStationInfo=res.data.data;
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
    GetGarbageStations(){
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/station/GarbageStationInfo").then(res => {
        this.garbageStations = res.data.data;
        console.log(this.garbageStations);
      })
    },
    pageInfoGarbageCar(pageSize,pageNum){
      var param=new FormData();
      console.log(this.search);
      param.append('garbageCarName',this.search.garbageCarName);
      param.append('garbageCarIsStation',this.search.garbageCarIsStation);
      param.append('state',this.search.state);
      param.append('garbageCarCapacity',this.search.garbageCarCapacity);
      param.append('pageSize',this.pageSize);
      param.append('pageNum',this.pageNum);
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/car/pageInfoGarbageCar",param).then(res=>{
        this.garbageCarInfo=res.data.data;
      })
    },
    addGarbageCar(){
      var param=new FormData();
      if(this.garbageCar.garbageCarName!=''){
        param.append('garbageCarName',this.garbageCar.garbageCarName);
      }
      if(this.garbageCar.garbageCarCapacity!=''){
        param.append('garbageCarCapacity',this.garbageCar.garbageCarCapacity);
      }
      if(this.garbageCar.garbageCarIsStation!=''){
        param.append('garbageCarIsStation',this.garbageCar.garbageCarIsStation);
      }
      if(this.garbageCar.state!=''){
        param.append('state',this.garbageCar.state);
      }
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/car/addGarbageCar",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageCars();
        }else{
          this.open2(res.data.msg);
          this.searchGarbageCars();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    updateGarbageCar(){
      var param=new FormData();
      param.append('id',this.garbageCar.id);
      if(this.garbageCar.garbageCarName!=''){
        param.append('garbageCarName',this.garbageCar.garbageCarName);
      }
      if(this.garbageCar.garbageCarCapacity!=''){
        param.append('garbageCarCapacity',this.garbageCar.garbageCarCapacity);
      }
      if(this.garbageCar.garbageCarIsStation!=''){
        param.append('garbageCarIsStation',this.garbageCar.garbageCarIsStation);
      }
      if(this.garbageCar.state!=''){
        param.append('state',this.garbageCar.state);
      }
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/car/updateGarbageCar",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageCars();
        }else{
          this.open2(res.data.msg);
          this.searchGarbageCars();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    prevClick(page){
      this.pageNum=page;
      this.pageInfoGarbageCar(this.pageSize,page);
    },
    nextClick(page){
      this.pageNum=page;
      this.pageInfoGarbageCar(this.pageSize,page);
    },
    currentChange(page){
      this.pageNum=page;
      this.pageInfoGarbageCar(this.pageSize,page);
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改车辆信息'
        this.garbageCar.id=row.id;
        this.garbageCar.garbageCarName=row.garbageCarName;
        this.garbageCar.garbageCarCapacity=row.garbageCarCapacity;
        this.garbageCar.state=row.state;
        this.garbageCar.garbageCarIsStation=row.garbageCarIsStation;
      } else {
        this.title = '添加车辆信息'
        this.garbageCar.garbageCarName='';
        this.garbageCar.garbageCarCapacity='';
        this.garbageCar.state='0';
        this.garbageCar.garbageCarIsStation='';
      }
    },
    submitForm() {//编辑添加方法
      if(this.title=='添加车辆信息'){
        this.addGarbageCar();
      }else{
        this.updateGarbageCar();
      }
    },
    deleteGarbageCar(index, row){
      var param=new FormData();
      param.append('GarbageCarId',row.id)
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/car/deleteGarbageCar",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageCars();
        }else{
          this.open2(res.data.msg);
        }
      },error=>{
        this.open2();
      })
    },
    searchGarbageCars(){
      this.pageNum=1;
      var param=new FormData();
      param.append('garbageCarName',this.search.garbageCarName);
      param.append('garbageCarIsStation',this.search.garbageCarIsStation);
      param.append('state',this.search.state);
      param.append('garbageCarCapacity',this.search.garbageCarCapacity);
      param.append('pageSize',this.pageSize);
      param.append('pageNum',this.pageNum);
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/car/pageInfoGarbageCar",param).then(res=>{
        this.garbageCarInfo=res.data.data;
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

