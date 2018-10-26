const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    promotionEndDate: { time: '2018-10-27 23:59:59', defaultColor: '', secondColor:''},
    promotionStartDate: { time: '2018-10-25 23:59:59', defaultColor: '', secondColor: '' },
    seckillStartDate: { time: '2018-10-27 23:59:59', defaultColor: '', secondColor: ''},
    mainMenu: [{ index: 0, text: '今日主打' }, { index: 1, text: '秒囤' }, { index: 2, text: '活动预告'}],
    mainMenuIndex:0,
    userInfoWidth:'200',
  },
  tolinkUrl: function (e) {
    console.log(e)
    var a = "product_detail.html?productId=" + e.currentTarget.dataset.id;
    app.linkEvent(a);
  },
  // 主菜单的选择
  selectMainMenu:function(e){
    console.log('====e====',e)
    let index = e.currentTarget.dataset.index
    console.log('====index====', index)
    this.setData({ mainMenuIndex: index})
  },
  // 开启海报
  sharePoster:function(){
    console.log('====sharePoster====')
    this.setData({ posterState:true})
  },
  //关闭海报
  getChilrenPoster:function(){
    this.setData({ posterState: false })
  },
  //点击活动进入活动详情
  toPromotionDetail:function(e){
    console.log('===toPromotionDetail====')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  loginSuccess: function (user) {
    console.log("hello!!!", app.loginUser);
    if (app.loginUser && app.loginUser != "" && app.loginUser.platformUser.mendian) {
      this.setData({
        loginUserMendian: app.loginUser.platformUser.mendian
      })
      this.setData({
        userInfoWidth: app.loginUser.platformUser.mendian.name.length * 32
      })
      this.data.promotionEndDate.background = "#fff" 
      this.data.promotionEndDate.color = this.data.setting.defaultColor
      this.data.promotionEndDate.fontSize = 20
      this.data.promotionStartDate.background = "#fff"
      this.data.promotionStartDate.color = this.data.setting.defaultColor
      this.data.promotionStartDate.fontSize = 20
      this.data.seckillStartDate.background = this.data.setting.secondColor
      this.data.seckillStartDate.color = '#fff'
      this.data.seckillStartDate.fontSize = 26
      this.setData({
        promotionEndDate: this.data.promotionEndDate,
        promotionStartDate: this.data.promotionStartDate,
        seckillStartDate: this.data.seckillStartDate
      })
      console.log('1', this.data.promotionEndDate)
      console.log('2', this.data.promotionStartDate)
      console.log('3', this.data.seckillStartDate)
    }
  },
  onLoad: function (options) {
    console.log('===onLoad==')
    this.getPromotionData();
    console.log("用户信息", app.loginUser)
    this.setData({setting: app.setting.platformSetting})
    console.log("setting", app.setting.platformSetting.logo)
    if (app.loginUser && app.loginUser != "" && app.loginUser.platformUser.mendian) {
      this.loginSuccess(app.loginUser)
    }
    
    var that = this;
    app.addLoginListener(that);
  },
  getPromotionData:function(){
    var that = this
    var customIndex = app.AddClientUrl("/tunzai_index.html", {}, 'get', '1')
    //获取到数据
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("====== res.data=========", res.data)
        let activityPromotion = res.data.activityPromotion;
        let unactivityPromotion = res.data.unactivityPromotion;
        let activityPromotionAll = activityPromotion.concat(unactivityPromotion)

        console.log("activityPromotionAll", activityPromotionAll);
        that.setData({
          activityPromotion: res.data.activityPromotion,
          unactivityPromotion: res.data.unactivityPromotion,
          activityPromotionAll: activityPromotionAll,
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log('------------2222222-----------', res)
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '加载失败，点击【确定】重新加载',
          success: function (res) {
            console.log('', res)
            if (res.confirm) {
              that.getPromotionData();
            } else if (res.cancel) {
              app.toIndex()
            }
          }
        })
      }
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
    wx.stopPullDownRefresh()
  
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log("hahaha",res)
    
  },
})