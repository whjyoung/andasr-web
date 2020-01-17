<!--公用的表格列表-->
<template>
	<div class="table_list">
		<el-table border :data="tableData" :header-cell-style="{color:'#333',fontSize:'14px',fontWeight:'bold'}" :row-style="{fontSize:'14px',color:'#666'}">
			<el-table-column align="center" prop="date" label="时间"></el-table-column>
			<!--传过来的值：要判断是 产品 还是 工位号  -->
			<el-table-column align="center" prop="word" label="产品" v-if="workstation"></el-table-column>
			<el-table-column align="center" prop="stationId" label="工位号" v-else></el-table-column>
			<el-table-column align="center" prop="num" label="推荐次数"></el-table-column>
		</el-table>
		<!-- 分页 -->
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
	</div>
</template>
<script>
	export default {
		name: "table_list",
		props: {
			workstation: Boolean, //true 工位页面列表  false 产品页面列表
			tableData: Array, //列表数据
			total: Number // 列表总数量
		},
		data() {
			return {
				currentPage: 1, //当前显示第几页 --默认第一页
				pageSize: 10 //每页显示的条数
			};
		},
		methods: {
			/*pageSize选择的条数 改变时会触发 并调api*/
			handleSizeChange(val) {
				this.pageSize = val;
				//到父组件调用api
				this.$emit("changeData", {
					pageSize: this.pageSize,
					currentPage: this.currentPage
				});
			},
			/*currentPage 当前页数改变时会触发 调取后台api  */
			handleCurrentChange(val) {
				//参数：页数，每页条数
				this.currentPage = val;
				//到父组件调用api
				this.$emit("changeData", {
					pageSize: this.pageSize,
					currentPage: this.currentPage
				});
			}
		}
	};
</script>
<style lang="less" scoped>
	.block {
		text-align: center;
		margin-top: 20px;
	}
</style>
<style lang="less">
	//列表样式修改
	.table_list {
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