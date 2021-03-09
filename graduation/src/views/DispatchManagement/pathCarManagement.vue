<template>
  <div style="background: rgb(245,243,240)">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>车辆调度</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" class="user-search">
      <el-form-item label="">
        <el-select size="small" v-model="search.garbageCarName" placeholder="请选择出行车辆" clearable @change="getCarIsStationAddress">
          <el-option v-for="address in carIsStationAddressInfo" :key="address.carName" :value="address.id" :label="address.carName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" style="width: 220px">
        <el-input size="small" placeholder="车辆所在地址" clearable disabled="true" v-model="search.carIsStationAddress" style="width: 220px"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select size="small" v-model="search.endId" placeholder="请选择终点站点" clearable @change="getCarIsStationAddress">
          <el-option v-for="station in garbageStationInfo" :key="station.garbageStationName" :value="station.id" :label="station.garbageStationName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" style="width: 200px">
        <el-select size="small" v-model="search.pathStations" placeholder="设置经过站点" clearable multiple collapse-tags>
          <el-option v-for="station in garbageStationInfo"
                     :key="station.garbageStationName"
                     :value="station.id"
                     :label="station.garbageStationName"
                     v-if="search.id!=station.id"
          ></el-option>
          <el-option v-for="station in garbageStationInfo"
                     :key="station.garbageStationName"
                     :value="station.id"
                     :label="station.garbageStationName"
                     v-if="search.id==station.id"
                     disabled="true"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary"  @click="getPath">出发</el-button>
      </el-form-item>
<!--      <el-form-item style="height: 30px">-->
<!--        <img :src=carLogo alt="" class="carImg">-->
<!--      </el-form-item>-->

    </el-form>
    <div id="allMap" style="height: 500px">

    </div>
<!--    <baidu-map id="allMap" class="bm-view" :center="center" :zoom="15":scroll-wheel-zoom="true" @click="getPoint">-->
<!--      <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" />-->
<!--    </baidu-map>-->
  </div>
</template>

<script>
export default {
  name: "pathCarManagement",
  data(){
    return{
      carLogo: require('../../assets/img/carLogo.png'),
      temp: {
        address: '',
        lat: '',
        lng: ''
      },
      center: {
        lng: 119.21258525260968,
        lat: 26.02804093885972
      },
      location: '福州市',
      keyword: '', // 地图搜索关键字
      carIsStationAddressInfo:[],
      garbageStationInfo:[],
      search:{
        id:'',
        garbageCarName:'',
        carIsStationAddress:'',
        pathStations:'',
        endId:'',
        carId:''
      },
      pathDetails:[],
      path:[],
      map:'',
      pl:'',
    }
  },
  created() {
    this.SelectCarIsStationAddress();
    this.getGarbageStationInfo();
  },
  mounted() {
    this.initMap();
  },
  methods:{
    startPath(){
      // GL版命名空间为BMapGL
      // 按住鼠标右键，修改倾斜角和角度
      var point = [];
      for (var i = 0; i < this.pathDetails.length; i++) {
        point.push(new BMapGL.Point(this.pathDetails[i].lng, this.pathDetails[i].lat));
      }
      this.pl = new BMapGL.Polyline(point);
      setTimeout(this.start, 3000);
    },
    start(){
      var trackAni = new BMapGLLib.TrackAnimation(this.map, this.pl, {
        overallView: true,
        tilt: 50,
        duration: 5000,
        delay: 300
      });
      trackAni.start();
    },
    initMap(){
      this.map = new BMapGL.Map('allMap'); // 创建Map实例
      this.map.centerAndZoom(new BMapGL.Point(119.21258525260968, 26.02804093885972), 17); // 初始化地图,设置中心点坐标和地图级别
      this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    },
    getPath(){
      // alert(this.search.id);
      // alert(this.search.endId);
      var param=new FormData();
      if(this.search.id==''||this.search.endId==''){
        this.open2('请确认请求信息是否正确!');
        return;
      }
      param.append('startPoint',this.search.id);
      param.append('endPoint',this.search.endId);
      param.append('pathStations',this.search.pathStations)
      param.append('carId',this.search.carId)
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/car/getPathDetails",param).then(res=>{
        this.pathDetails=res.data.data;
        console.log(this.pathDetails)
      })
      this.startPath();
    },
    getGarbageStationInfo(){
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/station/GarbageStationInfo").then(res=>{
        this.garbageStationInfo=res.data.data;
      })
    },
    getCarIsStationAddress(val){
      if(val==''){
        this.search.carIsStationAddress='车辆所在地址';
      }
      this.carIsStationAddressInfo.forEach(e=>{
        if(val==e.id){
          this.search.carIsStationAddress=e.carIsStationAddress;
          this.search.id=e.carIsStationId;
          this.search.carId=e.id
        }
      })
    },
    SelectCarIsStationAddress(){
      this.$http.post("http://127.0.0.1:8405/garbageAdmin/car/SelectCarIsStationAddress").then(res=>{
        this.carIsStationAddressInfo=res.data.data;
        console.log(this.carIsStationAddressInfo);
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
    getPoint(e) { // 地图点击事件 =》获取经纬度
      this.temp.lng = e.point.lng
      this.temp.lat = e.point.lat
      /* global BMap */
      const geocoder = new BMap.Geocoder() // 创建地址解析器的实例
      geocoder.getLocation(e.point, rs => { // 当前位置定位
        const province = rs.addressComponents.province // 省
        const city = rs.addressComponents.city // 城市
        const district = rs.addressComponents.district // 区县
        const street = rs.addressComponents.street // 街道
        const streetNumber = rs.addressComponents.streetNumber// 门牌号
        this.temp.address = province + city + district + street + streetNumber // 组装成地址
        this.temp.address = rs.address;
        this.center.lat=this.temp.lat;
        this.center.lng=this.temp.lng;
        this.$emit('listenToChildEvent',this.temp);
        // console.log(rs.surroundingPois) // 附近的POI点(array) POI：兴趣点 可以是一栋房子、一个商铺、一个邮筒、一个公交站
        // console.log(rs.business) // 商圈字段，代表此点所属的商圈(string)
      })
    },
    searchSite() { // 定位
      this.keyword = this.temp.address
      console.log(this.keyword)
    }
  }
}
</script>

<style scoped>
.bm-view {
  width: 100%;
  height: 500px;
}
.top-flag{
  margin-left: 250px;
  height: 50px;
}
.user-search {
  margin-top: 20px;
}
.carImg{
  width: 300px;
  margin-bottom: 200px;
}
</style>

