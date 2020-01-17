<!--工位页面-->
<template>
	<div class="workstation">
		<InputCon :label="label" @showData="showData" />
		<div id="schart">
			<Schart v-if="schart1" :headTitle="schartName1" :id="id1" :chartType="type1" :label="label1" :data="data1" :stationId='stationId' :wordType='wordType'/>
			<Schart v-if="schart2" :headTitle="schartName2" :id="id2" :chartType="type2" :label="label2" :data="data2" :stationId='stationId' :wordType='wordType'/>
		</div>
		<div class="workStationList">
			<h1 @click="showList = !showList" style="cursor: pointer;">详细列表</h1>
			<div class="list" v-show="showList">
				<TableList :workstation="workstation" :total="total" :tableData="tableDatas" @changeData="changeData" />
			</div>
		</div>
	</div>
</template>
<script>
	import Schart from "@/components/Schart.vue";
	import InputCon from "@/components/InputCon.vue";
	import TableList from "@/components/TableList.vue";
	import * as api from "@/common/api.js";
	import * as $ui from "@/common/ui.js";
	let moment = require("moment");
	export default {
		name: "workstation",
		components: {
			Schart,
			InputCon,
			TableList
		},
		created: function() {},
		data() {
			return {
				schartName1: "主要产品推荐次数",
				schartName2: "推荐趋势",
				label: [{
					text: "工位号 ",
					placeholder: "请输入工位号"
				}],
				form: {
					startTime: "",
					endTime: "",
					desc: ""
				},
				workstation: true, //确定是工位
				total: 0, //默认数据总数
				pagesize: 10, //默认每页的数据条数
				currentPage: 1, //默认开始页面
				wordType:'1',//给Schart一个标识，0为产品页，1为工位页
				stationId:'',//给Schart的默认值：产品，工位
				showList: true, //展示下面的列表TableList
				tableDatas: [], //给列表的数据
				tableData: {
					pageSize: "",
					currentPage: ""
				}, //会从子组件拿到这个数据，并改变值→再下面changeData
				type1: "bar", //图表类型，柱状图
				id1: "chart1", //柱状图id
				id2: "chart2", //折线图id
				schart1: false, //是否显示图1
				schart2: false, //是否显示图2
				type2: "line", //图表类型，折线图
				label1: [], //给图1的label
				label2: [], //给图2的label
				data1: [{
					label: "次数",
					fillColor: "rgba(25,170,141,0.9)",
					data: []
				}],
				data2: [{
					label: "次数",
					fillColor: "rgba(25,170,141,0.9)",
					data: []
				}], //给图2的data
			};
		},
		watch: {
			/*监听TableList传过来的数值*/
			tableData(val) {
				//从TableList传过来的数值变化触发
				this.pageSize = val.pageSize;
				this.currentPage = val.currentPage;
				this.getTableList({
					pageNo: val.currentPage,
					pageSize: val.pageSize
				})
			},
			/*监听从InputCon传过来的数值*/
			form(val) {
				////////////////////////////////////////
				//判断其中的值：都分别查哪些
				if(val.desc && val.startTime && val.endTime) {
					//工号，起始/终止时间
					const _arry = {
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
						stationId: val.desc,
						startTime: val.startTime,
						endTime: val.endTime
					};
					this.getAllSource(_arry);
				} else if(val.desc) {
					//只有工号
					const _arry = {
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
						stationId: val.desc,
					};
					this.getAllSource(_arry);
				} else if(val.startTime && val.endTime) {
					//只有起始/终止时间
					const _arry = {
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
						startTime: val.startTime,
						endTime: val.endTime
					};
					this.getAllSource(_arry);
				} else {
					//查询全部
					const _arry = {
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
					};
					this.getAllSource(_arry);
				}
				////////////////////////////////////////
			},
		},
		mounted() {
			const _arry = {
				workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
			};
			this.getAllSource(_arry);
		},
		methods: {
			/*从子组件TableList过来的data：修改页码和页数，这个修改会被监听*/
			changeData(data) {
				this.tableData = {
					pageSize: data.pageSize,
					currentPage: data.currentPage
				};
			},
			/*给TableList查询资源*/
			getTableList(_arry) {
				api.getWorkStationSource(_arry).then(res => {
					if(res.code == '0') {
						//table列表
						for(let i = 0; i < res.data.graphDPage.list.length; i++) {
							res.data.graphDPage.list[i].date = moment(res.data.graphDPage.list[i].date).format('MM-DD')
						}
						this.tableDatas = res.data.graphDPage.list;
					} else {
						$ui.warnMsg(res.message);
					}
				}).catch(err => {
					console.log(err);
				});
			},
			/*本页面所有资源*/
			getAllSource(_arry) {
				//从后台拿图表的资源
				api.getWorkStationSource(_arry).then(res => {
						if(res.code == '0') {
							this.stationId = res.data.stationId;
							//table列表
							this.total = res.data.graphDPage.total;
							for(let i = 0; i < res.data.graphDPage.list.length; i++) {
								res.data.graphDPage.list[i].date = moment(res.data.graphDPage.list[i].date).format('MM-DD')
							}
							this.tableDatas = res.data.graphDPage.list;
							//折线图
							this.label2 = [];
							this.data2[0].data = [];
							for(let i = 0; i < res.data.graphTList.length; i++) {
								res.data.graphTList[i].date = moment(
									res.data.graphTList[i].date
								).format("MM-DD");
								this.data2[0].data.push(res.data.graphTList[i].num);
								this.label2.push(res.data.graphTList[i].date);
								this.schart1 = true;
							}
							//柱状图
							this.label1 = [];
							this.data1[0].data = [];
							for(let i = 0; i < res.data.graphPList.length; i++) {
								this.data1[0].data.push(res.data.graphPList[i].num);
								this.label1.push(res.data.graphPList[i].word);
								this.schart2 = true;
							}
						} else {
							$ui.warnMsg(res.message);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			/*从头部InputCon里拿到的数值，这个修改会被监听*/
			showData(data) {
				var number = data.number;
				var startDate = data.startDate;
				var endDate = data.endDate;
				this.form = {
					startTime: startDate,
					endTime: endDate,
					desc: number
				};
			}
		}
	};
</script>
<style lang="less" scoped>
	.workstation {
		margin-bottom: 20px;
		padding: 5px;
		overflow: hidden;
		#schart {
			display: flex;
			width: 100%;
			overflow: hidden;
			justify-content: flex-start;
			flex-wrap: wrap;
			.schart {
				margin-right: 10px;
			}
		}
		.workStationList {
			width: 100%;
			h1 {
				padding: 15px 0px;
				border-top: 1px solid rgba(213, 213, 213, 0.5);
				border-bottom: 1px solid rgba(213, 213, 213, 0.5);
			}
			.list {
				text-align: center;
				.el-pagination {
					padding: 15px 0;
				}
				.el-table {}
			}
		}
	}
</style>