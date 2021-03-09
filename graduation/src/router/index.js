import Vue from 'vue'
import Router from 'vue-router'
import welcome from "../components/welcome";
import exportRecord from "../views/ExportManagement/exportRecord";
import garbageDataManagement from "../views/RecycleManagement/garbageDataManagement";
import garbageDetailManagement from "../views/RecycleManagement/garbageDetailManagement";
import garbageStationManagement from "../views/RecycleManagement/garbageStationManagement";
import garbageTypeManagement from "../views/RecycleManagement/garbageTypeManagement";
import pushManagement from "../views/SystemManagement/pushManagement";
import admin from "../views/UserManagement/admin";
import user from "../views/UserManagement/user";
import addBaiduMap from "../components/addBaiduMap";
import pathCarManagement from "../views/DispatchManagement/pathCarManagement";
import garbageCarManagement from "../views/DispatchManagement/garbageCarManagement";
import Bmap from "../views/DispatchManagement/Bmap";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: welcome,
      children:[
        {
          path: '/exportRecord',
          component: exportRecord
        },{
          path: '/garbageDataManagement',
          component: garbageDataManagement
        },{
          path: '/garbageDetailManagement',
          component: garbageDetailManagement
        },{
          path: '/garbageStationManagement',
          component: garbageStationManagement
        },{
          path: '/garbageTypeManagement',
          component: garbageTypeManagement
        },{
          path: '/pushManagement',
          component: pushManagement
        },{
          path: '/admin',
          component: admin
        },{
          path: '/user',
          component: user
        },{
          path: '/pathCarManagement',
          component:pathCarManagement
        },{
          path: '/garbageCarManagement',
          component:garbageCarManagement
        },{
          path: '/Bmap',
          component:Bmap
        }
      ]
    }
  ]
})
