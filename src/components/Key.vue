<template>
	<div class="keyApart">
		<div class="key_head">
			<span class="title">
				<!--关键词类型-->
				{{source.wordType}}
				<!--内部包含的关键字内容决定了是否显示close-->
				<i class="el-icon-close" @click="deleteTag(null,index,source.wordType,'big')" v-if='source.keyWords.length>0'></i>
			</span>
			<label class="add" @click="addTil" :for='hotKey'>添加<i class="el-icon-plus"></i></label>
		</div>
		<div class="key_body">
			<!--循环渲染这个类型下的关键词列表-->
			<el-tag v-for='(item,index) in source.keyWords' :class='loading(index)' class='tags' :key='index' type='info'>
				{{item.word}}
				<i class="el-icon-close" @click="deleteTag(item.wordId,index,null,'small')"></i>
			</el-tag>
		</div>
		<el-dialog id='dialog' title='新增产品' :visible.sync='dialogVisible'>
			<el-form>
				<el-form-item label='新增产品：'>
					<el-input v-model='formWord' placeholder='请输入产品' :id='hotKey'></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type='default' @click='onSubmit'>确定提交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import * as $ui from "@/common/ui.js";
	import * as api from "@/common/api.js";
	export default {
		name: 'key',
		props: {
			source: {
				type: Object
			},
			index: {
				type: Number
			},
			dia: {
				type: Boolean
			},
		},
		data() {
			return {
				hotKey: 'hotKey' + this.index, //关键词的id，
				dialogVisible: false, //关键词的遮罩层显示逻辑
				formWord: '', //关键词
			}
		},
		watch: {
			index(val) {}
		},
		mounted() {
			//修改关键词遮罩层：true或false
			this.dialogVisible = this.dia;
		},
		methods: {
			/*给class加tag：为了显示这个关键词*/
			loading(_key) {
				//给标签加
				const to = 'tag' + _key;
				return to;
			},
			/*输入关键词完毕，提交用*/
			onSubmit() {
				//判断输入的值是否为空并作逻辑处理
				if(this.formWord == '') {
					this.$message({
						type: 'warning',
						message: '热词不能为空！'
					});
				} else {
					//调用新增接口
					api.insertMainKey({
						workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
						wordType: this.source.wordType,
						word: this.formWord
					}).then(res => {
						console.log(res.data)
						if(res.code == '0') {
							this.$message({
								type: 'success',
								message: '热词添加成功！'
							});
							var arry = [this.index, this.source]; //定义数组
							this.$emit('addParent', arry); //传给父组件这个数组，父组件拿来渲染
							this.dialogVisible = false; //遮罩层消失
						} else {
							$ui.warnMsg(res.message);
						}
					}).catch(err => {
						console.log(err);
					});
					//给这个类型下添加一个关键词：先渲染，后台的事件会继续进行。
					this.source.keyWords.push({
						word: this.formWord
					});
					//新增结束后，调用父组件的查询方法来重载
					this.$emit('fatherMethod');
				}
			},
			/*展示模态框并清空input框*/
			addTil() {
				this.dialogVisible = true;
				this.formWord = '';
			},
			deleteTag(_id, _index, _name, _type) {
				if(_type == 'big') {
					//这里删除关键词类型
					$ui.confirm('是否删除该类型？').then(() => {
						api.deleteMainKey({
							workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
							wordType: _name
						}).then(res => {
							if(res.code == '0') {
								this.$emit('delBig', this.index); //传给父组件，页面渲染
								this.$message({
									type: 'success',
									message: '类型删除成功'
								});
							} else {
								$ui.warnMsg(res.message);
							}
						}).catch(err => {
							console.log(err);
						});
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				} else {
					//这里删除关键词
					$ui.confirm("是否删除该热词？").then(() => {
						api.deleteMainKey({
							workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId,
							wordId: _id //根据不同key来删除关键词
						}).then(res => {
							if(res.code == '0') {
								this.$message({
									type: 'success',
									message: '热词删除成功'
								});
								this.source.keyWords.splice(_index, 1); //这里的_index是索引值
								var arry = [this.index, this.source]; //定义新的资源数组
								this.$emit('toParent', arry); //给父组件，
							} else {
								$ui.warnMsg(res.message);
							}
						}).catch(err => {
							console.log(err);
						});
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				}
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.new {
		color: limegreen !important;
	}
	
	.title {
		position: relative;
		.el-icon-close {
			position: absolute;
			top: -2px;
			right: -4px;
			margin-left: 20px;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			background-color: rgba(255, 0, 0, 0.75);
			color: white;
			font-weight: bolder;
			font-size: 15px;
			display: flex;
			justify-content: center;
			align-items: center;
			align-content: center;
			transition: all linear 3s;
			display: none;
		}
	}
	
	.title:hover {
		.el-icon-close {
			display: flex;
		}
	}
	
	.keyApart {
		width: 100%;
		margin-bottom: 30px;
		.key_body {
			width: 94%;
			background-color: rgba(213, 213, 213, 0.2);
			padding: 15px 40px;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			.tags {
				padding: 0 15px;
				position: relative;
				display: flex;
				justify-content: center;
				align-content: center;
				align-items: center;
				font-size: 14px;
				margin-right: 3%;
				margin-bottom: 10px;
				height: 40px;
				color: darkslategrey;
				/*width: 16%;*/
				/*overflow: hidden;*/
				white-space: nowrap;
				text-overflow: ellipsis;
				.el-icon-close {
					position: absolute;
					top: -2px;
					right: -4px;
					margin-left: 20px;
					width: 20px;
					height: 20px;
					border-radius: 50%;
					background-color: rgba(255, 0, 0, 0.75);
					color: white;
					font-weight: bolder;
					font-size: 15px;
					display: flex;
					justify-content: center;
					align-items: center;
					align-content: center;
					transition: all linear 3s;
					display: none;
				}
			}
			.tags:hover {
				.el-icon-close {
					display: flex;
				}
			}
		}
		.key_head {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			align-content: center;
			span {
				height: 100%;
				padding: 10px 25px;
				font-size: 16px;
				font-weight: 600;
			}
			.title {
				background-color: rgb(196, 234, 234);
			}
			.add {
				color: rgb(0, 192, 192);
				margin-right: 20px;
			}
		}
	}
</style>