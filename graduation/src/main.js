// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios";
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  ak: 'dulZRBGQszlRsG0DuUMsNgCnNPdNDF3T'
})
Vue.config.productionTip = false
Vue.prototype.$echarts=echarts;
Vue.prototype.$http=axios;//修改内部的$http为axios

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
