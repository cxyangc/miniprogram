
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
    headData: null,
    headData: null,
    headData: null,
    headData: null,
  },
  loginOut: function () {
    wx.navigateTo({
      url: '/pages/pre_change_user_info/index',
    })
  },
  login: function () {
    wx.navigateTo({
      url: '../login/index',
    })
  },
  headData:{
    imageUrl:' http://image1.sansancloud.com/jianzhan/2017_09/24/16/07/23_193.jpg'
  },
  
  blankData:{
    color: "rgb(244,244,244)",
    height: 12
  },

  orderData:{
    cells:[
      {
        iconPath: "http://image1.sansancloud.com/taoditongzhuang/2017_04/05/10/07/13_757.jpg",
        linkUrl: "order_list_2.html?easyStatus=2&easyStatusName=待付款",
        text: "待付款",
        color: "#777777"
      },
      {
        iconPath: "http://image1.sansancloud.com/taoditongzhuang/2017_04/05/10/07/11_765.jpg",
        linkUrl: "order_list_3.html?easyStatus=3&easyStatusName=待发货" ,
        text: "待发货",
        color: "#777777"
      },
      {
        iconPath: "http://image1.sansancloud.com/taoditongzhuang/2017_04/05/10/07/12_765.jpg",
        linkUrl: "order_list_4.html?easyStatus=4&easyStatusName=待收货",
        text: "待收货" ,
        color: "#777777"
      },
      {
        iconPath: "http://image1.sansancloud.com/taoditongzhuang/2017_04/05/10/07/04_738.jpg",
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
        iconPath: "http://image1.sansancloud.com/jianzhan/2017_11/08/20/45/24_151.jpg",
        linkUrl: "address.html",
        text: "收货地址" ,
        color: "#777777"
      },
      {
        iconPath: "http://image1.sansancloud.com/jianzhan/2017_11/08/20/44/24_950.jpg" ,
        linkUrl: "yijian_fankui.html",
        text: "意见反馈" ,
        color: "#777777"
      },
      {
        iconPath: "http://image1.sansancloud.com/jianzhan/2017_11/08/20/44/32_860.jpg",
        linkUrl: "news_detail.html?id=12",
        text: "关于我们",
        color: "#777777"
      }
    ],
    column: 3,
    showType: 0
  },

  serverData:{
    iconPath: "http://image1.sansancloud.com/aikucun/2018_03/12/13/00/08_078.jpg",
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dellSData()
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
  onShow: function () {

    this.setData({ loginUser: app.loginUser })


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