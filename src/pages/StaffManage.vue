<!--员工管理页面-->
<template>
  <div class="staff_manage">
    <!-- 搜索员工内容 -->
    <div class="top_con">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input
            type="text"
            size="small"
            v-model="formInline.realName"
            placeholder="请输入员工姓名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input
            type="number"
            size="small"
            v-model="formInline.clerkId"
            placeholder="请输入工号"
            clearable
            @mousewheel.native.prevent
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search">查询</el-button>
          <el-button type="danger" size="small" @click="showDialog = true">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 员工列表 -->
    <div class="staff_list">
      <h4>员工列表</h4>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.1)"
        :data="staffList"
        border
        style="width:99%"
        :header-cell-style="{color:'#333',fontSize:'14px',fontWeight:'bold'}"
        :row-style="{fontSize:'14px',color:'#666'}"
      >
        <el-table-column align="center" prop="realName" label="员工姓名"></el-table-column>
        <el-table-column align="center" prop="clerkId" label="工号"></el-table-column>
        <el-table-column align="center" prop="stationId" label="工位号"></el-table-column>
        <el-table-column align="center" prop="tel" label="手机号码"></el-table-column>
        <el-table-column align="center" prop="workplaceName" label="营业厅"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="delClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增员工信息弹出框 -->
    <div class="dialog_con">
      <el-dialog title="新增" :visible.sync="showDialog" :close-on-click-modal="false" @close="handleClose">
        <el-form :model="ruleForm" label-width="100px" :rules="rules" ref="ruleForm">
          <el-form-item label="员工姓名" prop="realName">
            <el-input
              clearable
              v-model="ruleForm.realName"
              autocomplete="off"
              placeholder="请输入员工姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="tel">
            <el-input
              clearable
              v-model="ruleForm.tel"
              maxlength="11"
              autocomplete="off"
              placeholder="请输入员工手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="工位号" prop="stationId">
            <el-select filterable clearable v-model="ruleForm.stationId" placeholder="请选择工位号">
              <el-option
                v-for="(item,index) in stationList"
                :key="index"
                :label="item.selectName"
                :value="item.selectId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmMsg('ruleForm')">确 定</el-button>
          <el-button type="danger" @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as $ui from "@/common/ui.js";
import * as api from "@/common/api.js";
import * as utils from "@/common/utils.js"; // 工具类
export default {
  name: "staff_manage",
  data() {
    return {
      workId: JSON.parse(sessionStorage.getItem("login")).workplaceId || "", //营业厅id
      showDialog: false, //默认不显示弹出框
      loading: false, //默认不加载效果
      formInline: {
        realName: "", //员工姓名
        clerkId: "" // 工号
      },
      ruleForm: {
        //弹出框里的员工信息
        realName: "", //姓名
        tel: "", // 电话
        stationId: "" // 工位号id
      },
      rules: {
        realName: [
          { required: true, message: "请输入员工姓名", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "请输入员工手机号码", trigger: "blur" },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "change"
          }
        ],
        stationId: [
          { required: true, message: "请选择工位号", trigger: "blur" }
        ]
      },
      staffList: [], //员工列表
      stationList: [] // 工位号列表
    };
  },
  mounted() {
    //获取员工列表
    this.getAllStaff();
    //获取工位号列表
    this.getStationList();
  },
  methods: {
    delClick(item) {
      //删除某个员工
      $ui.confirm("确定要删除当前员工的信息吗？")
        .then(res => {
          //确定 调用删除接口
          api.delStaff({ clerkId: item.clerkId })
            .then(res => {
              console.log(res);
              if (res.code === 0 && res.data === true) {
                this.getAllStaff(); //删除成功，获取所有员工列表
              } else {
                $ui.warnMsg(res.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    search() {
      //查询 判断输入框是否有值，无-》默认列表 有-》请求查询接口 工号
      if (this.formInline.realName || this.formInline.clerkId) {
        let data = {
          realName: this.formInline.realName,
          clerkId: this.formInline.clerkId,
          workplaceId: this.workId
        };
        api.getStaffList(data)
          .then(res => {
            if (res.code === 0) {
              this.staffList = res.data;
              // 清空输入栏的数据
              utils.initObject(this.formInline);
            } else {
              $ui.warnMsg(res.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log("无值");
        this.getAllStaff();
      }
    },
    confirmMsg(ruleForm) {
      // 新增员工 -》 确定信息对接接口传参数
      this.$refs[ruleForm].validate(valid => {
        let data = {
          realName: this.ruleForm.realName,
          tel: this.ruleForm.tel,
          selectId: this.ruleForm.stationId,
          workplaceId: this.workId
        };
        if (valid) {
          api.addStaff(data)
            .then(res => {
              if (res.code === 0 && res.data === true) {
                this.showDialog = false; // 隐藏弹出框
                utils.initObject(this.ruleForm); // 清空输入值
                this.getAllStaff();
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
    },
    cancel() {
      // 取消 新增员工
      this.showDialog = false; //隐藏弹框
      utils.initObject(this.ruleForm); // 清空输入值
      this.getAllStaff();
    },
    getAllStaff() {
      // 员工列表
      this.loading = true; //显示加载效果
      api.getStaffList({
          workplaceId: this.workId
        })
        .then(res => {
          if (res.code === 0) {
            this.staffList = res.data;
            this.loading = false; // 获取成功后隐藏loading
          } else {
            $ui.warnMsg(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getStationList() {
      // 工位号列表
      api.getStationList({ workplaceId: this.workId })
        .then(res => {
          console.log(res);
          if (res.code === 0) {
            this.stationList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleClose(){ //弹框关闭'x',清空输入内容
      console.log(111)
      utils.initObject(this.ruleForm);
    }
  }
};
</script>
<style lang="less" scoped>
.staff_manage {
  .staff_list {
    h4 {
      margin: 10px 0 15px 0;
    }
  }
}
</style>
<style lang="less">
.top_con {
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form-item__label {
    padding: 0 5px 0 0;
  }
  .el-input__inner {
    width: 160px;
  }
  /*------------------------修改type=number的样式------------------------------------------------*/
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
.staff_list {
  .el-table__header-wrapper th {
    background-color: rgb(243, 247, 251);
  }
  .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
  }
  .el-table td {
    padding: 6px 0 !important;
  }
}
.dialog_con {
  .el-select {
    width: 100%;
  }
  .el-dialog {
    border-radius: 10px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #eee !important;
  }
  .el-dialog__body {
    .el-form {
      width: 75%;
      margin: 0 auto;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
}
.el-select-dropdown__list {
  padding-bottom: 20px !important;
}
</style>