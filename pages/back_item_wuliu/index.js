// pages/back_item_detail/index.js
const app = getApp()
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    setting: null,
  },

  getValues(e){
    console.log(e.detail.value)
    let postParam = {}
    postParam.wuliuCom = e.detail.value.wuliuCom
    postParam.wuliuNo = e.detail.value.wuliuNo
    postParam.shopBackAmountId = this.data.shopBackAmountId
    console.log(postParam)
    if (!postParam.wuliuCom || !postParam.wuliuNo){
      wx.showToast({
        title: "请填写完整",
        image: '/images/icons/tip.png',
        duration: 2000
      })
      return
    }else{
      this.sureBackItem(postParam)
    }
  },
  // 上传
  sureBackItem: function (postParam) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认以上填写信息正确',
      success: function (res) {
        if (res.confirm) {
          var customIndex = app.AddClientUrl("/send_back_order_item_wuliu.html", postParam, 'post')
          wx.request({
            url: customIndex.url,
            data: customIndex.params,
            header: app.headerPost,
            method: 'POST',
            success: function (res) {
              console.log(res.data)
              if (res.data.errcode == '0') {
                wx.showToast({
                  title: '发送成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack()
                }, 2000)
              } else {
                wx.showToast({
                  title: res.data.errMsg,
                  image: '/images/icons/tip.png',
                  duration: 2000
                })
              }
            },
            fail: function (res) {

            }
          })
        } else if (res.cancel) {

        }
      }
    })

  },



  onLoad: function (options) {
    if (!options.shopBackAmountId){
      app.loadFail()
    }
    this.setData({
      shopBackAmountId: options.shopBackAmountId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({ setting: app.setting })
    this.setData({ loginUser: app.loginUser })
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

})