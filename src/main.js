// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
// import VueAwesomeSwiper from 'vue-awesome-swiper' // 引入轮播图插件
// import 'swiper/dist/css/swiper.css'  // 样式
//引入nprogress 进入页面时显示顶部加载效果
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(ElementUI);
// Vue.use(VueAwesomeSwiper, /* { default global options } */)
NProgress.configure({
  easing: 'ease',  // 动画方式    
  speed: 500,  // 递增进度条的速度    
  showSpinner: true, // 是否显示加载ico 
})

Vue.config.productionTip = false

// 路由全局守卫  是否登录 否-》login 是-》 home
router.beforeEach((to, from, next) => {
  // 每次切换页面时，调用进度条
  NProgress.start();
  if (to.path === '/login') {
    next();
  } else {
    if (sessionStorage.getItem('login')) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
