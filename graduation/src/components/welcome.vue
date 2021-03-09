<template>
  <div>
    <el-container>
      <el-aside width="200px" height="100vh">
        <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
          <div class="logobox">
            <i class="el-icon-delete" />
          </div>
          <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
            <template slot="title">
              <span>{{menu.menuname}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid" style="background-color:#2a3649">
                <span>{{chmenu.menuname}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="index-header">
          <el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff">
            <el-link class="buttonimg" href="http://127.0.0.1:8081" style="margin-left: 10px;color: white">
              前台数据展示
            </el-link>
            <el-submenu index="2" class="submenuTop" style="float: right">
              <!-- <template slot="title">{{user.userRealName}}</template> -->
              <template slot="title">超级管理员</template>
              <el-menu-item index="2-1">设置</el-menu-item>
              <el-menu-item index="2-2">个人中心</el-menu-item>
              <el-menu-item index="2-3">退出</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-header>
        <el-main style="background: rgb(245,240,242)">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
name: "welcome",
  data() {
    return {
      collapsed: false,
      allmenu: [],
      imgshow: require('../assets/img/show.png'),
      imgsq: require('../assets/img/sq.png'),
      user: {}
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    // 获取图形验证码
    let res = {
      success: true,
      data: [
        {
          menuid: 1,
          icon: '',
          menuname: '出行管理',
          url: null,
          menus: [
            {
              menuid: 1-1,
              icon: '',
              menuname: '出行路线管理',
              url: 'pathCarManagement',
              //url: 'Bmap',
              menus: null
            },
            {
              menuid: 1-2,
              icon: '',
              menuname: '出行车辆管理',
              url: 'garbageCarManagement',
              menus: null
            }
          ]
        },
        {
          menuid: 2,
          icon: '',
          menuname: '用户管理',
          url: null,
          menus: [
            {
              menuid: 2-1,
              icon: '',
              menuname: '普通用户管理',
              url: 'user',
              menus: null
            },
            {
              menuid: 2-2,
              icon: '',
              menuname: '管理员管理',
              url: 'admin',
              menus: null
            }
          ]
        },
        {
          menuid: 3,
          icon: '',
          menuname: '回收管理',
          url: null,
          menus: [
            {
              menuid: 3-1,
              icon: '',
              menuname: '垃圾种类管理',
              url: 'garbageDataManagement',
              menus: null
            },
            {
              menuid: 3-2,
              icon: '',
              menuname: '垃圾类型管理',
              url: 'garbageTypeManagement',
              menus: null
            },
            {
              menuid: 3-3,
              icon: '',
              menuname: '回收站点管理',
              url: 'garbageStationManagement',
              menus: null
            },
            {
              menuid: 3-4,
              icon: '',
              menuname: '垃圾信息管理',
              url: 'garbageDetailManagement',
              menus: null
            },
          ]
        },
        {
          menuid: 4,
          icon: '',
          menuname: '系统管理',
          url: null,
          menus: [
            {
              menuid: 4-1,
              icon: '',
              menuname: '推送管理',
              url: 'pushManagement',
              menus: null
            },
          ]
        },
        {
          menuid: 5,
          icon: '',
          menuname: '导出管理',
          url: null,
          menus: [
            {
              menuid: 5-1,
              icon: '',
              menuname: '导出记录',
              url: 'exportRecord',
              menus: null
            }
          ]
        }
      ],
      msg: 'success'
    }
    this.allmenu = res.data

  },
  methods:{
    // 切换显示
  }
}
</script>

<style >
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px;
}
.el-menu-bg {
  background-color: gray !important;
}
.el-menu {
  border: none;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
.index-header{
  padding: 0;
  border: 1px solid black;
}

.el-menu-vertical-demo:not(.el-menu--collapseTop) {
  border: none;
}
.submenuTop{
  float: right;
}
.buttonimg {
  height: 60px;
  background-color: transparent;
  border: none;
}
.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}
.showimg:active {
  border: none;
}
</style>
