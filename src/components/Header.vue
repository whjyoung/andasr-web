<!--头部组件-->
<template>
  <div class="headerbar">
    <el-header>
      <div class="logo">
        <img src="@/assets/imgs/logo.png" alt />
      </div>
      <div class="header_right">
        <el-dropdown size="small">
          <span class="el-dropdown-link">
            <i class="el-icon-user-solid"></i>
            <span>{{username}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
  </div>
</template>
<script>
import * as $ui from "@/common/ui.js"; //公用弹出框
export default {
  name: "headerbar",
  data() {
    return {
      username: JSON.parse(sessionStorage.getItem("login")).realName // 登录用户
    };
  },
  methods: {
    logout() {
      //退出登录
      $ui.confirm("确定要退出登录吗?")
        .then(res => {
          //确定
          this.$router.push("/login");
          sessionStorage.removeItem("login");
        })
        .catch(err => {
          //取消
          console.log("取消");
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/styles/base.less";
.el-header {
  position: absolute;
  background: #dedfe059;
  width: 100%;
  height: 70px !important;
  z-index: 111;
  .flex-row(space-between);
  .header_right {
    .el-dropdown {
      cursor: pointer;
      .el-icon-user-solid {
        font-size: 18px;
      }
    }
  }
}
</style>