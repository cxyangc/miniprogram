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

  //扫推荐码码进入
  loadFromScene: function (inputScene){
    let postParam = {}
    postParam.inputScene = inputScene
    var that = this
    var customIndex = that.AddClientUrl("/wx_mini_code_login.html", postParam, 'post')

          //发起网络请求
          wx.request({
            url: customIndex.url,
            data: customIndex.param,
            header: app.headerPost,
            method: 'POST',
            success: function (e) {
              console.log(e)
            }
          })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log('------------扫码-----------------')
    console.log(options)
    let inputScene = options.shareScene
    
    if (!!inputScene){
      console.log('扫码带参 ------- shareScene')
      console.log(inputScene)
      this.loadFromScene(inputScene)
    }
   
    
    //app.getSetting(that)
    //app.wxLogin()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
   
    this.Countdown(app);
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  Countdown:function(){
    let that = this
    console.log('***')
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