// 遍历一个对象的key对应的值是否为空
export function filterParams(obj) {
  for (let i in obj) {
    if (obj[i]) {
      return true
    } else {
      return false
    }
  }
}
// 清空对象key值
export function initObject(obj){
  Object.keys(obj).forEach(key => {
    obj[key] = ''
  })
}
// 验证手机号
export function checkPhone(val){
  return (/^1[3|4|5|7|8][0-9]\d{8}$/.test(val))
}