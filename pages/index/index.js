const app = getApp()
var timer; // 计时器
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

  //定时刷新
  freshLoading: function () {
    let setting  =  app.setting
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log('------------扫码-----------------')
    console.log(options)
    let scene = ''
    let inputPlatformNo = options.platformNo;
    let inputScene = options.shareScene
    console.log("inputPlatformNo:" + inputPlatformNo);
    if (inputPlatformNo) {
      scene = inputPlatformNo;
      app.clientNo = scene
    }
    if (inputScene){
      //这里上传scene
    }

    app.getSetting(that)
    app.wxLogin()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    // wx.showLoading()
   
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.Countdown(app);
  },

  Countdown:function(){
    let that = this
    if (!!app.setting) {
      app.toIndex()
    }
    else {
      timer = setTimeout(function () {
        that.Countdown();
      }, 1000);
    }
  }

})

//定时器
/*  function Countdown(page) {
   console.log('2')
   if (!!page.setting){
     //setTimeout(function () {  }, 200)
     page.toIndex()
   }
   else{
     timer = setTimeout(function () {
       Countdown(page);
     }, 1000);
   }
}; */