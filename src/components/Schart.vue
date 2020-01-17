<template>
	<div class="schart">
		<!--y轴坐标轴名称-->
		<span class="topLeft blue">{{topTile}}</span>
		<!--x轴坐标轴名称-->
		<span class="bottomRight blue">{{bottomTile}}</span>
		<el-collapse v-model="activeName">
			<el-collapse-item name='1'>
				<template slot='title'>
					<p class="title">
						{{wordDesc}} {{stationId}}
						{{headTitle}}
					</p>
				</template>
				<div class="canvas-wrapper">
					<canvas :id="canvasId" class="sChartClass"></canvas>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>
	import Schart from 'schart.js';
	export default {
		name: 'schart',
		props: {
			id: {
				type: String
			},
			headTitle: {
				type: String
			},
			chartType: {
				type: String,
			},
			label: {
				type: Array
			},
			data: {
				type: Array
			},
			stationId:{
				type:String
			},
			wordType:{
				type:String
			}
		},
		data() {
			return {
				wordDesc:'',
				topTile: 'y轴', //y轴注释
				bottomTile: 'x轴', //x轴注释
				activeName: ['1'], //collapse强制需要，
				canvasId: this.id, //Schart这个图表的id
			}
		},
		watch: {
			//监听传过来的值：变化的话就重新定义Schart图表
			label(val) {
				this.init();
			},
		},
		mounted() {
			//初始化自定义Schart图表
			this.init();
		},
		methods: {
			/*初始化方法*/
			init() {
				if(this.headTitle == '主要产品推荐次数'){
					this.topTile = '次数';
					this.bottomTile = '产品';
				}else if(this.headTitle == '推荐次数'){
					this.topTile = '次数';
					this.bottomTile = '工位';
				}else{
					this.topTile = '次数';
					this.bottomTile = '日期';
				}
				
				if(this.wordType == '0'){
					this.wordDesc = '产品'
				}else{
					this.wordDesc = '工位'
				}
				
				const options = {
					type:this.chartType,
					labels:this.label,
					datasets:this.data,
					gridColor:'lightgray',
					xRorate:45,
					bottomPadding:90
				};
				new Schart(this.id, options);
			},
		},
		updated(){
		},
		mounted() {
			this.init();
		},
	}
</script>

<style lang="less" scoped="scoped">
.el-collapse-item__header{
	height: 30px !important; 
}
	.schart {
		position: relative;
		overflow: hidden;
		.blue {
			border: none;
			position: absolute;
			z-index: 1001;
			font-size: 10px;
		}
		.topLeft {
			left: 25px;
			top: 80px;
		}
		.bottomRight {
			bottom: 60px;
			right: 20px;
		}
		.el-collapse {
			width: 100%;
			.el-collapse-item {
				width: 100%;
				position: relative;
				padding-right: 20px;
				.canvas-wrapper {
					border-top: 1px solid lightgray;
					width: 100%;
					canvas {
						width: 80vw !important;
						height: 300px !important;
					}
					.sChartClass{
						/*width: 100% !important;*/
						height: 350px !important;
					}
				}
				.title {
					font-weight: bolder;
					font-size: 12px;
				}
				.header-icon {
					position: absolute;
					right: 10px;
					color: red;
					z-index: 1001;
				}
				.el-collapse-item__arrow {
					margin-left: 50px;
				}
			}
		}
	}
</style>