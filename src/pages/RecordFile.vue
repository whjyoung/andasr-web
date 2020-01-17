<!--录音文件页面-->
<template>
	<div class="record_file">
		<InputCon :label="label" @showData="showData" />
		<el-table id="table" v-if="tableShow" :data="jobNumList" border style="width:99%" :header-cell-style="{color:'#333',fontSize:'14px',fontWeight:'bold'}" :row-style="{fontSize:'14px',color:'#666'}">
			<el-table-column prop="stationId" label="工位号" align="center" width></el-table-column>
			<el-table-column width label="操作" align="center">
				<template slot-scope="scope">
					<span class="red" @click="checkAudio(scope.row.stationId)">查看录音</span>
					<el-button disabled round :id="loading(scope.row.stationId)" class="loader" type="success" icon="el-icon-loading">被选中</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog id="dialog" title="录音文件" :visible.sync="dialogVisible">
			<el-table :data="infoList.slice((currentPage-1)*pageSize,currentPage*pageSize)" id="diaTable" border style="width:99%" :header-cell-style="{color:'#333',fontSize:'14px',fontWeight:'bold'}" :row-style="{fontSize:'14px',color:'#666'}">
				<el-table-column label="时间 " width prop="createTime" align="center"></el-table-column>
				<el-table-column label="录音列表" class="luyin" width align="center">
					<template slot-scope="scope">
						<audio class="audioItem" @play="audioPlay()" :src="scope.row.filePath" controls="controls">亲 您的浏览器不支持html5的audio标签</audio>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="block">
				<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" @size-change="handleSizeChange" layout="total, prev, pager, next, jumper" :total="infoList.length"></el-pagination>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	let moment = require("moment");
	import * as $ui from "@/common/ui.js";
	import * as api from "@/common/api.js";
	import InputCon from "@/components/InputCon.vue";
	import TableList from "@/components/TableList.vue";
	export default {
		name: "record_file",
		components: {
			InputCon,
			TableList
		},
		data() {
			return {
				currentPage: 1, //当前显示第几页 --默认第一页
				pageSize: 5, //每页显示的条数
				checkAudioer: -1, //‘查看录音’按钮点击触发,点击不同的‘查看录音’按钮：值变化被监听
				label: [{
					text: "工位号 ",
					placeholder: "请输入工位号"
				}], //传给子组件InputCon
				dialogVisible: false, //是否显示模态框
				tableShow: true, //是否显示列表
				jobNumList: [], //所有工号
				infoList: [], //选定工号下的所有录音列表
				form: {
					startTime: "",
					endTime: "",
					desc: ""
				}, //自定义json，接收InputCon的值
			};
		},
		mounted() {
			//初始化数据
			this.getAllJobNum();
		},
		watch: {
			/*监听form变化：从InputCon传过来的数值变化触发查询方法*/
			form(val) {
				this.checkAudioer = -1; //让checkAudioer恢复源数据
				this.getAllJobNum();
				this.currentPage = 1; //当前显示第几页 --默认第一页
				this.pageSize = 5; //每页显示的条数
				//暂停所有播放
				var audioser = document.getElementsByClassName("audioItem");
				[].forEach.call(audioser, function(i) {
					i.pause();
					i.currentTime = 0;
				});
				//隐藏所有loading图标
				const loadings = document.getElementsByClassName("loader");
				for(var i = 0; i < loadings.length; i++) {
					loadings[i].style.display = "none";
				}
			},
			/*监听checkAudioer变化:如果点击不同的‘查看录音’按钮，就重新绑定'录音列表'数据*/
			checkAudioer(val) {
				this.currentPage = 1; //当前显示第几页 --默认第一页
				this.pageSize = 5; //每页显示的条数
				///////////////////////////////////////////////////////////////
				//判断内容
				if(val && this.form.startTime && this.form.endTime) {
					//工号，起始/终止时间
					const _arry = {
						stationId: val,
						startDateTime: this.form.startTime,
						endDateTime: this.form.endTime,
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
					};
					this.getAllRecord(_arry);
				} else if(val) {
					//只有工号
					const _arry = {
						stationId: val,
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
					};
					this.getAllRecord(_arry);
				} else if(this.form.startTime && this.form.endTime) {
					//只有起始/终止时间
					const _arry = {
						stationId: val,
						startDateTime: this.form.startTime,
						endDateTime: this.form.endTime,
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
					};
					this.getAllRecord(_arry);
				} else {
					//查询全部
					const _arry = {
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
					}
					this.getAllRecord(_arry);
				}
				///////////////////////////////////////////////////////////////
			}
		},
		methods: {
			/*获得指定录音文件*/
			getAllRecord(_array) {
				//查询到的所有录音文件：_index是‘工号’
				this.infoList = []; //先清空，再赋值
				api.getRecord(_array)
					.then(res => {
						if(res.code == "0") {
							if(res.data[0].filePage.list != null) {
								for(let i = 0; i < res.data[0].filePage.list.length; i++) {
									res.data[0].filePage.list[i].createTime = moment(
										res.data[0].filePage.list[i].createTime
									).format("YYYY-MM-DD");
									if(res.data[0].filePage.list[i].fileIntactPath == "") {
										res.data[0].filePage.list[i].fileIntactPath =
											"http://192.168.111.57:9000/api/tmp/TelRecData/20191225/1/20191225-111921-1-o-000490-N--P-S.wav";
									} else {
										res.data[0].filePage.list[i].fileIntactPath =
											"http://192.168.111.57:9000/api" +
											res.data[0].filePage.list[i].fileIntactPath;
									}
								}
								this.infoList = res.data[0].filePage.list;
								this.dialogVisible = true;
							} else {
								//								this.dialogVisible = false;
							}
						} else {
							$ui.warnMsg(res.message);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			/*公共的查询组件：查询工号list*/
			getJobNum(_arry) {
				api.getRecord(_arry)
					.then(res => {
						if(res.code == '0') {
							this.jobNumList = res.data;
						} else {
							$ui.warnMsg(res.message);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			/*被调用的查询方法：全查 或 根据条件查*/
			getAllJobNum() {
				//查询所有的工号
				if(this.form.desc) {
					const _arry = {
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
						stationId: this.form.desc
					};
					this.getJobNum(_arry);
				} else {
					const _arry = {
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
					}
					this.getJobNum(_arry);
				}
			},
			/*从头部InputCon里拿到的数值*/
			showData(data) {
				var number = data.number;
				var startDate = data.startDate;
				var endDate = data.endDate;
				this.form = {
					startTime: startDate,
					endTime: endDate,
					desc: number
				};
			},
			/*给动画播放图表加属性：显示*/
			loading(_key) {
				//			给标签加id
				const to = "audioLoader" + _key;
				return to;
			},
			/*同一时间只能播放一个audio*/
			singlePlay() {
				var audioser = document.getElementsByClassName("audioItem");

				function pauseAll() {
					var self = this;
					[].forEach.call(audioser, function(i) {
						i !== self && i.pause();
					});
				}
				[].forEach.call(audioser, function(i) {
					i.addEventListener("play", pauseAll.bind(i));
				});
			},
			/*在audio播放时绑定了：结束时播放下一首*/
			audioPlay() {
				const audios = document.getElementsByClassName("audioItem");
				for(let i = 0; i < audios.length; i++) {
					audios[i].addEventListener(
						"ended",
						function() {
							var _next = audios[i + 1];
							audios[i].ended;
							//					_next.play();
						},
						false
					);
				}
				this.singlePlay(); //绑定单一播放
			},
			/*给播放列表赋值*/
			checkAudio(_index) {
				this.checkAudioer = _index; //改变checkAudioer的值，会被监听
				//播放时的loading：播放中 徽章
				const loadings = document.getElementsByClassName("loader");
				for(var i = 0; i < loadings.length; i++) {
					loadings[i].style.display = "none";
				}
				var audioLoader = document.getElementById("audioLoader" + _index);
				audioLoader.style.display = "inline-block"; //显示按钮后面的动画效果
				///////////////////////////////////////////////////////////////
				this.dialogVisible = true;
			},
			/*当前页码  变化*/
			handleCurrentChange(val) {
				//暂停所有播放
				var audioser = document.getElementsByClassName("audioItem");
				[].forEach.call(audioser, function(i) {
					i.pause();
					i.currentTime = 0;
					//						i.addEventListener("pause", pauseAll.bind(i));
				});
				this.currentPage = val;
			},
			/*每页的长度  变化*/
			handleSizeChange(val) {
				this.pageSize = val;
			}
		}
	};
</script>
<style lang="less" scoped>
	.block {
		text-align: center;
		margin-top: 20px;
	}
	
	//列表样式修改
	.red {
		cursor: pointer;
		color: red;
	}
	
	.table_list,
	#table {
		margin-bottom: 40px;
		.el-table__header-wrapper th {
			background-color: rgb(243, 247, 251);
		}
		.el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 40px;
		}
		.el-table td {
			padding: 8px 0 !important;
		}
	}
	
	.cell {
		display: flex;
		justify-content: space-around;
		flex-wrap: nowrap;
		.loader {
			padding: 5px 7px;
			display: none;
			font-size: 8px;
		}
	}
	
	.el-table__body {
		width: 100% !important;
	}
	
	.el-table__row {
		width: 150% !important;
	}
	
	.audioItem {
		width: 100%;
	}
</style>
<style lang="less">
	//列表样式修改
	#diaTable {
		height: 460px !important;
	}
	
	.table_list,
	#table,
	#diaTable {
		.el-table__header-wrapper {
			.el-table__header {
				width: 100%;
				.has-gutter {
					tr {
						th {
							background-color: rgb(243, 247, 251) !important;
						}
					}
				}
			}
		}
		.el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 40px;
		}
		.el-table td {
			padding: 8px 0 !important;
		}
	}
	
	//分页样式修改
	.block .el-pagination .el-select .el-input .el-input__inner {
		width: 100px;
	}
	
	.el-pagination__editor.el-input .el-input__inner {
		width: 46px;
	}
	
	.el-scrollbar__wrap {
		margin-bottom: 0px !important;
	}
</style>