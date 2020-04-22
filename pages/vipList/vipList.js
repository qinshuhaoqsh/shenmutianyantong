// pages/vipList/vipList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipList: [],
    company_name: '',
    page: 1,
    page_size: 15,
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVipList();
  },
  getVipList: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let obj = {
      access_key: app.globalData.access_key,
      company_id: Number(app.globalData.deepcamInfo.company_id),
      from: 'web',
      action: 'list',
      page: this.data.page,
      page_size: this.data.page_size,
      vip_group_id: Number(app.globalData.deepcamInfo.vip_group_id),
      timestamp: new Date().getTime()
    };
    wx.request({
      url: app.globalData.url + '/api/vip',
      method: 'POST',
      data: {
        ...obj,
        sign: app.makeSign(obj).toUpperCase()
      },
      success: res => {
        wx.hideLoading();
        if (res.data.code === 1000) {
          const rep = /^(1[3-9])\d{9}$/;
          let vipList = res.data.data.list;
          vipList && vipList.map(v => {
            if (rep.test(v.phone)) {
              v.phoneBol = true;
            } else {
              v.phoneBol = false;
            }
          });
          this.setData({
            vipList: this.data.vipList.concat(res.data.data.list),
            company_name: app.globalData.company_name,
            total: res.data.data.count
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindToPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
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
    if (this.data.page * this.data.page_size < this.data.total) {
      this.setData({
        page: this.data.page + 1
      })
      this.getVipList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})