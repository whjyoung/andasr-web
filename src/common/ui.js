// ui弹出框
import { MessageBox, Message } from 'element-ui'

//确认弹出框
export function confirm(title, type) {
  return MessageBox.confirm(title, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
}

// 警告消息提示
export function warnMsg(msg) {
  return Message({
    message: msg,
    type: 'error',
    duration: 2000
  })
}