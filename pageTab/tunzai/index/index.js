const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seckillStartDate: { time: '2018-11-2 23:59:59', defaultColor: '', secondColor: ''},
    mainMenu: [{ index: 0, text: '今日主打' }, { index: 1, text: '秒囤' }, { index: 2, text: '活动预告'}],
    mainMenuIndex:0,
    promotionList: [],
    userInfoWidth:'200',
    posterActiveState:false,
    posterState:false,
    promotionId:0,
    productId:0,
  },
  tolinkUrl: function (e) {
    console.log(e)
    var a = "product_detail.html?productId=" + e.currentTarget.dataset.id;
    app.linkEvent(a);
  },
  // 主菜单的选择
  selectMainMenu:function(e){
    console.log('====e====',e)
    let that=this;
    let index = e.currentTarget.dataset.index
    console.log('====index====', index)
    if (index==0){
      this.setData({ promotionList: that.data.activityPromotion})
    } else if (index == 2){
      this.setData({ promotionList: that.data.unactivityPromotion })
    }
    this.setData({ mainMenuIndex: index })
  },
  // 开启活动海报
  shareActivePoster:function(event){
    console.log('====shareActivePoster====', event)
    this.setData({ posterActiveState: true })
    this.setData({ promotionId: event.currentTarget.dataset.id })
    let data = { type: event.currentTarget.dataset.type, id: event.currentTarget.dataset.id}
    this.getQrCode(event.currentTarget.dataset.type);
  },
  //关闭海报
  getChilrenPoster:function(){
    this.setData({ posterState: false })
  },
  //点击活动进入活动详情
  toPromotionDetail:function(e){
    console.log('===toPromotionDetail====',e)
    let promotionId = e.currentTarget.dataset.id ;
    console.log(e.currentTarget.dataset.activitydata)
    let activitydata = JSON.stringify({
      
    })
    wx.navigateTo({
      url: '/pageTab/tunzai/teMai/index?promotionId=' + promotionId + '&promotionData=' + activitydata,
    })
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
      this.data.seckillStartDate.background = this.data.setting.secondColor
      this.data.seckillStartDate.color = '#fff'
      this.data.seckillStartDate.fontSize = 26
      this.setData({
        seckillStartDate: this.data.seckillStartDate
      })
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
        console.log("====== getPromotionData=========", res.data)
        let activityPromotion = res.data.activityPromotion.slice(0,30);
        let unactivityPromotion = res.data.unactivityPromotion;
        let activityPromotionAll = activityPromotion.concat(unactivityPromotion)
        for (let i = 0; i < activityPromotion.length;i++){
          activityPromotion[i].promotionEndDate = { time: activityPromotion[i].endDate, background: "#fff", color: that.data.setting.defaultColor, fontSize:20}
        }
        for (let j = 0; j < unactivityPromotion.length; j++) {
          unactivityPromotion[j].promotionStartDate = { time: unactivityPromotion[j].startDate, background: "#fff", color: that.data.setting.defaultColor, fontSize: 20}
        }
        console.log("====== activityPromotion=========", activityPromotion)
        console.log("====== unactivityPromotion=========", unactivityPromotion)
        console.log("activityPromotionAll", activityPromotionAll);
        that.setData({
          activityPromotion: activityPromotion,
          unactivityPromotion: unactivityPromotion,
          activityPromotionAll: activityPromotionAll,
          promotionList: activityPromotion
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
  // 获取二维码
  getQrCode: function (data) {
    let userId = "";
    if (app.loginUser && app.loginUser.platformUser) {
      userId = 'MINI_PLATFORM_USER_ID_' + app.loginUser.platformUser.id
    }
    console.log("app.loginUser.platformUser", app.loginUser.platformUser.id)
    console.log("data", data)
    // path=pageTab%2findex%2findex%3fAPPLY_SERVER_CHANNEL_CODE%3d'
    let postParam = {}
    let str = '';
    let str2 = '';
    if (data.type == 'active') {
      str = 'SHARE_PROMOTION_PRODUCTS_PAGE'
      str2 = '/super_shop_manager_get_mini_code.html?path=pageTab%2findex%2findex%3fSHARE_PROMOTION_PRODUCTS_PAGE%3d'
      postParam[str] = data.id;
    } else {
      str = 'SHARE_PRODUCT_DETAIL_PAGE'
      str2 = '/super_shop_manager_get_mini_code.html?path=pageTab%2findex%2findex%3fSHARE_PRODUCT_DETAIL_PAGE%3d'
      postParam[str] = data.proId;
    }
    postParam.scene = userId
    console.log(str, str2, postParam)
    // 上面是需要的参数下面的url
    var customIndex = app.AddClientUrl(str2 + postParam[str] + "%26scene%3d" + userId, postParam, 'get', '1')
    var result = customIndex.url.split("?");

    customIndex.url = result[0] + "?" + result[1]

    console.log("customIndex", customIndex.url, result[0])

    var that = this
    that.setData({
      qrCodeUrl: customIndex.url
    })

  }
})