const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    promotionStartDate: { time: '2018-10-27 23:59:59', background: '', color: '' }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("hahahahahahah这是id", options.promotionId)
    console.log("hahahahahahah这是id", app.setting.platformSetting )
    this.setData({ setting: app.setting.platformSetting })
    this.data.promotionStartDate.background = '#fff'
    this.data.promotionStartDate.color = this.data.setting.defaultColor
    this.data.promotionStartDate.fontSize = 26
    this.setData({
      promotionStartDate: this.data.promotionStartDate,
    })
    console.log("this.data.promotionStartDate", this.data.promotionStartDate)
  },

  onReady: function () {
    
  },

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

})