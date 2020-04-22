//app.js
import md5 from 'utils/md5.js';
import {
  url
} from 'utils/config.js';

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
    deepcamInfo: {
      company_id: '',
      vip_group_id: '',
      device_group_id: '',
      device_id: '',
      visitor_from: ''
    },
    access_key: '',
    isHasOpenId: false,
    num: '',
    vipDetail: null,
    url: url,
    company_name: ''
  },
  /** 
   *  数组对象按key升序, 并生成 md5_hex 签名
   * @param {Array/Object} obj   数组对象
   * @return {String}  encrypted md5加密后的字符串
   */
  makeSign: function (obj) {
    return md5(this.encrypte(obj));
  },
  encrypte: function (data) {
    let _arr = [];
    for (let i in data) {
      if (data[i] && data[i] !== null && data[i] !== false && data[i] !== '0' && data[i] !== 0) {
        _arr.push(i)
      }
    }
    _arr.sort();
    let _str = '';
    for (let item of _arr) {
      if (_str.length === 0) {
        _str += item + '=' + data[item]
      } else {
        _str += '&' + item + '=' + data[item]
      }
    }
    return _str;
  }
})