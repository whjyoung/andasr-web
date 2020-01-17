import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: '首页',
      component: () => import('@/pages/Index.vue'), //路由懒加载
      children: [{//默认首页
        path: '/',
        name: '首页',
        component: () => import('@/pages/Home.vue') //路由懒加载
      }, {
        path: '/recomStatic',
        name: '推荐统计',
        component: () => import('@/pages/RecomStatic.vue'), //路由懒加载 导航二的子组件
        children: [{
          path: 'workstation',
          name: '工位',
          component: () => import('@/pages/WorkStation.vue')
        }, {
          path: 'product',
          name: '产品',
          component: () => import('@/pages/Product.vue')
        }, {
          path: 'servicehall',
          name: '营业厅',
          component: () => import('@/pages/ServiceHall.vue')
        }]
      }, {
        path: '/backManage',
        name: '后台管理',
        component: () => import('@/pages/BackManage.vue'), //路由懒加载
        children: [{
          path: 'staffmanage',
          name: '员工管理',
          component: () => import('@/pages/StaffManage.vue')
        }, {
          path: 'recordfile',
          name: '录音文件',
          component: () => import('@/pages/RecordFile.vue')
        }, {
          path: 'keywords',
          name: '关键词',
          component: () => import('@/pages/KeyWords.vue')
        }]
      }]
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('@/pages/Login.vue')
    }
  ]
})
