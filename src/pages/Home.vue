<template>
  <div class="home">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tabs" :key="index" :label="item.label" :name="item.name">
        <!-- 加上v-if避免第二个tab页加载不出echarts -->
        <HomeCon
          v-if="item.name === activeName"
          :productKind="productKind"
          :recommendNum="recommendNum"
          :recommendPro="recommendPro"
          :recommendRank="recommendRank"
          :legendPro="legendPro"
          :xRankData="xRankData"
          :yRankData="yRankData"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import HomeCon from "@/components/HomeCon.vue";
import * as api from "@/common/api.js";
import * as $ui from "@/common/ui.js";
export default {
  components: {
    HomeCon
  },
  name: "home",
  data() {
    return {
      workplaceId:
        JSON.parse(sessionStorage.getItem("login")).workplaceId || "", //营业厅id
      activeName: "first",
      tabs: [
        {
          label: "最近一天",
          name: "first"
        },
        {
          label: "最近七天",
          name: "second"
        },
        {
          label: "最近一个月",
          name: "third"
        }
      ],
      productKind: 0, // 产品种类
      recommendNum: 0, // 推荐次数
      recommendPro: [], // 热门产品推荐占比
      recommendRank: [], // 工位推荐排名
      legendPro: [], //热门产品推荐图例
      yRankData: [], //工位推荐排名y轴数据
      xRankData: [] //工位推荐排名x轴数据
    };
  },
  mounted() {
    //默认获取最近一天的数据
    this.initData("DAY");
  },
  methods: {
    handleClick(tab, event) {
      switch (tab.name) {
        case "first":
          this.initData("DAY");
          break;
        case "second":
          this.initData("SEVENDAY");
          break;
        default:
          this.initData("MONTH");
          break;
      }
    },
    initData(val) {
      //val: 最近一天 // 最近七天 // 最近一个月
      // 清空数据先
      this.productKind = 0;
      this.recommendNum = 0;
      this.recommendPro = [];
      this.recommendRank = [];
      this.legendPro = [];
      this.xRankData = [];
      this.yRankData = [];
      // 请求接口
      api.getHomeData({
          workplaceId: this.workplaceId,
          statisticCondition: val
        })
        .then(res => {
          console.log(res);
          if (res.code === 0) {
            this.productKind = res.data.productKind;
            this.recommendNum = res.data.recommendNum;
            this.recommendPro = res.data.recommendPro; //热门产品推荐对比
            let proPercentList = []; // 热门产品推荐对比新数组
            this.recommendPro.forEach(item => {
              this.legendPro.push(item.product); // 产品图例数据
              // 修改产品推荐数据里的key值-》饼图使用
              proPercentList.push({ name: item.product, value: item.num });
              this.recommendPro = proPercentList;
            });
            this.recommendRank = res.data.recommendRank; //工位推荐排名
            this.recommendRank.forEach(item => {
              this.xRankData.push(item.num); // x轴次数
              this.yRankData.push(item.stationId); //y轴工位号
            });
          } else {
            $ui.warnMsg(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
</style>
<style lang="less">
</style>