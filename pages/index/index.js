const app = getApp()
var timer11; // 计时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  
  toIndex:function(){
    wx.reLaunch({
      url: '/pages/custom_page_index/index',
    })
  },

  opt:{},
  onLoad: function (options) {
    console.log('---------index - onload ---------')
    console.log(options) 
    app.shareParam = options
    //转发的数据都在这里，   这时候的scene已经被app.unlunch使用了。   
    ///我们这里只需要把参数解析一下？放全局，等跳到首页的时候再做跳转
  },

  onReady: function () {
    let that = this
   
    this.Countdown(app);
    
  },

  onShow: function () {
    if (app.appHide) {
      app.appHide = false
      app.onLaunch(app.onLaunchOptions)
    }
  },
  count:10,
  Countdown:function(){
    let that = this
    --this.count;
    console.log('-------a--------')
    if (app.setting ) {
      clearTimeout(timer11)
      app.toIndex()
      return false;
    }
    if (this.count < 1){
      wx.showModal({
        title: '网络错误',
        content: '当前网络不通畅，初始化场景失败。请确认你的网络正常',
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {
            app.toIndex()
          }
        }
      })
      clearTimeout(timer11)
      return false;
    }
    else {
      timer11 = setTimeout(function () {
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