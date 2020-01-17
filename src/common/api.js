//统一接口
import qs from 'qs'
import { post, get } from './ajax'
//登录接口
export function login(reqData) {
  return post("/api/clerk/login", qs.stringify(reqData))
}
// 首页数据
export function getHomeData(reqData) {
  return post('/api/home/', qs.stringify(reqData))
}
// 员工管理 所有员工列表 & 查询某个员工
export function getStaffList(reqData) {
  return get('/api/clerk/search', reqData)
}
//员工管理  删除某个员工
export function delStaff(reqData) {
  return post('/api/clerk/del', qs.stringify(reqData))
}
// 员工管理 新增某个员工
export function addStaff(reqData) {
  return post('/api/clerk/add', qs.stringify(reqData))
}
// 员工管理 获取工位号列表
export function getStationList(reqData) {
  return get('/api/select/station', reqData)
}
//录音管理 查询所有的数据
export function getRecord(reqData) {
  return get('/api/file/search', reqData)
}
//推荐统计管理  工位下的列表和图表查询
export function getWorkStationSource(reqData) {
  return get('/api/statistic/station', reqData)
}
//推荐统计管理  产品下的列表和图表查询
export function getProductSource(reqData) {
  return get('/api/statistic/product', reqData)
}
//关键词管理 查看所有关键词数据，包括热词类型和热词列表
export function getAllMainKeys(reqData) {
  return get('/api/word/search', reqData)
}
//关键词管理 分别删除：wordId删热词，wordType删类型
export function deleteMainKey(reqData) {
  return get('/api/word/del', reqData)
}
//关键词管理 分别添加：word加热词，wordType加类型
export function insertMainKey(reqData){
	return get('/api/word/insert',reqData);
}
