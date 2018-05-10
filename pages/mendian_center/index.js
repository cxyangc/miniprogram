// pages/fx_center/index.js
const app = getApp()
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    setting: {},
    loginUser: null,
    mendian:{
      account:{
        account:0,
      },
      totalEarningAmount:0.00,
      totalTixianAmount:0.00,
      waitCompleteOrderDistributeAmount:0.00
    }
  },
  /* 组件事件集合 */
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  
  getMendianInfo:function(){
    console.log('-------门店-1-------')
    let params = {

    }
    var customIndex = app.AddClientUrl("/ge_manager_mendian_info_admin_mendian_json.html", params, 'post')
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '0') {
          let mendian = res.data.relateObj
          mendian = that.dellMoney(mendian)
          //account 账户余额
           that.setData({
             mendian: mendian
          }) 
           that.setNav(mendian)
        }else{
          wx.showModal({
            title: '失败了',
            content: '请求失败了，请下拉刷新！',
          })
         
        }


        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },
  dellMoney:function(mendian){
    mendian.account.account = app.toFix(mendian.account.account)
    mendian.totalEarningAmount = app.toFix(mendian.totalEarningAmount)
    mendian.totalTixianAmount = app.toFix(mendian.totalTixianAmount)
    mendian.waitCompleteOrderDistributeAmount = app.toFix(mendian.waitCompleteOrderDistributeAmount)
    return mendian
  },
  setNav:function(mendian){
    wx.setNavigationBarTitle({
      title: mendian.name,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({ 
      setting: app.setting,
      loginUser: app.loginUser 
      })
 
    this.getMendianInfo()
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
    this.onLoad()
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },2000)
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
})