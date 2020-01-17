<template>
  <div class="index">
    <el-container>
      <!-- 头部 -->
      <header-bar></header-bar>
      <el-container class="bottom_con">
        <!-- 左侧边栏 -->
        <aside-bar :isCollapse="isCollapse"></aside-bar>
        <!-- 右内容 -->
        <el-container class="right_con">
          <el-scrollbar style="height:100%;width:100%;">
            <!-- <div class="colFlag">
              <img
                src="@/assets/imgs/lr.png"
                alt
                :class="isCollapse?'isActive':'default'"
                @click="isCollapse = !isCollapse"
              />
            </div> -->
            <el-main>
              <router-view></router-view>
            </el-main>
          </el-scrollbar>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import AsideBar from "@/components/AsideBar.vue"; //侧边栏 
import HeaderBar from "@/components/Header.vue" // 头部
export default {
  name: "index",
  components: {
    "aside-bar": AsideBar,
    "header-bar":HeaderBar
  },
  data() {
    return {
      isCollapse: false, //默认展开侧边栏
      breadCrumbList: [] //面包屑导航名称
    };
  },
  watch: {
    $route() {
      // console.log(this.$route);//当前跳转的路由信息
      this.getBreadCrumb();
    }
  },
  methods: {
    getBreadCrumb() {
      let matched = this.$route.matched.filter(item => item.name); //获取出路由里的name组件
      this.breadCrumbList = matched;
      console.log(this.breadCrumbList);
    }
  },
  mounted() {
    // console.log(this.$router.options);//路由里的内容
    this.getBreadCrumb(); //获取路由渲染面包屑导航
  }
};
</script>
<style lang="less">
.index,
.el-container {
  height: 100%;
  .bottom_con {
    padding-top: 70px;
    .right_con {
      .el-main{
        // height: 100%;
        background: #fff;
        padding: 7px 10px;
      }
      // .colFlag {
      //   background-color: antiquewhite;
      //   img {
      //     width: 20px;
      //     cursor: pointer;
      //     margin-right: 5px;
      //   }
      //   .isActive {
      //     -webkit-transform: rotate(180deg);
      //     transform: rotate(180deg);
      //     transition: 0.38s;
      //     -webkit-transform-origin: 50% 50%;
      //     transform-origin: 50% 50%;
      //   }
      //   .default {
      //     -webkit-transform: rotate(0deg);
      //     transform: rotate(0deg);
      //     transition: 0.38s;
      //     -webkit-transform-origin: 50% 50%;
      //     transform-origin: 50% 50%;
      //   }
      // }
      // .el-menu {
      //   height: 100%;
      // }
    }
  }
}
</style>
<style lang="less">
.el-scrollbar__wrap {
  overflow-x: hidden;
  overflow-y: auto;
}
.el-scrollbar__view {
  height: 100%;
}
.el-scrollbar__bar.is-horizontal {
  display: none;
}
</style>