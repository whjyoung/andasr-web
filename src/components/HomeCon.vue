<template>
  <div class="homeCon">
    <el-row>
      <el-col :span="8">
        <div class="kind">
          <div class="text">产品种类（种）</div>
          <div class="number">
            <span>{{productKind}}</span>种
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="count">
          <div class="text">推荐产品次数（次）</div>
          <div class="number">
            <span>{{recommendNum}}</span>次
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="home_bottom">
      <el-col :span="8">
        <div class="hot_product">
          <div class="text">热门产品推荐占比</div>
          <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
        </div>
      </el-col>
      <el-col :span="15" class="bottom_right">
        <div class="hot_product">
          <div class="text">工位推荐排名</div>
          <div id="mysChart" :style="{width: '100%', height: '300px'}"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie"); // 引入饼状图组件
require("echarts/lib/chart/bar"); // 引入柱状图组件
require("echarts/lib/component/legend"); //引入图例
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  name: "homeCon",
  props: {
    productKind: Number, // 产品种类
    recommendNum: Number, // 推荐次数
    recommendPro: Array, // 热门产品推荐占比
    recommendRank: Array, // 工位推荐排名
    legendPro: Array, //热门产品推荐图例
    yRankData: Array, //工位推荐排名y轴数据
    xRankData: Array //工位推荐排名x轴数据
  },
  data() {
    return {};
  },
  methods: {
    initHotProduct() {
      var myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        // color: ["#516EFF","#FFD54F","#FF4E8F","#5FFF91","#FF4F4A","#2f4554",
        //   "#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a","#6e7074",
        //   "#546570","#c4ccd3"],
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          // 图例
          orient: "vertical",
          left: "left",
          // icon: "circle",
          // data: ["5G", "宽带", "全球通", "积分兑换"],
          data: this.legendPro,
          textStyle: {
            color: "#000"
          }
        },
        series: [
          {
            // name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.recommendPro,
            // data: [
            //   { value: 12.0, name: "5G" },
            //   { value: 9.0, name: "宽带" },
            //   { value: 21.0, name: "全球通" },
            //   { value: 58.0, name: "积分兑换" }
            // ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    initRecommendData() {
      var mysChart = echarts.init(document.getElementById("mysChart"));
      mysChart.setOption({
        color: ["#30b298"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["推荐次数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        yAxis: [
          //工位号
          {
            type: "category",
            // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            data: this.yRankData,
            axisTick: {
              alignWithLabel: true
            },
            name: "工位号",
            nameTextStyle: {
              fontSize: 10,
              padding: [0, 0, -10, 0]
            },
            axisTick: {
              //y轴刻度线
              show: false
            }
            //     splitLine: { //是否显示风格线
            //       show: true,
            //       lineStyle:{
            //         color: ['#315070'],
            //         width: 1,
            //         type: 'solid'
            //       }
            // 　　}
          }
        ],
        xAxis: [
          // 推荐次数
          {
            type: "value",
            name: "次数",
            nameTextStyle: {
              fontSize: 10,
              padding: [0, 0, 0, -10]
            },
            axisTick: {
              //x轴刻度线
              show: false
            },
            // splitLine: {
            //   //是否显示风格线
            //   show: true,
            //   lineStyle: {
            //     color: ["#315070"],
            //     width: 1,
            //     type: "solid"
            //   }
            // },
            // splitLine: {
            //   //网格线
            //   show: false
            // }
          }
        ],
        series: [
          {
            name: "推荐次数",
            type: "bar",
            barWidth: "60%",
            // data: [10, 52, 200, 334, 390, 330, 220]
            data: this.xRankData
          }
        ]
      });
    }
  },
  watch: {
    // 监听数据是否有值 由于 数据是动态改变的，mounted里获取不到
    legendPro(newVal, oldVal) {
      console.log(newVal);
      this.initHotProduct();
      this.initRecommendData();
    }
  }
};
</script>

<style lang="less" scoped="scoped">
@import "~@/styles/base.less";
.homeCon {
  .kind,
  .count {
    padding: 20px 0;
    box-shadow: 0px 0px 6px 4px #eeeeee82;
    margin: 5px;
    .text {
      font-weight: bold;
      color: #1a1a1a;
      font-size: 15px;
      text-indent: 14px;
      margin-bottom: 20px;
      .border-bottom(1px, #f1f1f1);
      padding-bottom: 10px;
    }
    .number {
      text-align: center;
      span {
        font-size: 30px;
        color: #409eff;
        margin-right: 5px;
      }
    }
  }
  .count {
    margin-left: 20px;
  }
  .home_bottom {
    margin-top: 40px;
    .bottom_right {
      margin-left: 10px;
    }
    .text {
      font-weight: bold;
      color: #1a1a1a;
      font-size: 15px;
      // border-left: 5px solid #409eff;
      text-indent: 14px;
      margin-bottom: 20px;
      .border-bottom(1px, #f1f1f1);
      padding-bottom: 10px;
    }
  }
}
</style>