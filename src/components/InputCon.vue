<!--公用的输入框组件-->
<template>
	<div class="input_con">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item v-for="(item,index) in label" :key="index" :label="item.text">
				<!--输入值:工位号 / 产品-->
				<el-input size="small" v-model="formInline.number" :placeholder="item.placeholder" clearable></el-input>
			</el-form-item>
			<!-- 是否显示日期 -->
			<el-form-item label="查询日期">
				<!--开始时间-->
				<el-date-picker size="small" v-model="formInline.startDate" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd"></el-date-picker>
				<span>至</span>
				<!--结束时间-->
				<el-date-picker size="small" v-model="formInline.endDate" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="search">查询</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	export default {
		name: "input_con",
		props: {
			label: Array
		},
		data() {
			return {
				formInline: {
					number: "", //工位号	 or  产品
					startDate: "", //起始时间
					endDate: "" //终止时间
				}
			};
		},
		methods: {
			search() {
				//数据传给父组件
				this.$emit("showData", this.formInline);
			}
		}
	};
</script>
<style lang="less" scoped>

</style>
<style lang="less">
	.input_con {
		.el-form {
			.el-form-item {
				.el-form-item__label {
					padding: 0 5px 0 0;
				}
				.el-form-item__content {
					.el-input {
						width: 160px;
					}
				}
			}
		}
	}
</style>