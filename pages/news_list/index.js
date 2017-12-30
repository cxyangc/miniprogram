

import { json2Form } from "../../public/json2Form.js";
var tab = require('../../view/js/tab.js');
const app = getApp()

 
Page({
  data: {
    /* seeting */
    setting: null,
    userData: null,
    PaiXuPartials: null,

    loginUser: null,
    showState:null,
    tabData:null,
    componentData:{},
  },
   
  bindTab:function(e){
    let that = this
    let url = e.currentTarget.dataset.url
    let componentData = this.data.componentData
    tab.bindTap(url, that, json2Form, app, componentData)
  },
  toNewsDetail:function(e){
    var id = e.currentTarget.dataset.id

    wx.navigateTo({
      url: '/pages/news_detail/index?id='+id,
    })
    
  },
  /*  */
  getCusPage: function () {
    var customIndex = app.AddClientUrl("/custom_page_news.html")
    var that = this
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    //拿custom_page
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        that.setData({ userData: res.data })
        if (!!res.data.partials){
          that.getPartials();
        }
        
        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },
  /* 格式化数据 */
  getPartials: function () {
    var that = this
    var partials = this.data.userData.partials;
    var PaiXuPartials = [];
    //排序

    for (let i = 0; i < partials.length; i++) {
      if (typeof (partials[i].jsonData) == "string") {
        partials[i].jsonData = JSON.parse(partials[i].jsonData)
      } 
      if (partials[i].partialType == 13){
        let componentData = that.data.componentData
        tab.tab(that, partials[i], json2Form, app, componentData)
      }
      if (partials[i].partialType == 12) {
        wx.setNavigationBarTitle({
          title: partials[i].jsonData.title
        })
        if (!partials[i].jsonData.titleColor) {
          partials[i].jsonData.titleColor = '#000000'
        }
        if (!partials[i].jsonData.bgColor) {
          partials[i].jsonData.bgColor = '#ffffff'
        }
        wx.setNavigationBarColor({
          frontColor: partials[i].jsonData.titleColor,
          backgroundColor: partials[i].jsonData.bgColor,
        })

      } else {
        PaiXuPartials.push(partials[i]);
      }
    }
    this.setData({ PaiXuPartials: PaiXuPartials })
    console.log(this.data.PaiXuPartials)
  },
  
  /* 获取新闻列表数据 */
  getNewsData: function (param){
    var that = this
    if (!param){
      param = ''
    }
    //let urlData = app.getUrlParams(url)
    //console.log(urlData)
    let cusUrl = app.AddClientUrl('/more_news_bbs_list.html', param)
      wx.request({
        url: cusUrl.url,
        header: app.header,
        success: function (res) {

          console.log(res.data)
          that.setData({ tabData: res.data.result })

        },
        fail: function (res) {

        
        }
      })
    
  },
  
  onLoad: function (options) {
    this.getNewsData(options)
    this.getCusPage();

    this.setData({ setting: app.setting })
  },

  
  onReady: function () {
    var that = this
    let componentData = this.data.componentData
  },


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
  onShareAppMessage: function () {

  }
})