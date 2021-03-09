<!--推送管理-->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>回收站点管理</el-breadcrumb-item>
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
        <el-input size="small" placeholder="回收站点名称" v-model="search.garbageStationName" @change="searchGarbageStations()" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" placeholder="站点容量限制" v-model="search.garbageStationCapacity" @change="searchGarbageStations()" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchGarbageStations()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      border
      style="width: 100%"
      @selection-change="pageInfoGarbageStation(this.pageSize,this.pageNum)"
      :data="garbageStationInfo.list"
      size="medium">
      <el-table-column
        prop="garbageStationName"
        label="站点名称">
      </el-table-column>
      <el-table-column
        prop="garbageStationHaveCapacity"
        label="站点现有容量">
      </el-table-column>
      <el-table-column
        prop="garbageStationCapacity"
        label="站点容量">
      </el-table-column>
      <el-table-column
        prop="garbageStationAddress"
        label="站点地址">
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
          <el-button type="text" size="small" @click="deleteGarbageStation(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.garbageStationInfo.total"
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
        <el-form label-width="100px" ref="editForm" :model="this.garbageStation" :rules="rules">
          <el-form-item label="站点名称" prop="garbageStationName">
            <el-input size="small" v-model="garbageStation.garbageStationName" auto-complete="off" placeholder="请输入站点名称"></el-input>
          </el-form-item>
          <el-form-item label="站点现有容量" prop="garbageStationHaveCapacity">
            <el-input size="small" v-model="garbageStation.garbageStationHaveCapacity" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="站点容量" prop="garbageStationCapacity">
            <el-input size="small" v-model="garbageStation.garbageStationCapacity" auto-complete="off" placeholder="请输入站点容量"></el-input>
          </el-form-item>
          <el-form-item label="站点地址" prop="address">
            <el-input v-model="garbageStation.address">
              <el-button @click="mapDialogVisible = true" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <span>经度：{{garbageStation.stationlng}}</span>
            <span>纬度：{{garbageStation.stationlat}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
          <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm">保存</el-button>
        </div>
      </el-dialog>
    </div>
<!--    地图弹窗-->
    <el-dialog :visible.sync="mapDialogVisible">
      <div>
        <AddBaiduMap
          @listenToChildEvent="gaodedata"
          :lngPoint="temp.stationLng"
          :latPoint="temp.stationLat"
          :address="temp.address"
        ></AddBaiduMap>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mapDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="mapDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import AddBaiduMap from "../../components/addBaiduMap";

export default {
  name: "garbageStationManagement",
  components: {AddBaiduMap},
  data(){
    return{
      initPageSize:1,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载,
      mapDialogVisible: false,
      title: '添加回收站点信息',
      editFormVisible: false, //控制编辑页面显示与隐藏
      date:[],
      temp:{},
      garbageStation:{//编辑或者添加页面的数据
        id:'',
        garbageStationName:'',
        garbageStationCapacity:'',
        garbageStationHaveCapacity:'0',
        stationlat:'',
        stationlng:'',
        address:'',
      },
      search:{
        garbageStationName:'',
        garbageStationCapacity:''
      },
      garbageStationInfo: [],
      pageSize: 8,
      pageNum: 1,
      // rules表单验证
      closeDialog(dialog) {
        if (dialog == 'edit') {
          this.editFormVisible = false
        }
      },
      rules: {
        garbageStationName: [
          { required: true, message: '请输入站点名称', trigger: 'blur' }
        ],
        garbageStationCapacity: [
          { required: true, message: '请输入站点容量', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.pageInfoGarbageStation(this.pageSize,this.pageNum);
  },
  methods:{
    gaodedata(data) {
      this.temp.stationLat = data.lat;
      this.temp.stationLng = data.lng;
      this.temp.address = data.address;
      this.garbageStation.stationlng = this.temp.stationLng;
      this.garbageStation.stationlat = this.temp.stationLat;
      this.garbageStation.address = this.temp.address;
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
    pageInfoGarbageStation(pageSize,pageNum){
      var param=new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('garbageStationName',this.search.garbageStationName);
      param.append('garbageStationCapacity',this.search.garbageStationCapacity);
      param.append('pageSize',pageSize);
      param.append('pageNum',pageNum);
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/station/pageInfoGarbageStation",param).then(res=>{
        this.garbageStationInfo=res.data.data;
      })
    },
    addGarbageStation(){
      var param=new FormData();
      if(this.garbageStation.garbageStationName!=''){
        param.append('garbageStationName',this.garbageStation.garbageStationName);
      }
      if(this.garbageStation.garbageStationHaveCapacity!=''){
        param.append('garbageStationHaveCapacity',this.garbageStation.garbageStationHaveCapacity);
      }
      if(this.garbageStation.garbageStationCapacity!=''){
        param.append('garbageStationCapacity',this.garbageStation.garbageStationCapacity);
      }
      if(this.garbageStation.stationlat!=''){
        param.append('garbageStationLatitude',this.garbageStation.stationlat);
      }
      if(this.garbageStation.stationlng!=''){
        param.append('garbageStationLongitude',this.garbageStation.stationlng);
      }
      if(this.garbageStation.address!=''){
        param.append('garbageStationAddress',this.garbageStation.address);
      }
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/station/addGarbageStation",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageStations();
        }else{
          this.open2(res.data.msg);
          this.searchGarbageStations();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    updateGarbageStation(){
      var param=new FormData();
      param.append('id',this.garbageStation.id);
      if(this.garbageStation.garbageStationName!=''){
        param.append('garbageStationName',this.garbageStation.garbageStationName);
      }
      if(this.garbageStation.garbageStationHaveCapacity!=''){
        param.append('garbageStationHaveCapacity',this.garbageStation.garbageStationHaveCapacity);
      }
      if(this.garbageStation.garbageStationCapacity!=''){
        param.append('garbageStationCapacity',this.garbageStation.garbageStationCapacity);
      }
      if(this.garbageStation.stationlat!=''){
        param.append('garbageStationLatitude',this.garbageStation.stationlat);
      }
      if(this.garbageStation.stationlng!=''){
        param.append('garbageStationLongitude',this.garbageStation.stationlng);
      }
      if(this.garbageStation.address!=''){
        param.append('garbageStationAddress',this.garbageStation.address);
      }
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/station/updateGarbageStation",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageStations();
        }else{
          this.open2(res.data.msg);
          this.searchGarbageStations();
        }
      },error=>{
        this.open2();
      })
      this.editFormVisible = false
      this.loading = false
    },
    prevClick(page){
      this.pageNum=page;
      this.pageInfoGarbageStation(this.pageSize,page);
    },
    nextClick(page){
      this.pageNum=page;
      this.pageInfoGarbageStation(this.pageSize,page);
    },
    currentChange(page){
      this.pageNum=page;
      this.pageInfoGarbageStation(this.pageSize,page);
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改回收站点信息'
        this.garbageStation.id=row.id;
        this.garbageStation.garbageStationName=row.garbageStationName;
        this.garbageStation.garbageStationHaveCapacity=row.garbageStationHaveCapacity;
        this.garbageStation.garbageStationCapacity=row.garbageStationCapacity;
        this.garbageStation.stationlng=row.garbageStationLongitude;
        this.garbageStation.stationlat=row.garbageStationLatitude;
        this.garbageStation.address=row.garbageStationAddress;
      } else {
        this.title = '添加回收站点信息'
        this.garbageStation.garbageStationName='';
        this.garbageStation.garbageStationHaveCapacity='0';
        this.garbageStation.garbageStationCapacity='';
        this.garbageStation.stationlng='';
        this.garbageStation.stationlat='';
        this.garbageStation.address='';
      }
    },
    submitForm() {//编辑添加方法
      if(this.title=='添加回收站点信息'){
        this.addGarbageStation();
      }else{
        this.updateGarbageStation();
      }
    },
    deleteGarbageStation(index, row){
      var param=new FormData();
      param.append('garbageStationIds',row.id)
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/station/deleteGarbageStation",param).then(res=>{
        if(res.data.code==1000){
          this.open1(res.data.msg);
          this.searchGarbageStations();
        }else{
          this.open2(res.data.msg);
        }
      },error=>{
        this.open2();
      })
    },
    searchGarbageStations(){
      this.pageNum=1;
      var param = new FormData();
      if(this.date&&this.date.length>0){
        param.append('beginTime',this.date[0]);
        param.append('endTime',this.date[1]);
      }
      param.append('garbageStationName',this.search.garbageStationName);
      param.append('garbageStationCapacity',this.search.garbageStationCapacity);
      param.append('pageSize',this.pageSize);
      param.append('pageNum',this.pageNum);
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/station/pageInfoGarbageStation",param).then(res=>{
        if(res.data.code==1000){
          this.garbageStationInfo=res.data.data;
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
