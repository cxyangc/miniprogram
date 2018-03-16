// pages/fx_center/index.js
const app = getApp()
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    setting: {},
    mendianInfo: null,
    loginUser: null,
    mendianZhanghu:null
  },
  /* 组件事件集合 */
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  

  get_mendian_center: function (setting) {
    console.log('-------门店--------')
    let params = {

    }
    var customIndex = app.AddClientUrl("/get_manager_mendian_account_admin_mendian_json.html", params, 'post')
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
          let mendianZhanghu = res.data.relateObj
          //account 账户余额
          that.setData({
            mendianZhanghu: mendianZhanghu
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({ 
      setting: app.setting,
      loginUser: app.loginUser 
      })
 

    this.get_mendian_center(app.setting)
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
})