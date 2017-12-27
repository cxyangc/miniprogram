const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circle:{}
  },
  
  toIndex:function(){
    console.log('-------s-------')
    wx.reLaunch({
      url: '/pages/custom_page_index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log('------------扫码-----------------')
    console.log(options)
    let scene = 'shuiguo'
    let inputPlatformNo = options.platformNo;
    console.log("inputPlatformNo:" + inputPlatformNo);
    if (inputPlatformNo) {
      scene = inputPlatformNo;
    }
    app.clientNo = scene

    app.getSetting(that)
    app.checkSession()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    // wx.showLoading()
    
    setTimeout(function () { app.toIndex()},200)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  }

})