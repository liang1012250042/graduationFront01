<template>
  <div class="patrol_area">
    <el-button @click="sss">11</el-button>
    <div id="allmap" style="height:400px;">

    </div>
  </div>
</template>

<script>
  export default {
  name: 'Bmap',
  data(){
  return {
    path:[
      {
        "lng": "119.21253284468",
        "lat": "26.028830982617"
      },
      {
        "lng": "119.21284374821",
        "lat": "26.028917178218"
      },
      {
        "lng": "119.21292396689",
        "lat": "26.028986167118"
      },
      {
        "lng": "119.21292396689",
        "lat": "26.028996231377"
      }
    ],
    point:[],
    map:'',
    maps:'',
    pls:''
}
},
  mounted(){
  this.init()
},
  methods: {
    sss(){
      this.createMpa();
    },
    init(){
      this.map = new BMapGL.Map("allmap");    // 创建Map实例
      this.map.centerAndZoom(new BMapGL.Point(121.814224,31.156484), 17);  // 初始化地图,设置中心点坐标和地图级别
      this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    },
    createMpa() {
      // GL版命名空间为BMapGL
      // 按住鼠标右键，修改倾斜角和角度
      this.point = [];
      for (var i = 0; i < this.path.length; i++) {
        this.point.push(new BMapGL.Point(this.path[i].lng, this.path[i].lat));
      }
      var pl = new BMapGL.Polyline(this.point);

      this.maps = this.map
      this.pls = pl
      setTimeout(this.start, 3000);
    },
    // 创建个轨迹动画对象，并配置参数
    start (){
      var trackAni = new BMapGLLib.TrackAnimation(this.maps, this.pls, {
        overallView: true,
        tilt: 30,
        duration: 20000,
        delay: 300
      });
      trackAni.start();
    }
  }
}
</script>


<style scoped>

</style>
