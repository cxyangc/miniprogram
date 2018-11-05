const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seckillStartDate: { endTime: '2018-11-2 23:59:59', defaultColor: '', secondColor: ''},
    mainMenu: [{ index: 0, text: '今日主打' }, { index: 1, text: '秒囤' }, { index: 2, text: '活动预告'}],
    mainMenuIndex:0,
    promotionList: [],
    userInfoWidth:200,
    posterActiveState:false,
    posterState:false,
    promotionId:0,
    productId:0,
    activityPromotionProducts: null,
    unactivityPromotionProducts: null,
    activityPromotion: null,
    unactivityPromotion: null,
  },
  tolinkUrl: function (e) {
    console.log(e)
    var a = "product_detail.html?productId=" + e.currentTarget.dataset.id;
    app.linkEvent(a);
  },
  // 主菜单的选择
  selectMainMenu:function(e){
    console.log('====e====',e)
    app.goTop();
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
    let qrCodeUrl = app.getQrCode(data)
    console.log('qrCodeUrl===', qrCodeUrl)
    this.setData({
      qrCodeUrl: qrCodeUrl
    })
  },
  //关闭海报
  getChilrenPoster:function(){
    this.setData({ posterState: false })
    this.setData({ posterActiveState: false })
  },
  toMyInfo:function(){
    wx.switchTab({
      url: '/pageTab/tunzai/myInfo/index',
    })
  },
  //点击产品详情
  toProductDetail: function (e) {
    console.log(e.currentTarget.dataset.id)
    // product_detail.html?productId= 9219;
    var a = "product_detail.html?productId=" + e.currentTarget.dataset.id;
    app.linkEvent(a);
  },
  //点击活动进入活动详情
  toPromotionDetail:function(e){
    console.log('===toPromotionDetail====',e)
    let promotionId = e.currentTarget.dataset.id ;
    wx.navigateTo({
      url: '/pageTab/tunzai/teMai/index?promotionId=' + promotionId,
    })
  },
  // 开启活动海报
  shareProductPoster: function (event) {
    console.log('====shareProductPoster====', event)
    this.setData({ posterState: true })
    this.setData({ productId: event.currentTarget.dataset.id })
    let data = { type: event.currentTarget.dataset.type, id: event.currentTarget.dataset.id }
    let qrCodeUrl = app.getQrCode(data)
    console.log('qrCodeUrl===', qrCodeUrl)
    this.setData({
      qrCodeUrl: qrCodeUrl
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getLength: function(str){
    var reg = /[a-zA-Z]/g;
    if (reg.test(str)){
      return str.match(/[a-z]/ig).length;
    }
     return 0;
  },
  loginSuccess: function (user) {
    console.log("hello!!!", app.loginUser);
    let that=this
    if (app.loginUser && app.loginUser != "" && app.loginUser.platformUser.mendian) {
      that.setData({
        loginUserMendian: app.loginUser.platformUser.mendian
      })
      let mendianName = app.loginUser.platformUser.mendian.name
      let mendianNameE = this.getLength(mendianName)
      console.log('mendianNameE', mendianNameE, mendianName.length)
      that.setData({
        userInfoWidth: (mendianName.length - mendianNameE) * 32 + mendianNameE*16+10
      })
      console.log(mendianName, that.data.userInfoWidth)
      that.data.seckillStartDate.background = that.data.setting.secondColor
      that.data.seckillStartDate.color = '#fff'
      that.data.seckillStartDate.fontSize = 26
      that.setData({
        seckillStartDate: that.data.seckillStartDate
      })
      console.log('3', this.data.seckillStartDate)
    }
  },
  onLoad: function (options) {
    console.log('===onLoad==')
    var that = this;
    this.setData({ mainMenuIndex: 0 })
    that.getPromotionData();
    console.log("用户信息", app.loginUser)
    that.setData({ setting: app.setting.platformSetting })
    that.setData({ shopId: app.setting.platformSetting.defaultShopBean.id })
    console.log("setting", app.setting.platformSetting.logo)
    if (app.loginUser && app.loginUser != "" && app.loginUser.platformUser.mendian) {
      that.loginSuccess(app.loginUser)
    }
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
        let activityPromotion = res.data.activityPromotion;//已开始的活动.slice(0, 10)
        let unactivityPromotion = res.data.unactivityPromotion;//未开始的活动
        let activityPromotionProducts = res.data.activityPromotionProducts;//已开始的秒杀
        let unactivityPromotionProducts = res.data.unactivityPromotionProducts;//未开始的秒杀
        for (let i = 0; i < activityPromotion.length;i++){
          activityPromotion[i].promotionEndDate = { endTime: activityPromotion[i].endDate, background: "#fff", color: that.data.setting.defaultColor, fontSize:20}
        }
        for (let j = 0; j < unactivityPromotion.length; j++) {
          unactivityPromotion[j].promotionStartDate = { startTime: unactivityPromotion[j].startDate, background: "#fff", color: that.data.setting.defaultColor, fontSize: 20}
        }
        console.log("====== activityPromotion=========", activityPromotion)
        console.log("====== unactivityPromotion=========", unactivityPromotion)
        console.log("====== activityPromotionProducts=========", activityPromotionProducts)
        console.log("====== unactivityPromotionProducts=========", unactivityPromotionProducts)
        that.setData({
          activityPromotion: activityPromotion,
          unactivityPromotion: unactivityPromotion,
          activityPromotionProducts: activityPromotionProducts,
          unactivityPromotionProducts: unactivityPromotionProducts,
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
    let that=this;
    that.onLoad();
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