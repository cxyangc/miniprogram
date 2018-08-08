var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityPromotion: [],//已经开始的活动
    unactivityPromotion:[],//还未开始的活动
    sysWidth: "",
    currentTab: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    this.wxLogin()
    if (app.loginUser==""){
      this.wxLogin()
      console.log("用户信息1", app.loginUser)
    }else{
      console.log("用户信息", app.loginUser)
    }
   
  },
  getData: function () {
    var that = this
    var customIndex = app.AddClientUrl("/tunzai_index.html", {}, 'get', '1')
    //获取到数据
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("====== res.data=========", res.data)
      that.setData({
        activityPromotion: res.data.activityPromotion,
        unactivityPromotion: res.data.unactivityPromotion
          })
        wx.hideLoading()

      },
      fail: function (res) {
        console.log('------------2222222-----------')
        console.log(res)
        wx.hideLoading()

      

        wx.showModal({
          title: '提示',
          content: '加载失败，点击【确定】重新加载',
          success: function (res) {

            if (res.confirm) {
              that.getParac()
            } else if (res.cancel) {
              app.toIndex()
            }
          }
        })
      }
    })
  }, // 滚动切换标签样式
  switchTab: function (e) {

    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }

  
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
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
  
  },


})