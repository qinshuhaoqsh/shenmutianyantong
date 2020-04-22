// pages/record/record.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '',
    endDate: '',
    startStart: '',
    startEnd: '',
    endStart: '',
    endEnd: '',
    recordList: [],
    page: 1,
    page_size: 10,
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const time = new Date(),
      year = time.getFullYear(),
      month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1),
      day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate();
    this.setData({
      startDate: year + '-' + month + '-' + day,
      endDate: year + '-' + month + '-' + day,
      startStart: '2016-09-09',
      startEnd: year + '-' + month + '-' + day,
      endStart: year + '-' + month + '-' + day,
      endEnd: year + '-' + month + '-' + day,
    })
    this.getRecordList(true)
  },
  getRecordList: function (flag) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let obj = {
      access_key: app.globalData.access_key,
      company_id: Number(app.globalData.deepcamInfo.company_id),
      vip_id: app.globalData.vipDetail.id,
      action: 'list',
      page: this.data.page,
      page_size: this.data.page_size,
      start_time: this.data.startDate + ' 00:00:00',
      end_time: this.data.endDate + ' 23:59:59',
      rec_type: 0,
      timestamp: new Date().getTime()
    };
    wx.request({
      url: app.globalData.url + '/api/visitor',
      method: 'POST',
      data: {
        ...obj,
        sign: app.makeSign(obj).toUpperCase()
      },
      success: res => {
        wx.hideLoading();
        if (res.data.code === 1000) {
          let recordList = res.data.data.list;
          recordList.map(v => {
            v.discern_time = v.discern_time.slice(5, 16)
            v.temperature = v.temperature.slice(0, 4);
          })
          if (flag) {
            this.setData({
              recordList: recordList,
              total: res.data.data.count
            })
          } else {
            this.setData({
              recordList: this.data.recordList.concat(recordList),
              total: res.data.data.count
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindDateChange: function (e) {
    if (e.currentTarget.dataset.date === 'start') {
      this.setData({
        startDate: e.detail.value,
        endStart: e.detail.value,
        page: 1,
        page_size: 10,
        total: 0,
      })
      this.getRecordList(true);
    } else {
      this.setData({
        endDate: e.detail.value,
        startEnd: e.detail.value,
        page: 1,
        page_size: 10,
        total: 0,
      })
      this.getRecordList(true);
    }
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
      this.getRecordList(false);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})