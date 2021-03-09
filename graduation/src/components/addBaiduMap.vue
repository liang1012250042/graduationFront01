<template>
  <div>
    <!--    <el-input v-model="temp.address" placeholder="请输入地址来直接查找相关位置" clearable />-->
    <!--    <el-button class="confirm" @click="searchSite">定位</el-button>-->
    <!--    <baidu-map class="bm-view" :center="center" :zoom="15" :scroll-wheel-zoom="true" @click="getPoint">-->
    <!--      <bm-view class="map" />-->
    <!--      <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" style="width:0px;height:0px;overflow: hidden;" />-->
    <!--    </baidu-map>-->
    <div class="top-flag">请选择你要建立站点的位置</div>
    <baidu-map class="bm-view" :center="center" :zoom="15":scroll-wheel-zoom="true" @click="getPoint">
      <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" />
    </baidu-map>
    <span>经度：{{ temp.lng }}</span>
    <span>纬度：{{ temp.lat }}</span>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map'
export default {
  name: "addBaiduMap",
  data(){
    return{
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
    }
  },
  created() {
    this.GPS();
  },
  methods:{
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
  height: 300px;
}
.top-flag{
  margin-left: 250px;
  height: 50px;
}
</style>

