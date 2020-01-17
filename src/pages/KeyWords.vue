<!--关键词页面-->
<template>
	<div class="key_words" id="keyWords">
		<Key v-for='(item,index) in keys' :key="index" :source='item' :index='index' :dia='dia' @toParent='getChild' @addParent='getChild' @delBig='delBigger' @fatherMethod='fatherMethod' />
		<div class="key_bottom">
			<label class="el-icon-circle-plus-outline" @click="showDialog" for='mainKey'></label>
		</div>
		<el-dialog id='dialog' title='新增类别' :visible.sync='dialog'>
			<el-form>
				<el-form-item label='新增类别：'>
					<el-input v-model='newTile' placeholder='请输入类别' id='mainKey'></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type='default' @click='sureSubmit'>确定提交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
	import Key from '@/components/Key.vue';
	import * as api from "@/common/api.js";
	import * as $ui from "@/common/ui.js";
	export default {
		name: "key_words",
		components: {
			Key,
		},
		data() {
			return {
				dia: false, //子组件遮罩层
				dialog: false, //遮罩层
				newTile: '', //类型
				keys: [], //所有资源
			}
		},
		mounted() {
			//初始化
			this.getAllMainKey();
		},
		methods: {
			/*子组件通过这个来调用初始化方法*/
			fatherMethod() {
				this.getAllMainKey();
			},
			/*初始化方法*/
			getAllMainKey() {
				//获得所有的关键词数据
				api.getAllMainKeys({
					workplaceId: JSON.parse(window.sessionStorage.getItem('login')).workplaceId
				}).then(res => {
					if(res.code == '0') {
						this.keys = res.data;
					} else {
						$ui.warnMsg(res.message);
					}
				}).catch(err => {
					console.log(err);
				});
			},
			/*展示模态框并清空input框*/
			showDialog() {
				this.dialog = true;
				this.newTile = '';
			},
			/*新增类型时提交*/
			sureSubmit() {
				//新定义一个资源的json字符串
				var newSource = {
					wordType: this.newTile,
					keyWords: []
				};
				//判断input框是否为空
				if(this.newTile == '') {
					this.$message({
						type: 'warning',
						message: '类别不能为空！'
					});
				} else {
					this.$message({
						type: 'success',
						message: '类别添加成功！'
					});
					this.keys.push(newSource); //给资源赋值
					this.dialog = false; //去掉遮罩层
					this.dia = true; //添加过类型之后，到子级，确认遮罩层显示
				}
			},
			/*从子组件拿到data，重渲染资源字符串*/
			getChild(data) {
				const _index = data[0];
				const source = data[1];
				this.keys[_index] = source;
			},
			/*从子组件的事件，删除关键词类型*/
			delBigger(data) {
				this.keys.splice(data, 1);
			}
		}
	};
</script>
<style lang="less" scoped>
	.key_words {
		width: 100%;
		.key_bottom {
			margin: 60px 0;
			width: 100%;
			text-align: center;
			label {
				font-size: 60px;
			}
		}
	}
</style>