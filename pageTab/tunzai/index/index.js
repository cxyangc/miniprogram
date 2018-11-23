const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainMenu: [
      { index: 0, name: '今日主打', data: [], params: { status: '1', promotionType: 0, page: 1},brandList:[]}, 
      { index: 1, name: '秒囤', data: [], params: { status: '1', promotionType: 2,page: 1}}, 
      { index: 2, name: '活动预告', data: [], params: { status: '0', promotionType: 0, page: 1 }, brandList: []}
    ],
    mainMenuIndex:0,
    sysWidth: 320,
    sysHeight: 568,
    promotionList: [],
    userInfoWidth:200,
    posterActiveState:false,
    posterState:false,
    promotionId:0,
    productId:0,
    showIndex:0,
    topHeight:220,
    setting:null,
    searchIconToLeft:170,
    hidePageState:false,
    options:{},
  },
  tolinkUrl: function (e) {
    console.log(e)
    var a = "product_detail.html?productId=" + e.currentTarget.dataset.id;
    app.linkEvent(a);
  },
  shareBtn: function (e) {
    let that = this;
    console.log('====e====', e, that.data.showIndex);
    let index = e.target.dataset.id || e.currentTarget.dataset.id
    that.setData({ showIndex: index })
    
  },

  // 主菜单的选择
  selectMainMenu:function(e){
    console.log('====e====',e)
    // app.goTop();
    let that=this;
    let index=0;
    that.closedTimers();
    if (!e) {
       index=0
    }else{
       index = e.currentTarget.dataset.index
    }
    if (!index){
      index=0;
    }
    let mainMenu = this.data.mainMenu
    let currentData = mainMenu[index]
    console.log('====index====', index)
    console.log('=====currentData====', currentData)
    if (index != 1 && (!currentData.data || currentData.data.length == 0)) {
      console.log('===滑到活动===', index)
      that.getPromotionData(currentData, index)
      that.gainBrandData(currentData, index)
    } else if (index == 1 && (!currentData.data || currentData.data.length == 0)) {
      console.log('===滑到秒杀===', index)
      that.getSeckillData(currentData, index)
    }
    that.setData({ mainMenuIndex: index })
    that.startTimers();
  },
  /* 滑动事件 */
  // changeIndex: function (e) {
  //   console.log('=====e====', e)
  //   let that=this;
  //   let index = e.detail.current
  //   let mainMenu = this.data.mainMenu
  //   let currentData = mainMenu[index]
  //   console.log('=====currentData====', currentData)
  //   if (index != 1 && (!currentData.data || currentData.data.length == 0)) {
  //     console.log('===滑到活动===',index)
  //     that.getPromotionData(currentData, index)
  //   } else if (index == 1 && (!currentData.data || currentData.data.length == 0)){
  //     console.log('===滑到秒杀===', index)
  //     that.getSeckillData(currentData, index)
  //   }
  //   that.setData({ mainMenuIndex: index })
  // },
  // 开启活动海报
  shareActivePoster:function(event){
    console.log('====shareActivePoster====', event)
    this.setData({ showIndex: 0 })
    this.setData({ posterActiveState: true })
    this.setData({ promotionId: event.currentTarget.dataset.id })
    let data = { type: event.currentTarget.dataset.type, id: event.currentTarget.dataset.id}
    let qrCodeUrl = app.getQrCode(data)
    console.log('qrCodeUrl===', qrCodeUrl)
    this.setData({
      qrCodeUrl: qrCodeUrl
    })
  },
  shareActivePages: function (event){
    console.log('====shareActivePages====', event)
    this.setData({ showIndex: 0 })
  },
  //关闭海报
  getChilrenPoster:function(){
    this.setData({ posterState: false })
    this.setData({ posterActiveState: false })
  },
  toMyInfo: function () {
    app.toMy();
  },
  //点击产品详情
  toProductDetail: function (e) {
    console.log(e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.stock<=0){
      wx.showToast({
        title: '已抢光',
        icon: 'fail',
        duration: 1000,
        mask: true
      })
    }else{
      var a = "product_detail.html?productId=" + e.currentTarget.dataset.id;
      app.linkEvent(a);
    }
  },
  //点击活动进入活动详情
  toPromotionDetail:function(e){
    console.log('===toPromotionDetail====', e)
    this.setData({ showIndex: 0 })
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
    that.setData({loginUser: app.loginUser})
    if (app.loginUser && app.loginUser != "" && app.loginUser.platformUser.mendian) {
      that.setData({
        loginUserMendian: app.loginUser.platformUser.mendian
      })
      let mendianName = app.loginUser.platformUser.mendian.name
      let mendianNameE = this.getLength(mendianName)
      console.log('mendianNameE', mendianNameE, mendianName.length)
      that.setData({
        userInfoWidth: (mendianName.length - mendianNameE) * 32 + mendianNameE * 16 + 10
      })
      console.log(mendianName, that.data.userInfoWidth)
    }
  },
  loginFailed:function(err){
  console.log("login failed!!");
   
},
  onLoad: function (options) {
    console.log('===onLoad==',options)
    var that = this;
    that.data.options = options
    if (app.setting) {
      that.data.setting = app.setting.platformSetting;
      that.setData({ setting: that.data.setting })
    }
    console.log("用户信息", app.loginUser)
    if (app.loginUser && app.loginUser != "") {
      that.loginSuccess(app.loginUser)
    }
    app.addLoginListener(that);
    this.selectMainMenu();
  },
  searchProduct:function(e){
    console.log('===searchProduct===',e)
    var product = e.detail.value
    console.log(product)
    var param = {}
    param.productName = product
    let postParam = app.jsonToStr(param)
    let url = 'search_product.html' + postParam
    app.linkEvent(url);
 
  },
  searchProductValue: function (e) {
    console.log('===searchProductValue===', e)
  },
  changeInputOne:function(){
    this.setData({ searchIconToLeft: '170', shadowNum:0 })
  }, 
  changeInputTwo: function () {
    this.setData({ searchIconToLeft: '40', shadowNum: 2 })
  },
  // init: function (options){
  //   let that=this;
  //   let index = options.index
  //   if (!index) {
  //     index = 0;
  //   }
  //   let mainMenu = that.data.mainMenu[index]
  //   console.log('mainMenu', mainMenu)
  //   that.setData({ mainMenuIndex: index })
  //   that.getPromotionData(mainMenu, index);
  //   that.gainBrandData(mainMenu, index)
   
  // },
  gainBrandData: function (currentData, index, isFresh){
    var that = this;
    console.log("====== currentData=========", currentData);
    let mainMenu = that.data.mainMenu;
    let params = currentData.params
    var customIndex = app.AddClientUrl("/get_promotion_brands.html", params, 'get');
    //获取到数据
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("====== gainBrandData=========", res.data);
        if (res.data.errcode == '0') {
          let result = res.data.relateObj;
          if (isFresh) {
            currentData.brandList = []
          }
          if (!result || result.length == 0) {
            currentData.brandList = null
          } else {
            currentData.brandList = result
          }
          mainMenu[index] = currentData
          that.setData({
            mainMenu: mainMenu
          })
        } else {
          console.log('error')
        }
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
              that.gainBrandData(currentData, index);
            } else if (res.cancel) {
              app.toIndex()
            }
          }
        })
      }
    })
  },
  // 今日主打和明日预告
  getPromotionData: function (currentData, index, isFresh){
    var that = this;
    console.log("====== currentData=========", currentData);
    console.log("====== that.data.setting=========", that.data.setting);
    let mainMenu = that.data.mainMenu;
    let params = currentData.params
    var customIndex = app.AddClientUrl("/get_promotions.html", params, 'get')
    //获取到数据
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("====== getPromotionData=========", res.data);
        if (res.data.errcode == '0') {
          let result = res.data.relateObj.result;
          if(index==0){
            for (let i = 0; i < result.length; i++) {
              result[i].promotionEndDate = { endTime: result[i].endDate, background: "#fff", color: that.data.setting.defaultColor, fontSize: 28, type: 'activityPromotionTimer'}
            }
          }else if(index==2){
            for (let j = 0; j < result.length; j++) {
              result[j].promotionStartDate = { startTime: result[j].startDate, background: "#fff", color: that.data.setting.defaultColor, fontSize: 28, type: 'unActivityPromotionTimer'}
            }
          }
          console.log(result)
          if (isFresh) {
            console.log('=====刷新数据====')
            currentData.data = []
          }
          if ((!result || result.length == 0) && currentData.params.page==1) {
            currentData.data = []
          } else {
            currentData.data = currentData.data.concat(result)
          }
         
        //  mainMenu[index] = currentData
          that.setData({
            mainMenu: mainMenu
          })
          currentData.params.pageSize = res.data.relateObj.pageSize
          currentData.params.totalSize = res.data.relateObj.totalSize
        } else {
          console.log('error')
        }
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
              that.getPromotionData(currentData, index);
            } else if (res.cancel) {
              app.toIndex()
            }
          }
        })
      }
    })
  }, 
  // 秒囤产品
  getSeckillData: function (currentData, index, isFresh) {
    console.log("====== currentData=========", currentData);
    var that = this;
    let mainMenu = that.data.mainMenu;
    let params = currentData.params
    var customIndex = app.AddClientUrl("/get_promotions_products.html", params, 'get')
    //获取到数据
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("====== getSeckillData=========", res.data);
        if (res.data.errcode == '0') {
          let result = res.data.relateObj.result;
          for (let i = 0; i < result.length; i++) {
            result[i].seckillEndDate = { endTime: result[i].end_date, background: that.data.setting.secondColor, color: "#fff", fontSize: 28, type:'seckillTimer'}
          }
          if (isFresh) {
            currentData.data = []
          }
          if ((!result || result.length == 0) && currentData.params.page==1) {
            currentData.data = null
          } else {
            currentData.data = currentData.data.concat(result)
          }
          mainMenu[index] = currentData
          that.setData({
            mainMenu: mainMenu
          })
          currentData.params.pageSize = res.data.relateObj.pageSize
          currentData.params.totalSize = res.data.relateObj.totalSize
        } else {
          console.log('error')
        }
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
              that.getSeckillData(currentData,index);
            } else if (res.cancel) {
              app.toIndex()
            }
          }
        })
      }
    })
  },
  /* 加载更多 */
  // scrollBottomToLoadMore: function (e) {
  //   let that = this
  //   console.log('=====scrollBottomToLoadMore====', e)
  //   console.log(this.loading)
  //   let index = e.currentTarget.dataset.index
  //   let mainMenu = that.data.mainMenu
  //   let currentData = mainMenu[index]
  //   console.log('=====currentData====', currentData)
  //   that.loading = true
  //   if (currentData.params.totalSize > currentData.params.curPage * currentData.params.pageSize && that.loading) {
  //     console.log('hasMore')
  //     that.loading = false
  //     ++currentData.params.page;
  //     if (index == 0 || index == 2) {
  //       console.log('==getPromotionData===')
  //       that.getPromotionData(currentData, index, '', function () {
  //         console.log('success====getPromotionData');
  //         that.loading = true
  //       })
  //     }else if(index==1){
  //       console.log('==getSeckillData===')
  //       this.getSeckillData(currentData, index, '', function () {
  //         console.log('success====getSeckillData');
  //         that.loading = true
  //       })
  //     }else{
  //       console.log('==null===')
  //     }
  //   } else {
  //     that.loading = false
  //     console.log('到底了...')
  //     wx.showToast({
  //       title: '到底了',
  //       icon: 'succes',
  //       duration: 1000,
  //       mask: true
  //     })
  //   }
  // },
  // scrollTopToReflesh:function(e){
  //   console.log('=====scrollTopToReflesh====', e)
  //   let that=this;
  //   let index = e.currentTarget.dataset.index
  //   let mainMenu = that.data.mainMenu
  //   let currentData = mainMenu[index]
  //   currentData.params.page = 1
  //   currentData.params.curPage = 1
  //   if (index != 1 ) {
  //     console.log('===滑到活动===', index)
  //     that.getPromotionData(currentData, index, 1)
  //     that.gainBrandData(currentData, index,1)
  //   } else if (index == 1) {
  //     console.log('===滑到秒杀===', index)
  //     that.getSeckillData(currentData, index,1)
  //   }
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that=this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          sysWidth: res.windowHeight,
          sysHeight: res.windowHeight,
        });
      }
    });
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    console.log('===显示==')
    //that.init(that.data.options)
    that.startTimers();
    
  },
startTimers:function(){
  var activityPromotionTimers = this.selectAllComponents(".activityPromotionTimer");
  var unActivityPromotionTimers = this.selectAllComponents(".unActivityPromotionTimer");
  var seckillTimers = this.selectAllComponents(".seckillTimer");

  if (activityPromotionTimers != null) {
    for (let i = 0; i < activityPromotionTimers.length; i++) {
      try { activityPromotionTimers[i].containerHide(); } catch (e) { }
    }
  }
  if (unActivityPromotionTimers != null) {
    for (let i = 0; i < unActivityPromotionTimers.length; i++) {
      try { unActivityPromotionTimers[i].containerHide(); } catch (e) { }
    }
  }
  if (seckillTimers != null) {
    for (let i = 0; i < seckillTimers.length; i++) {
      try { seckillTimers[i].containerHide(); } catch (e) { }
    }
  }
  var timers = activityPromotionTimers;
  if(this.data.mainMenuIndex==0){
    timers = activityPromotionTimers;
  }else if(this.data.mainMenuIndex==1){
    timers = seckillTimers;
  }else if(this.data.mainMenuIndex=2){
    timers = unActivityPromotionTimers;
  }
 
  if (timers != null) {
    for (let i = 0; i < timers.length; i++) {
      try { timers[i].containerShow(); } catch (e) { }
      }
  } 
},
  closedTimers: function () {
    var activityPromotionTimers = this.selectAllComponents(".activityPromotionTimer");
    var unActivityPromotionTimers = this.selectAllComponents(".unActivityPromotionTimer");
    var seckillTimers = this.selectAllComponents(".seckillTimer");
    if (activityPromotionTimers != null) {
      for (let i = 0; i < activityPromotionTimers.length; i++) {
        try { activityPromotionTimers[i].containerHide(); } catch (e) { }
      }
    }
    if (unActivityPromotionTimers != null) {
      for (let i = 0; i < unActivityPromotionTimers.length; i++) {
        try { unActivityPromotionTimers[i].containerHide(); } catch (e) { }
      }
    }
    if (seckillTimers != null) {
      for (let i = 0; i < seckillTimers.length; i++) {
        try { seckillTimers[i].containerHide(); } catch (e) { }
      }
    } 
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('tuichu onhide=========', this.selectAllComponents(".timer").length);
    this.closedTimers();
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('tuichu onunload=========', this.data.hidePageState)
    this.closedTimers();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    console.log('=====onPullDownRefresh====', that.data.mainMenuIndex)
    let index =that.data.mainMenuIndex
    let mainMenu = that.data.mainMenu
    let currentData = mainMenu[index]
    currentData.params.page = 1
    if (index != 1) {
      console.log('===滑到活动===', index)
      that.getPromotionData(currentData, index, 1)
      that.gainBrandData(currentData, index, 1)
    } else if (index == 1) {
      console.log('===滑到秒杀===', index)
      that.getSeckillData(currentData, index, 1)
    }
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    console.log('=====onReachBottom====')
    let index = that.data.mainMenuIndex
    let mainMenu = that.data.mainMenu
    let currentData = mainMenu[index]
    console.log('=====currentData====', currentData)
    if (currentData.params.totalSize > currentData.params.page * currentData.params.pageSize) {
      ++currentData.params.page;
      if (index == 0 || index == 2) {
        console.log('==getPromotionData===')
        that.getPromotionData(currentData, index)
      } else if (index == 1) {
        console.log('==getSeckillData===')
        this.getSeckillData(currentData, index)
      } else {
        console.log('==null===')
      }
    } else {
      console.log('到底了...')
      wx.showToast({
        title: '到底了',
        icon: 'success',
        duration: 1000,
        mask: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log("hahaha",res)
    let that = this;
    if (res.target){
      let type = res.target.dataset.type
      if (res.from == "button" && type == 'product') {
        console.log('转发产品', res.target.dataset.item)
        let id = res.target.dataset.item.product_id
        let focusData = res.target.dataset.item
        if (!focusData.brandName || focusData.brandName == "") {
          focusData.brandName = ""
        };
        let imageUrl = focusData.product_icon
        let shareName = '活动价：￥' + focusData.price + '(原价：￥' + focusData.tag_price + ')' + focusData.brandName + focusData.product_name;
        let shareParams = {}
        shareParams.productName = focusData.name
        console.log('nnnnnnnnnn' + shareName)
        shareParams.id = id
        console.log("shareParams", shareParams)
        return app.shareForFx2('promotion_products', shareName, shareParams, imageUrl)
      } else {
        console.log('转发活动')
        let title = res.target.dataset.name;
        let id = res.target.dataset.id;
        let banner = res.target.dataset.banner;
        let params = {};
        params.promotionId = id;
        params.title = title;
        params.SHARE_PROMOTION_PRODUCTS_PAGE = id
        console.log('params:' + JSON.stringify(params))
        return app.shareForFx2('promotion_products', '', params, banner)
      }
    }else{
      let that = this
      let params = {}
      params.pageName = "index";
      console.log('params:' + JSON.stringify(params))
      return app.shareForFx2('index', '', params)
    }
    
  },
  
})