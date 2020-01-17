import axios from 'axios' // 引入axios
import {Message} from 'element-ui'
const $axios = axios.create({
  // baseURL: process.env.API_ROOT
  baseURL: ''
});
//get请求
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    $axios.get(url, {
      params: params
    })
    .then(response => {
      if (response && response.status === 200) {
        resolve(response.data);
      } else {
        Message.error(response.data.message);
      }
    })
    .catch(err => {
      reject(err)
      Message.error("服务器开小差了~");
    })
  })
}
//post请求
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    $axios.post(url, data)
    .then(response => {
      if (response && response.status === 200) {
        resolve(response.data);
      } else {
        Message.error(response.data.message);
      }
    }, err => {
      reject(err)
      Message.error("服务器开小差了~");
    })
  })
}
export default {
  get,
  post
}
