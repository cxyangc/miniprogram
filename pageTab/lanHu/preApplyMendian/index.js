// pageTab/lanHu/serviceProviders/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let a=""; 
// 查看是否带参数
    if (options.code && options.code!=""){
      console.log("携带的参数", options.code);
      this.setData({
        code: options.code
      })
    }
    else{
      this.setData({
        code: a
      })
    }
 
  },
  tolinkUrl:function(){
    wx.navigateTo({
      url: '/pageTab/lanHu/applyMendian/index?code=' +this.data.code
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