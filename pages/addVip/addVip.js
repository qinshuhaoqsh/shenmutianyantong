//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: null,
    number: null,
    sex: null,
    vipGroup: null,
    deviceGroup: [],
    device: null,
    idcard: null,
    phone: null,
    address: null,
    more: null,
    src: './img/grxx-sc@2x.png',
    sexList: [
      '男',
      '女'
    ],
    vipGroupList: [],
    deviceGroupList: [],
    deviceList: [],
    deviceGroupTitle: '',
    deviceTitle: '',
    showError: false,
    error: '',
    img: null,
    isHasOpenId: false,
    toptipType: 'error',
    loadingBtn: false,
    disabledBtn: false,
    show: false,
    visitor_from: 0,
    dialogShow: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    sync_status: 0,
    company_name: ''
  },
  bindDelete: function () {
    this.setData({
      dialogShow: true
    })
  },
  tapDialogButton(e) {
    if (e.detail.index === 1) {
      let obj = {
        num: app.globalData.num,
        action: 'delete',
        timestamp: new Date().getTime(),
        company_id: Number(app.globalData.deepcamInfo.company_id),
        access_key: app.globalData.access_key
      }
      obj.sign = app.makeSign(obj).toUpperCase();
      wx.request({
        url: app.globalData.url + '/api/vip',
        data: {
          ...obj
        },
        method: 'POST',
        success: res => {
          if (res.data.code === 1000) {
            wx.reLaunch({
              url: '../index/index',
            })
          } else {
            this.setData({
              error: res.data.message,
              showError: true,
              toptipType: 'error'
            })
          }
        }
      })
      this.setData({
        dialogShow: false
      })
    } else {
      this.setData({
        dialogShow: false
      })
    }
  },
  bindKeyInputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyInputNumber: function (e) {
    if (e.detail.value) {
      this.setData({
        number: Number(e.detail.value)
      })
    } else {
      this.setData({
        number: null
      })
    }
  },
  bindKeyInputIdcard: function (e) {
    if (e.detail.value) {
      this.setData({
        idcard: Number(e.detail.value)
      })
    } else {
      this.setData({
        idcard: null
      })
    }
  },
  bindKeyInputPhone: function (e) {
    if (e.detail.value) {
      this.setData({
        phone: Number(e.detail.value)
      })
    } else {
      this.setData({
        phone: null
      })
    }
  },
  bindKeyInputAddress: function (e) {
    if (e.detail.value) {
      this.setData({
        address: e.detail.value
      })
    } else {
      this.setData({
        address: null
      })
    }
  },
  bindKeyInputMore: function (e) {
    if (e.detail.value) {
      this.setData({
        more: e.detail.value
      })
    } else {
      this.setData({
        more: null
      })
    }
  },
  bindPickerChangeSex: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  bindPickerChangeVipGroup: function (e) {
    this.setData({
      vipGroup: e.detail.value
    })
  },
  bindPickerChangeDeviceGroup: function (e) {
    this.setData({
      deviceGroup: e.detail.value
    })
  },
  bindPickerChangeDevice: function (e) {
    this.setData({
      device: e.detail.value
    })
  },
  takePhoto: function () {
    if (this.data.disabledBtn) {
      return null;
    }
    const _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.camera']) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
              if (res.tempFiles[0].size >= 1024 * 1024 * 2) {
                this.setData({
                  error: '图片需要小于等于2M',
                  showError: true,
                  toptipType: 'error'
                })
                return null;
              }
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths;
              _this.setData({
                src: tempFilePaths[0],
                img: res.tempFiles
              })
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                  if (res.tempFiles[0].size >= 1024 * 1024 * 2) {
                    this.setData({
                      error: '图片需要小于等于2M',
                      showError: true,
                      toptipType: 'error'
                    })
                    return null;
                  }
                  // tempFilePath可以作为img标签的src属性显示图片
                  const tempFilePaths = res.tempFilePaths;
                  _this.setData({
                    src: tempFilePaths[0],
                    img: res.tempFiles
                  })
                }
              })
            }
          })
        }
      }
    })
    // const ctx = wx.createCameraContext()
    // ctx.takePhoto({
    //   quality: 'high',
    //   success: (res) => {
    //     this.setData({
    //       src: res.tempImagePath
    //     })
    //   }
    // })
  },
  bindSubmit: function () {
    if (this.data.name === null || this.data.name.trim() === '') {
      this.setData({
        error: '请输入姓名',
        showError: true,
        toptipType: 'error'
      })
      return null;
    }
    if (this.data.sex === null) {
      this.setData({
        error: '请选择性别',
        showError: true,
        toptipType: 'error'
      })
      return null;
    }
    if (this.data.visitor_from === 0 & this.data.vipGroup === null) {
      this.setData({
        error: '请选择角色',
        showError: true,
        toptipType: 'error'
      })
      return null;
    }
    if (this.data.src === './img/camera.png' || (this.data.isHasOpenId === false && this.data.img === null)) {
      this.setData({
        error: '请上传图片',
        showError: true,
        toptipType: 'error'
      })
      return null;
    }
    wx.showLoading({
      title: '操作中',
      mask: true
    })
    let obj = {
      name: this.data.name,
      gender: this.data.sex == 0 ? 'M' : 'F',
      num: app.globalData.num,
      action: this.data.isHasOpenId ? 'update' : 'add',
      timestamp: new Date().getTime(),
      company_id: Number(app.globalData.deepcamInfo.company_id),
      access_key: app.globalData.access_key,
    }
    if (!(this.data.address === null || this.data.address.trim() === '')) {
      obj.address = this.data.address.trim();
    }
    if (!(this.data.phone === null)) {
      obj.phone = this.data.phone;
    }
    if (!(this.data.more === null || this.data.more.trim() === '')) {
      obj.remark = this.data.more.trim();
    }
    if (app.globalData.deepcamInfo.device_group_id.split(',').length > 0) {
      obj.device_group_id = app.globalData.deepcamInfo.device_group_id
    }
    if (app.globalData.deepcamInfo.device_id !== '') {
      obj.device_id = app.globalData.deepcamInfo.device_id
    }
    if (app.globalData.deepcamInfo.vip_group_id !== '') {
      if (app.globalData.deepcamInfo.visitor_from === 0) {
        obj.vip_group_id = String(this.data.vipGroupList[this.data.vipGroup].id);
      } else {
        obj.vip_group_id = String(app.globalData.deepcamInfo.vip_group_id);
      }
    }
    if (!this.data.isHasOpenId) {
      obj.visitor_from = app.globalData.deepcamInfo.visitor_from
    }
    let _data = {
      ...obj
    };
    _data.sign = app.makeSign(obj).toUpperCase();
    this.setData({
      loadingBtn: true,
      disabledBtn: true
    })
    // let timer = 0,
    //   times = 0;
    if (this.data.img !== null) {
      wx.uploadFile({
        url: app.globalData.url + '/api/vip',
        filePath: this.data.src,
        name: 'image',
        formData: _data,
        method: 'POST',
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: res => {
          wx.hideLoading();
          this.setData({
            loadingBtn: false,
            disabledBtn: false
          })
          var data = JSON.parse(res.data);
          //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }
          if (data.code !== 1000) {
            this.setData({
              error: data.message,
              showError: true,
              toptipType: 'error'
            })
          } else {
            app.globalData.isHasOpenId = true;
            wx.reLaunch({
              url: '../index/index',
            })
            // let obj1 = {
            //   action: 'detail',
            //   num: app.globalData.num,
            //   timestamp: new Date().getTime()
            // };
            // clearInterval(timer);
            // timer = setInterval(() => {
            //   times = times + 1;
            //   if(times===3) {
            //     clearInterval(timer);
            //   }
            //   wx.request({
            //     url: app.globalData.url + '/api/applet',
            //     data: {
            //       ...obj1,
            //       sign: app.makeSign(obj1).toUpperCase()
            //     },
            //     method: 'POST',
            //     success: res => {
            //       if (res.code !== 1000) {
            //         _this.setData({
            //           error: '设备同步失败，请更新照片',
            //           showError: true,
            //           toptipType: 'error'
            //         })
            //       }
            //     }
            //   })
            // }, 3000)
          }
        }
      })
    } else {
      wx.request({
        url: app.globalData.url + '/api/vip',
        method: 'POST',
        data: {
          ..._data
        },
        success: res => {
          wx.hideLoading();
          this.setData({
            loadingBtn: false,
            disabledBtn: false
          })
          if (res.data.code !== 1000) {
            this.setData({
              error: res.data.message,
              showError: true,
              toptipType: 'error'
            })
          } else {
            app.globalData.isHasOpenId = true;
            wx.reLaunch({
              url: '../index/index',
            })
            // let obj1 = {
            //   action: 'detail',
            //   num: app.globalData.num,
            //   timestamp: new Date().getTime()
            // };
            // clearInterval(timer);
            // timer = setInterval(() => {
            //   times = times + 1;
            //   if(times===3) {
            //     clearInterval(timer);
            //   }
            //   wx.request({
            //     url: app.globalData.url + '/api/applet',
            //     data: {
            //       ...obj1,
            //       sign: app.makeSign(obj1).toUpperCase()
            //     },
            //     method: 'POST',
            //     success: res => {
            //       if (res.code !== 1000) {
            //         _this.setData({
            //           error: '设备同步失败，请更新照片',
            //           showError: true,
            //           toptipType: 'error'
            //         })
            //       }
            //     }
            //   })
            // }, 3000)
          }
        }
      })
    }
  },
  getDeviceList: function () {
    let obj = {
      action: 'list',
      company_id: Number(app.globalData.deepcamInfo.company_id),
      access_key: app.globalData.access_key,
      page: 1,
      page_size: 1000,
      device_group_id: Number(app.globalData.deepcamInfo.device_group_id),
      timestamp: new Date().getTime()
    }
    wx.request({
      url: app.globalData.url + '/api/device',
      method: 'POST',
      data: {
        ...obj,
        sign: app.makeSign(obj).toUpperCase()
      },
      success: res => {
        if (res.data.code === 1000) {
          const arr = app.globalData.deepcamInfo.device_id.split(',');
          let arrStr = [],
            arr1 = [];
          res.data.data.list.map((v, i) => {
            arr.map((value, index) => {
              if (v.id === Number(value)) {
                arr1.push(i);
                arrStr.push(v.name);
              }
            });
          });
          this.setData({
            deviceList: res.data.data.list,
            device: arr1,
            deviceTitle: arrStr.join(',')
          });
        }
      }
    })
  },
  getDeviceGroupList: function () {
    let obj = {
      action: 'list',
      company_id: Number(app.globalData.deepcamInfo.company_id),
      access_key: app.globalData.access_key,
      page: 1,
      page_size: 1000,
      timestamp: new Date().getTime()
    }
    wx.request({
      url: app.globalData.url + '/api/device_group',
      method: 'POST',
      data: {
        ...obj,
        sign: app.makeSign(obj).toUpperCase()
      },
      success: res => {
        if (res.data.code === 1000) {
          if (app.globalData.deepcamInfo.device_group_id === '') {

          } else {
            const arr = app.globalData.deepcamInfo.device_group_id.split(',');
            let arrStr = [],
              arr1 = [];
            res.data.data.list.map((v, i) => {
              arr.map((value, index) => {
                if (v.id === Number(value)) {
                  arr1.push(i);
                  arrStr.push(v.title);
                }
              });
            });
            this.setData({
              deviceGroupList: res.data.data.list,
              deviceGroup: arr1,
              deviceGroupTitle: arrStr.join(',')
            });
          }
        }
      }
    })
  },
  getVipGroupList: function () {
    const _this = this;
    let obj = {
      action: 'list',
      company_id: Number(app.globalData.deepcamInfo.company_id),
      access_key: app.globalData.access_key,
      page: 1,
      page_size: 1000,
      timestamp: new Date().getTime()
    }
    wx.request({
      url: app.globalData.url + '/api/vip_group',
      method: 'POST',
      data: {
        ...obj,
        sign: app.makeSign(obj).toUpperCase()
      },
      success: res => {
        if (res.data.code === 1000) {
          if (_this.data.isHasOpenId) {
            res.data.data.list.map((v, i) => {
              if (v.id === Number(app.globalData.deepcamInfo.vip_group_id)) {
                _this.setData({
                  vipGroupList: res.data.data.list,
                  vipGroup: i
                })
              }
            })
          } else {
            _this.setData({
              vipGroupList: res.data.data.list
            })
          }
        }
      }
    })
  },
  onLaunch: function () {},
  onLoad: function () {
    this.setData({
      isHasOpenId: app.globalData.isHasOpenId,
      visitor_from: app.globalData.deepcamInfo.visitor_from,
      company_name: app.globalData.company_name
    });
    if (app.globalData.deepcamInfo.visitor_from === 0) {
      this.getVipGroupList();
    }
    if (app.globalData.isHasOpenId) {
      this.setData({
        src: app.globalData.url + '/upload/' + app.globalData.vipDetail.url,
        name: app.globalData.vipDetail.name,
        sex: app.globalData.vipDetail.gender === 'M' ? 0 : 1,
        phone: app.globalData.vipDetail.phone,
        address: app.globalData.vipDetail.address,
        more: app.globalData.vipDetail.remark,
        sync_status: app.globalData.vipDetail.sync_status
      })
    }
    // this.getVipGroupList();
    // this.getDeviceGroupList();
    // if (app.globalData.deepcamInfo.device_group_id.split(',').length === 1) {
    //   this.getDeviceList();
    // }
  }
})