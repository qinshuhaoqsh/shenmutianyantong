// pages/toAdd/toAdd.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showError: false,
    error: '',
    isHasOpenId: false,
    toptipType: 'error',
    loadingBtn: false,
    disabledBtn: false,
    delay: 2000,
    dialogShow: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    company_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  tapDialogButton(e) {
    if (e.detail.index === 1) {
      this.setData({
        dialogShow: false
      })
      wx.reLaunch({
        url: '../addVip/addVip',
      })
    } else {
      this.setData({
        dialogShow: false
      })
    }
  },
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
            dialogShow: true,
            company_name: res.data.data.name,
          })

        }
      }
    })
  },
  bindSubmit: function () {
    const _this = this;
    wx.scanCode({
      success(res) {
        if (decodeURIComponent(res.path)) {
          if (decodeURIComponent(res.path).split('=')[1]) {
            if (decodeURIComponent(res.path).split('=')[1].indexOf("(") > -1 && decodeURIComponent(res.path).split('=')[1].indexOf(")") > -1) {
              // _this.setData({
              //   error: '正在读取二维码信息，请稍后',
              //   showError: true,
              //   toptipType: 'success',
              //   delay: 1000
              // })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})