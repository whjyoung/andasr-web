<template>
<!-- 侧边栏 -->
  <div class="aside_bar">
    <el-aside :width="isCollapse?'60px':'200px'">
      <el-scrollbar style="height:100%;">
        <div class="menu_box">
          <el-menu
            :default-active="this.$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
            :collapse="isCollapse"
            :collapse-transition="true"
            router
          >
            <el-menu-item index="/">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="1" class="secondTab">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>推荐统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/recomStatic/workstation">工位</el-menu-item>
                <el-menu-item index="/recomStatic/product">产品</el-menu-item>
                <el-menu-item index="/recomStatic/servicehall">营业厅</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2" class="secondTab">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>后台管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/backManage/staffmanage">员工管理</el-menu-item>
                <el-menu-item index="/backManage/recordfile">录音文件</el-menu-item>
                <el-menu-item index="/backManage/keywords">关键词</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </el-scrollbar>
    </el-aside>
  </div>
</template>
<script>
export default {
  name: "aside_bar",
  props: {
    isCollapse: Boolean
  },
  mounted() {
  }
};
</script>
<style lang="less" scoped>
@import '~@/styles/base.less';
.aside_bar {
  height: 100%;
  .el-aside {
    height: 100%;
    transition: width 0.3s;
    .logo_box {
      height: 50px;
      .flex-row(space-evenly,center);
      position: absolute;
      width: 100%;
      top: 0;
      z-index: 999;
      background: rgb(84, 92, 100);
      img {
        width: 32px;
        height: 32px;
        vertical-align: middle;
      }
      h1 {
        display: inline-block;
        margin: 0;
        margin-left: -18px;
        font-weight: 600;
        line-height: 50px;
        font-size: 14px;
        vertical-align: middle;
      }
    }
    .menu_box,
    .el-menu {
      height: 100%;
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
.el-submenu .el-menu-item{
  padding-left: 50px !important;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>