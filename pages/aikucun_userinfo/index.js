
const app = getApp()
var tab = require('../../view/js/tab.js');
var detailList = require('../../view/js/detail_list.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    /* seeting */
    setting: null,
    userData: null,
    PaiXuPartials: null,

    loginUser: null,
    componentData: {}, //组件的data

    headData:null,
    blankData: null,
    orderData: null,
    ListData: null,
    serverData: null,
  },
  loginOut: function () {
    wx.navigateTo({
      url: '/pages/pre_change_user_info/index',
    })
  },
  login: function () {
    wx.navigateTo({
      url: '../login_wx/index',
    })
  },
  headData:{
    imageUrl:'http://image.aikucun.xyz/aikucun/2018_4/2/11/48/3_10.jpg'
  },
  
  blankData:{
    color: "rgb(244,244,244)",
    height: 12
  },

  orderData: {
    
    cells:[
      {
        iconPath: "http://image.aikucun.xyz/aikucun/2018_4/2/11/53/58_653.jpg",
        linkUrl: "order_list_2.html?easyStatus=2&easyStatusName=待付款",
        text: "待付款",
        color: "#777777",
        showCountNum:0,
        
      },
      {
        iconPath: "http://image.aikucun.xyz/aikucun/2018_4/2/11/54/1_475.jpg",
        linkUrl: "order_list_3.html?easyStatus=3&easyStatusName=待发货" ,
        text: "待发货",
        color: "#777777",
        showCountNum:0,
      },
      {
        iconPath: "http://image.aikucun.xyz/aikucun/2018_4/2/11/54/5_90.jpg",
        linkUrl: "order_list_4.html?easyStatus=4&easyStatusName=待收货",
        text: "待收货" ,
        color: "#777777",
        showCountNum:0,
      },
      {
        iconPath: "http://image.aikucun.xyz/aikucun/2018_4/2/11/54/7_742.jpg",
        linkUrl: "back_item_list.html",
        text: "售后",
        color: "#777777"
      },
    ],
    column:4,
    showType: 0
  },

  ListData:{
    cells: [
      {
        iconPath: "http://image.aikucun.xyz/aikucun/2018_4/2/12/0/27_922.jpg",
        linkUrl: "address.html",
        text: "收货地址" ,
        color: "#777777"
      },
      {
        iconPath: "http://image.aikucun.xyz/aikucun/2018_4/2/12/0/30_584.jpg" ,
        linkUrl: "yijian_fankui.html",
        text: "意见反馈" ,
        color: "#777777"
      },
      {
        iconPath: "http://image.aikucun.xyz/aikucun/2018_4/2/12/0/32_522.jpg",
        linkUrl: "news_list.html?newsTypeId=5&pageNage=关于我们",
        text: "关于我们",
        color: "#777777"
      }
    ],
    column: 3,
    showType: 0
  },

  serverData:{
    iconPath: "http://image.aikucun.xyz/aikucun/2018_4/2/12/4/20_993.jpg?imageMogr2/thumbnail/120x/interlace/0 ",
    linkUrl: "mendian_center.html",
    text: "我是服务商",
    color: "#777777"
  },
  dellSData:function(){
    this.setData({
      headData: this.headData,
      blankData: this.blankData,
      orderData: this.orderData,
      ListData: this.ListData,
      serverData: this.serverData,
    })
  },
  getSessionUserInfo: function () {
    var that = this;
    var postParamUserBank = app.AddClientUrl("/get_session_userinfo.html")
    wx.request({
      url: postParamUserBank.url,
      data: postParamUserBank.params,
      header: app.headerPost,
      success: function (res) {
        console.log(res.data)

        if (res.data.errcode == '0') {
          let UserInfo = res.data.relateObj.platformUser
          let orderData = that.orderData
          orderData.cells[0].showCountNum = UserInfo.unpayedCount
          orderData.cells[1].showCountNum = UserInfo.unsendedCount
          orderData.cells[2].showCountNum = UserInfo.unreceivedCount

          that.setData({
            orderData: orderData,
            loginUser: res.data.relateObj
          })
          app.loginUser = res.data.relateObj
        } else {
          wx.showToast({
            title: res.data.errMsg,
            image: '/images/icons/tip.png',
            duration: 1000
          })
        }
      },
      fail: function (res) {

       // unsendedCount //待发货
       // unreceivedCount //待收货
       // unpayedCount //逮住款

        console.log(res.data)
      },
      complete: function (res) {
        wx.stopPullDownRefresh()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dellSData()
    this.getSessionUserInfo()
    this.setData({
      loginUser: app.loginUser,
      userInfo: app.globalData.userInfo,
      setting: app.setting
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
  openShow:false,
  onShow: function () {
    if (this.openShow){
      this.setData({ loginUser: app.loginUser })
      this.getSessionUserInfo();
    }
    this.openShow = true
    
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
    this.getSessionUserInfo();
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  /* 分享 */
  onShareAppMessage: function () {
    return app.shareForFx2(app.miniIndexPage)
  },

  /* 组件事件集合 */

  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  }
})