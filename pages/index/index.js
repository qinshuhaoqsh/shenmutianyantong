import md5 from '../../utils/md5.js';
// 引用百度地图微信小程序JSAPI模块 
const bmap = require('../../utils/bmap.js');
const util = require('../../utils/util.js');
const calendar = require('../../utils/calendar.js');
const app = getApp();
Page({
  data: {
    showError: false,
    error: '',
    isHasOpenId: false,
    toptipType: 'error',
    loadingBtn: true,
    disabledBtn: true,
    show: false,
    delay: 2000,
    company_name: '',
    face_url: '',
    iconList: [{
      src: './img/sy-txjl@3x.png',
      text: '通行记录',
      url: '../record/record'
    }, {
      src: './img/sy-txl@3x.png',
      text: '通讯录',
      url: '../vipList/vipList'
    }, {
      src: './img/sy-fkjl@3x.png',
      text: '访客登记',
      url: '../visitorRegister/visitorRegister'
    }, {
      src: './img/sy-fksp@3x.png',
      text: '访客审批',
      url: '../visitorApproval/visitorApproval'
    }],
    sync_status: 0,
    dialogShow: false,
    dialogShow1: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    week: util.getWeekByDate(new Date()),
    lunarDate: '',
    solarDate: util.formSolarDate(new Date()) + '',
    weather: null
  },
  onLaunch: function () { },
  //获取vip信息
  getVipDetail: function () {
    const _this = this;
    let obj1 = {
      action: 'detail',
      num: app.globalData.num,
      timestamp: new Date().getTime()
    };
    wx.request({
      url: app.globalData.url + '/api/applet',
      data: {
        ...obj1,
        sign: app.makeSign(obj1).toUpperCase()
      },
      method: 'POST',
      success: res => {
        _this.setData({
          disabledBtn: false,
          loadingBtn: false
        })
        app.globalData.isHasOpenId = res.data.code === 1000 ? true : false;
        _this.setData({
          isHasOpenId: app.globalData.isHasOpenId
        })
        if (res.data.code === 1000) {
          app.globalData.vipDetail = res.data.data;
          let deepcamInfo = {
            ...app.globalData.deepcamInfo
          };
          deepcamInfo.company_id = res.data.data.company_id;
          deepcamInfo.vip_group_id = Number(res.data.data.vip_group_id);
          deepcamInfo.visitor_from = Number(res.data.data.visitor_from);
          if (res.data.data.device_id) {
            deepcamInfo.device_id = res.data.data.device_id;
          }
          if (res.data.data.device_group_id) {
            deepcamInfo.device_group_id = res.data.data.device_group_id;
          }
          app.globalData.deepcamInfo = {
            ...deepcamInfo
          };
          app.globalData.access_key = res.data.data.access_key;
          app.globalData.company_name = res.data.data.company_name;
          _this.setData({
            company_name: app.globalData.company_name,
            name: res.data.data.name,
            face_url: app.globalData.url + '/upload/' + res.data.data.url,
            sync_status: res.data.data.sync_status
          })
        }
      }
    })
  },
  //获取access_key
  getAccessKey: function () {
    let obj1 = {
      action: 'detail',
      id: Number(app.globalData.deepcamInfo.company_id),
      timestamp: new Date().getTime()
    };
    wx.request({
      url: app.globalData.url + '/api/company',
      data: {
        ...obj1,
        sign: app.makeSign(obj1).toUpperCase()
      },
      method: 'POST',
      success: res => {
        if (res.data.code === 1000) {
          app.globalData.access_key = res.data.data.access_key;
          app.globalData.company_name = res.data.data.name;
          this.setData({
            dialogShow1: true,
            company_name: res.data.data.name,
          })

        }
      }
    })
  },
  // 扫码确认
  tapDialogButton1(e) {
    if (e.detail.index === 1) {
      this.setData({
        dialogShow1: false
      })
      wx.navigateTo({
        url: '../addVip/addVip',
      })
    } else {
      this.setData({
        dialogShow1: false
      })
    }
  },
  //开启扫码
  tapDialogButton(e) {
    if (e.detail.index === 1) {
      this.setData({
        dialogShow: false
      })
      this.bindSubmitAdd();
    } else {
      this.setData({
        dialogShow: false
      })
    }
  },
  //获取天气信息
  getWeather: function () {
    const _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            type: 'wgs84',
            success(res) { }
          })
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                type: 'wgs84',
                success() { }
              })
            }
          });
        }
      }
    });
    // 新建百度地图对象 
    const BMap = new bmap.BMapWX({
      ak: 'FINMgXSWb3xFyHEllOVStx8VTfHPuEwN'
    });
    BMap.weather({
      fail: function (data) {
        _this.getWeather();
      },
      success: function (data) {
        // console.log(data)
        let weather = {};
        let temperature = data.currentWeather[0].temperature.split(' ~ '),
          dayPictureUrl = './img' + data.originalData.results[0].weather_data[0].dayPictureUrl.split('day')[1];
        // console.log(dayPictureUrl);
        weather.city = data.currentWeather[0].currentCity.substring(0, data.currentWeather[0].currentCity.length - 1);
        weather.shishi = data.currentWeather[0].date.split('：')[1].split('℃')[0] + '°';
        weather.pm25 = data.currentWeather[0].pm25;
        weather.temperature = temperature[1].split('℃')[0] + '/' + temperature[0] + '℃';
        weather.weatherDesc = data.currentWeather[0].weatherDesc;
        weather.dayPictureUrl = dayPictureUrl;
        weather.des = data.originalData.results[0].index[0].des;
        _this.setData({
          weather
        })
      }
    });
  },
  //页面加载 登录
  onLoad: function (options) {
    const _this = this;
    let _date = new Date(),
      year = _date.getFullYear(),
      month = _date.getMonth() + 1 > 10 ? _date.getMonth() + 1 : '0' + Number(_date.getMonth() + 1),
      day = _date.getDate() > 10 ? _date.getDate() : '0' + getDate(),
      str = year + '-' + month + '-' + day,
      nongli = calendar.getLunarDateString(calendar.getLunarDate(str));
    _this.setData({
      lunarDate: nongli.month + '月' + nongli.day
    })
    this.getWeather();
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let timer = 1,
      times = 0;
    clearInterval(timer);
    wx.login({
      success: res => {
        let obj = {
          action: 'authorization',
          code: res.code,
          timestamp: new Date().getTime()
        };
        wx.request({
          url: app.globalData.url + '/api/applet',
          data: {
            ...obj,
            sign: app.makeSign(obj).toUpperCase()
          },
          method: 'POST',
          success: res => {
            if (res.data.code === 1000) {
              const openid = md5(res.data.data.openid).substring(8, 24);
              // const openid = 'a3ef9f1b3958534d';
              app.globalData.num = openid;
              let obj1 = {
                action: 'detail',
                num: app.globalData.num,
                timestamp: new Date().getTime()
              };
              wx.request({
                url: app.globalData.url + '/api/applet',
                data: {
                  ...obj1,
                  sign: app.makeSign(obj1).toUpperCase()
                },
                method: 'POST',
                success: res => {
                  _this.setData({
                    disabledBtn: false,
                    loadingBtn: false
                  })
                  app.globalData.isHasOpenId = res.data.code === 1000 ? true : false;
                  _this.setData({
                    isHasOpenId: app.globalData.isHasOpenId
                  })
                  if (res.data.code === 1000) {
                    app.globalData.vipDetail = res.data.data;
                    let deepcamInfo = {
                      ...app.globalData.deepcamInfo
                    };
                    deepcamInfo.company_id = res.data.data.company_id;
                    deepcamInfo.vip_group_id = Number(res.data.data.vip_group_id);
                    deepcamInfo.visitor_from = Number(res.data.data.visitor_from);
                    if (res.data.data.device_id) {
                      deepcamInfo.device_id = res.data.data.device_id;
                    }
                    if (res.data.data.device_group_id) {
                      deepcamInfo.device_group_id = res.data.data.device_group_id;
                    }
                    app.globalData.deepcamInfo = {
                      ...deepcamInfo
                    };
                    app.globalData.access_key = res.data.data.access_key;
                    app.globalData.company_name = res.data.data.company_name;
                    _this.setData({
                      company_name: app.globalData.company_name,
                      name: res.data.data.name,
                      face_url: app.globalData.url + '/upload/' + res.data.data.url
                    })
                    wx.hideLoading();
                    if (res.data.data.sync_status !== 1) {
                      timer = setInterval(function () {
                        times = times + 1;
                        if (times === 5) {
                          clearInterval(timer);
                        }
                        if (_this.data.sync_status === 1) {
                          clearInterval(timer);
                        }
                        _this.getVipDetail();
                      }, 3000)
                    }
                  } else {
                    wx.hideLoading();
                    if (options.scene) {
                      let scene = decodeURIComponent(options.scene);
                      if (scene.indexOf("(") > -1 && scene.indexOf(")") > -1) {
                        scene = scene.split('(')[1].split(')')[0];
                        let deepcamInfo = {
                          ...app.globalData.deepcamInfo
                        };
                        deepcamInfo.company_id = scene.split("&")[0];
                        deepcamInfo.vip_group_id = Number(scene.split("&")[1]);
                        deepcamInfo.visitor_from = Number(scene.split("&")[1]);
                        if (scene.split("&").length >= 3) {
                          deepcamInfo.device_group_id = scene.split("&")[2];
                        }
                        if (scene.split("&").length >= 4) {
                          deepcamInfo.device_id = scene.split("&")[3];
                        }
                        app.globalData.deepcamInfo = deepcamInfo;
                        _this.getAccessKey();
                      }
                    } else {
                      // _this.setData({
                      //   dialogShow: true
                      // })
                    }
                  }
                }
              })
            } else {
              _this.setData({
                error: res.data.message,
                showError: true,
                toptipType: 'error',
                delay: 2000
              })
            }
          }
        })
      }
    })
  },
  bindSubmit: function () {
    if (this.data.isHasOpenId) {
      wx.navigateTo({
        url: '../addVip/addVip',
      })
    } else {
      this.setData({
        dialogShow: true
      })
    }
  },
  //跳转
  bindLink: function (e) {
    if (this.data.isHasOpenId) {
      wx.navigateTo({
        url: this.data.iconList[e.currentTarget.dataset.id].url,
      })
    } else {
      this.setData({
        dialogShow: true
      })
    }
  },
  //扫码结果处理
  bindSubmitAdd: function () {
    const _this = this;
    wx.scanCode({
      success(res) {
        if (decodeURIComponent(res.path)) {
          if (decodeURIComponent(res.path).split('=')[1]) {
            //防止跳转错误
            if (decodeURIComponent(res.path).split('=')[1].indexOf("(") > -1 && decodeURIComponent(res.path).split('=')[1].indexOf(")") > -1) {
              const scene = decodeURIComponent(res.path).split('=')[1].split('(')[1].split(')')[0];
              let deepcamInfo = {
                ...app.globalData.deepcamInfo
              };
              deepcamInfo.company_id = scene.split("&")[0];
              deepcamInfo.vip_group_id = Number(scene.split("&")[1]);
              deepcamInfo.visitor_from = Number(scene.split("&")[1]);
              if (scene.split("&").length >= 3) {
                deepcamInfo.device_group_id = scene.split("&")[2];
              }
              if (scene.split("&").length >= 4) {
                deepcamInfo.device_id = scene.split("&")[3];
              }
              app.globalData.deepcamInfo = deepcamInfo;
              _this.getAccessKey();
            } else {
              _this.setData({
                error: '请扫码指定的二维码',
                showError: true,
                toptipType: 'error',
                delay: 2000
              })
            }
          } else {
            _this.setData({
              error: '请扫码指定的二维码',
              showError: true,
              toptipType: 'error',
              delay: 2000
            })
          }
        } else {
          _this.setData({
            error: '请扫码指定的二维码',
            showError: true,
            toptipType: 'error',
            delay: 2000
          })
        }
      },
    })
  },
})