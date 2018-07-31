// pages/richText/index.js

var WxParse = require('../../wxParse/wxParse.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
///
  },
  getData:function(b){
    var that= this
    var param = { promotionId: b.promotionId}
    var customIndex = app.AddClientUrl("/get_promotions_detail.html", param, 'get')
    wx.request({
      url: customIndex.url,      
      header: app.header,
      success: function (res) {
        console.log(res)
        console.log(res.data)    
        if (res.data.errcode =="-1"){
          wx.showToast({
            title: res.data.errMessage,
            image: '/images/icons/tip.png',
            duration: 2000
          })
        }    
       else{
          if (res.data.relateObj.name) {
            wx.setNavigationBarTitle({
              title: res.data.relateObj.name,
            })
          }
           if (res.data.relateObj.content) {
            WxParse.wxParse('article', 'html', res.data.relateObj.content, that, 10);
          }
       } 
      },
      fail: function (res) {
        app.loadFail()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  opt: null,
  onLoad: function (options) {
     this.opt = options
    // let navName = options.navName
    // if (navName) {
    //   wx.setNavigationBarTitle({
    //     title: navName,
    //   })
    // }

    // let that = this
    // let richTextHtml = app.richTextHtml
    // WxParse.wxParse('article', 'html', richTextHtml, that, 10);
    this.getData(options)
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
  onShareAppMessage: function () {
    let that = this
    let params = that.opt
    console.log('params:' + params)
    return app.shareForFx2('promotion_detail', '', params)
  }
})