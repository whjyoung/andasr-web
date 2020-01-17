<!--登录组件-->
<template>
  <div class="login">
    <div class="container">
      <h3>中国移动-语音质检</h3>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item prop="tel">
          <el-input
            clearable
            prefix-icon="el-icon-user-solid"
            type="text"
            v-model="ruleForm.tel"
            placeholder="请输入手机号"
            auto-complete="off"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input
            clearable
            prefix-icon="el-icon-lock"
            v-model="ruleForm.pwd"
            placeholder="请输入密码"
            type="password"
            auto-complete="off"
            @keyup.enter.native="toLogin('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="toLogin('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import * as api from "@/common/api.js";
import * as $ui from "@/common/ui.js";
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        tel: "", //手机号
        pwd: "" //密码
      },
      rules: {
        tel: [
          { required: true, message: "请输入手机号", trigger: "change" },
          { // 正则验证手机号
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "change"
          }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 6, max: 16, message: "长度在6到16个字符", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    toLogin(ruleForm) {
      //登录
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          //请求登录接口
          api.login(this.ruleForm)
            .then(res => {
              if (res.code === 0) {
                sessionStorage.setItem("login", JSON.stringify(res.data));
                this.$router.push("/");
              } else {
                $ui.warnMsg(res.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/styles/base.less";
.login {
  width: 100%;
  height: 100%;
  .flex-row(space-around);
  background: #2d3a4b;
  .container {
    width: 350px;
    text-align: center;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    h3 {
      font-size: 28px;
    }
    .el-form {
      .el-input__inner {
        width: 100% !important;
      }
      .el-input__icon {
        font-size: 16px;
      }
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>