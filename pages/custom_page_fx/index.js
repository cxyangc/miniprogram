 
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

    fxCenter: 0,
  },
  
  /* 获取数据 */
  getData: function () {
    var customIndex = app.AddClientUrl("/custom_page_fx.html", {}, 'get', '1')
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    //拿custom_page
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        if (!!res.data.partials) {
          that.getPartials(res.data.partials)
        } else {
          console.log('--------error --------' + res.data)
        }
      },
      fail: function (res) {
        
        app.loadFail()
      },
      complete:function(res){
        wx.hideLoading()
      }
    })
  },
  /* 格式化数据 */
  getPartials: function (partials) {
    var PaiXuPartials = [];
    var that = this
    for (let i = 0; i < partials.length; i++) {
      if (typeof (partials[i].jsonData) == "string") {
        partials[i].jsonData = JSON.parse(partials[i].jsonData)
      }
      if (partials[i].partialType == 1) {

        WxParse.wxParse('article', 'html', partials[i].jsonData.content, that, 10);
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
    console.log(PaiXuPartials)
  },
  //获取推广中心，查看是否有资格
  get_fx_center: function (setting) {
    console.log('-------推广中心--------')
    var customIndex = app.AddClientUrl("/fx_center.html")
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        if (res.errMsg == 'request:ok') {
          let fxCenter = res.data

          if (setting.platformSetting.fxShenhe == 0) {
            //都有资格
            that.setData({ fxCenter: fxCenter })
          } else {
            if (fxCenter.fxShenhe == 1) {
              //有资格
              that.setData({ fxCenter: fxCenter })
            } else {
              //没有资格
              that.setData({ fxCenter: 1 })
            }
          }
        }
        if (res.data.errcode == '10001') {
          that.setData({ fxCenter: 1 })
        }

        console.log(res)

        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    this.get_fx_center(app.setting)
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

    let componentData = this.data.componentData
    detailList.detailList(this, app, componentData)


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
    this.onLoad()
    wx.stopPullDownRefresh()
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
    return app.shareForFx('custom_page_fx')
  },

  /* 组件事件集合 */

  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  }
})