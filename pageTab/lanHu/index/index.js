var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  //  分享
    focusIndex: 0,
    showShare:[],


    screenHeight:"",//手机高度
    activityPromotion: [],//已经开始的活动
    unactivityPromotion:[],//还未开始的活动
    sysWidth: "",
    currentTab: "",
    platformSetting:"",//信息
    countDownList:[],
    countDownList1:[],
    toView: 'inToView01',
    getProductData:[],//商品列表
    activityPromotionAll:[],
    productData:[],//加入购物车用的商品数据

    //规格信息
    showCount: false,
    focusData: null,
    measurementJson: null,
    // 海报
    posterState:false
  },
  //防止点击穿透 背景层
  preventD: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  loginSuccess:function(user){
    console.log("hello!!!", app.loginUser);
    if (app.loginUser && app.loginUser != "" && app.loginUser.platformUser.mendian) {
      this.setData({
        loginUser: app.loginUser.platformUser.mendian
      })
    }
  },
  onLoad: function (options) {
    this.getData();
    this.getProductData()
   
    console.log("用户信息", app.loginUser)
    if (app.loginUser && app.loginUser != "" && app.loginUser.platformUser.mendian){
      this.setData({
        loginUser: app.loginUser.platformUser.mendian
      })
    }
    console.log("setting", app.setting.platformSetting.logo)
    this.setData({
      logo: app.setting.platformSetting.logo
    })
    var that=this;
    app.addLoginListener(this);

 
   
  },
  getData: function () {
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
        // productData:商品数据 加入购物车用的
        var index="0"
        var productData=[];
        for (var i = 0; i < activityPromotion.length;i++){
            index=i;
         
            productData = productData.concat(activityPromotion[index].products);
         
        }
        let showShare = that.data.showShare
        let num = 0;
        for (var a = 0; a < productData.length; a++) {
          num = a;
          showShare[num] = false;

        }
      that.setData({
        activityPromotion: res.data.activityPromotion,
        unactivityPromotion: res.data.unactivityPromotion,
        activityPromotionAll: activityPromotionAll,
        productData: productData,
        showShare: showShare
          })
        wx.hideLoading()
      
  
          that.getTimeAll();
          that.ungetTimeAll();

     
   

       
      },
      fail: function (res) {
        console.log('------------2222222-----------')
        console.log(res)
        wx.hideLoading()

      

        wx.showModal({
          title: '提示',
          content: '加载失败，点击【确定】重新加载',
          success: function (res) {

            if (res.confirm) {
              that.getParac()
            } else if (res.cancel) {
              app.toIndex()
            }
          }
        })
      }
    })
  }, 
  listPage: {
    page: 1,
    pageSize: 0,
    totalSize: 0,
    curpage: 1
  },
  params: {
    categoryId: "",
    platformNo: "",
    belongShop: "",
    typeBelongShop: "",
    page: 1,
    showType: "",
    showColumn: "",
    productName: "",
    startPrice: "",
    endPrice: "",
    orderType: "",
    saleTypeId: "",
    promotionId: "",
    shopProductType: "",
  },
  /* 获取商品数据 */
  getProductData: function (param, ifAdd) {
    //根据把param变成&a=1&b=2的模式
    if (!ifAdd) {
      ifAdd = 1
    }
  
    // param.page = this.listPage.page
    var customIndex = app.AddClientUrl("/more_product_list.html", param, 'get', '1')
    wx.showLoading({
      title: 'loading'
    })
    var that = this


    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("商品数据", res.data.result)
        that.listPage.pageSize = res.data.pageSize
        that.listPage.curPage = res.data.curPage
        that.listPage.totalSize = res.data.totalSize
        let dataArr = that.data.getProductData

        if (ifAdd == 2) {
          dataArr = []
        }
        if (!res.data.result || res.data.result.length == 0) {
          that.setData({ getProductData: null })
        } else {
          if (dataArr == null) { dataArr = [] }
          dataArr = dataArr.concat(res.data.result)
          that.setData({ getProductData: dataArr })
        }

        wx.hideLoading()
      },
      fail: function (res) {
        console.log("fail")
        wx.hideLoading()
        app.loadFail()
      }
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {

    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    console.log(e.currentTarget.dataset.id)
    var _id = e.target.dataset.id;
    this.setData({
      toView: 'inToView' + _id
    })
    console.log("toView", this.data.toView)
    var that = this;
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }

  
  },
  // 制作锚点
  anchor:function(e){
    console.log(e.currentTarget.dataset.id)
    var _id = e.target.dataset.id;
    this.setData({
      toView: 'inToView' + _id
    })
  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  getTimeAll:function(){

    var me = this;
    // 已经开始的活动
      var arr = [];
      // console.log("长度", this.data.activityPromotion.length);
      var dataLength = me.data.activityPromotion.length;
      // 循环出项目的个数,添加到arr中
      for (var a = 0; a < dataLength; a++) {
        arr[a]=me.data.activityPromotion[a].endDate
      }
      me.setData({ actEndTimeList: arr })
      var interval = setInterval(function () {
        // 获取当前时间，同时得到活动结束时间数组
        let newTime = new Date().getTime();
        let endTimeList = me.data.actEndTimeList;
        let countDownArr = [];
        let endTime1 = new Date(arr[0]).getTime();
        // 对结束时间进行处理渲染到页面
        endTimeList.forEach(o => {
          let endTime = new Date(o.replace(/-/g, '/')).getTime();
          let obj = null;
       
          // 如果活动未结束，对时间进行处理
          if (endTime - newTime > 0) {
            let time = (endTime - newTime) / 1000;
           
            // 获取天、时、分、秒
            let day = parseInt(time / (60 * 60 * 24));
            let hou = parseInt(time % (60 * 60 * 24) / 3600);
            let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
            obj = {
              day: me.timeFormat(day),
              hou: me.timeFormat(hou),
              min: me.timeFormat(min),
              sec: me.timeFormat(sec)
            }
          } else {//活动已结束，全部设置为'00'
            obj = {
              day: '00',
              hou: '00',
              min: '00',
              sec: '00'
            }
          }
          countDownArr.push(obj);
        })
        // 渲染，然后每隔一秒执行一次倒计时函数
        this.setData({ countDownList: countDownArr })
        // console.log(this.data.countDownList)

      }.bind(this), 1000);
  
  },
  ungetTimeAll: function () {
    var me = this;
    var oldData = this.data;
    // 已经开始的活动
    var arr = [];
    console.log(oldData.unactivityPromotion.length);
    var dataLength = oldData.unactivityPromotion.length;
    // 循环出项目的个数,添加到arr中
    for (var a = 0; a < dataLength; a++) {
      // console.log(oldData.unactivityPromotion[a].startDate)
      arr.push(oldData.unactivityPromotion[a].startDate)
    }
    me.setData({ actEndTimeList1: arr })

    var interval = setInterval(function () {
      // 获取当前时间，同时得到活动结束时间数组
      let newTime = new Date().getTime();
      let endTimeList = oldData.actEndTimeList1;
      let countDownArr = [];

      // 对结束时间进行处理渲染到页面
      endTimeList.forEach(o => {
        let endTime = new Date(o.replace(/-/g, '/')).getTime();
        let obj = null;
        // 如果活动未结束，对时间进行处理
        if (endTime - newTime > 0) {
          let time = (endTime - newTime) / 1000;
          // 获取天、时、分、秒
          let day = parseInt(time / (60 * 60 * 24));
          let hou = parseInt(time % (60 * 60 * 24) / 3600);
          let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
          let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
          obj = {
            day: me.timeFormat(day),
            hou: me.timeFormat(hou),
            min: me.timeFormat(min),
            sec: me.timeFormat(sec)
          }
        } else {//活动已结束，全部设置为'00'
          obj = {
            day: '00',
            hou: '00',
            min: '00',
            sec: '00'
          }
        }
        countDownArr.push(obj);
      })
      // 渲染，然后每隔一秒执行一次倒计时函数
      this.setData({ countDownList1: countDownArr })
      // console.log(oldData.countDownList1)

    }.bind(this), 1000);

  },
  timeFormat: function (param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  tolinkUrl:function(e){
    console.log(e)
    var a = "product_detail.html?productId=" + e.currentTarget.dataset.id;
    app.linkEvent(a);
  },
  // 关闭分享
  closeShowShar:function(){

    // 循环activityPromotion
    let activityPromotion = this.data.activityPromotion

    let a = 0;
    let b = 0;

    for (let i = 0; i < activityPromotion.length; i++) {
      a = i;
      //  console.log(activityPromotion[a].products)
      if (activityPromotion[a].products&&activityPromotion[a].products.length > 0) {
        for (let j = 0; j < activityPromotion[a].products.length; j++) {
          b = j;  
            activityPromotion[a].products[b].productShow = false
        }
      }
    }
    this.setData({
      activityPromotion: activityPromotion
    })
  },
  click:function (e) {
    console.log(e)
    // this.closeShowShar();
    wx.navigateTo({
      url: '/pageTab/lanHu/teMai/index?promotionId=' + e.currentTarget.dataset.id,
    })
  },
  click1: function (e) {
    console.log(e)
    this.closeShowShar()
    wx.navigateTo({
      url: '../../../pages/promotion_detail/index?promotionId=' + e.currentTarget.dataset.id,
    })
    
  },
  tiaoZhuan: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../teMai/index'
    })
  },
  // 搜索
  searchProduct: function (e) {
    var product = e.detail.value
    console.log(product)
    var param = {}
    param.productName = product
    let postParam = app.jsonToStr(param)
    wx.navigateTo({
      url: '/pages/search_product/index' + postParam
    })
  },
  // 搜索中输入文字的时候
  searchProductValue:function(e){
    let productName = e.detail.value
    console.log("productName", productName)
    this.setData({
      searchproductName: productName
    })
  },
  searchProductTwo:function(e){
 
    let product = this.data.searchproductName
    var param = {}
    param.productName = product
    let postParam = app.jsonToStr(param)
    wx.navigateTo({
      url: '/pages/search_product/index' + postParam
    })
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
    this.getData();
  
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.listPage.totalSize > that.listPage.curPage * that.listPage.pageSize) {
      that.listPage.page++
      that.params.page++
      this.getProductData(this.params);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log("hahaha",res)
    if (res.from == "button") {
      // 商品id
      let id = res.target.dataset.id
      let productData = this.data.productData

      console.log("this.data.productData", this.data.productData)
  let index = 0;

  for (let i = 0; i < productData.length;i++){
        
    if (productData[i].id==id ){
      console.log(productData[i],i)
          index=i;
          }
      }

   

      let focusData = productData[index]

      console.log("focusData", focusData)
      if (!focusData.brandName || focusData.brandName == "") {
        focusData.brandName = ""
      };
      let imageUrl = focusData.imagePath

      let shareName = '活动价：￥' + focusData.price + '(原价：￥' + focusData.tagPrice + ')' + focusData.brandName + focusData.name

      let shareParams = this.opt
      shareParams.productName = focusData.productCode
      console.log('nnnnnnnnnn' + shareName)
      console.log("MMMMMMMMMMMMMMM", index)

 
      
      shareParams.id = id
      console.log("shareParams", shareParams)
      return app.shareForFx2('promotion_products', shareName, shareParams, imageUrl)
    }

    else {
      let that = this
      let params = that.opt
      params.pageName="index";
      console.log('params:' + JSON.stringify(params))
      return app.shareForFx2('index', '', params)
    }
  },
  
// 测试用的跳转到promotion_products页面
  tolinkUrl1: function (event) {
    console.log("link",event.currentTarget.dataset.link)
    app.linkEvent(event.currentTarget.dataset.link);

  },


  /* 全部参数 */
  params: {
    page: 1,
    promotionId: "",
    productName: '',
    pageSize: 0,
    totalSize: 0,
    curpage: 1
  },
  byNowParams: {
    productId: '',
    itemCount: 1,
    shopId: '',
    cartesianId: '0',
    orderType: ''
  },
  subNum: function () {
    if (this.byNowParams.itemCount == 1) {
      return
    }
    this.byNowParams.itemCount--;
    this.setData({ byNowParams: this.byNowParams })
  },
  addNum: function (e) {
    let cantadd = e.currentTarget.dataset.cantadd;
    if (cantadd == 1) {
      return
    } else {
      this.byNowParams.itemCount++;
      this.setData({ byNowParams: this.byNowParams })
    }
  },

  //点击加入购物车或立即下单
  bindAddtocart: function (e) {
    console.log("56565555555555555555555555", e.detail.e.target.dataset.id);
    var id = e.detail.e.target.dataset.id;
    console.log("id", id)
    this.dellBindItem(id, 'addto')
  },
  bindBuy: function (e) {
    var index = e.currentTarget.dataset.index;
    this.dellBindItem(index, 'tobuy')
  },
  dellBindItem: function (id, bindType) {
   
    let productData = this.data.productData
    console.log("productData", productData,id)
    let index=0;
      let focusData = "";
    for (let i = 0; i < productData.length;i++){
     index=i;
      if (productData[index].id==id){
        console.log(productData[index])
        focusData = productData[index]
     }
    }


    this.byNowParams.productId = focusData.id
    this.byNowParams.shopId = focusData.belongShopId
    this.byNowParams.orderType = 0
    this.chooseMeasureItem(focusData)
    console.log(focusData)
    this.setData({
      focusData: focusData,
      showCount: true,
      byNowParams: this.byNowParams,
      bindType: bindType
    })
  },
  buyNow: function () {
    console.log(this.byNowParams)
    if (!app.checkShopOpenTime()) {
      return
    }

    if (!app.checkIfLogin()) {
      return
    }
    if (this.data.bindType == 'addto') {
      //加入购物车
      console.log('加入购物车')
      this.addtocart()
    } else {
      //立即购买
      console.log('立即购买')
      this.createOrder22(this.byNowParams)
    }

  },

  /* 加入購物車 */
  addtocart: function () {

    if (!app.checkIfLogin()) {

      return
    }
    var params = {
      cartesianId: '',
      productId: '',
      shopId: '',
      count: '',
      type: '',
    }

    if (!this.data.focusData.measureItem || this.data.focusData.measureTypes.length == 0) {
      params.cartesianId = '0'
    }
    else {
      params.cartesianId = this.data.measurementJson.id
    }

    params.productId = this.data.focusData.id
    params.shopId = this.data.focusData.belongShopId
    params.count = this.byNowParams.itemCount
    params.type = 'add'

    this.postParams(params)

  },

  getCart: function () {

    var params = {}
    params.productId = 0
    params.count = 0
    params.type = 'add'
    this.postParams(params)
  },
  postParams: function (data) {
    var that = this
    var customIndex = app.AddClientUrl("/change_shopping_car_item.html", data, 'post')
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        console.log('---------------change_shopping_car_item-----------------')
        console.log(res.data)
        wx.hideLoading()

        if (that.data.bindType == 'addto') {
          that.setData({ showCount: false })
        }
        if (data.productId == 0) {
          console.log('购物车里面的商品数量')
          that.setData({
            carCount: res.data.totalCarItemCount
          })
        } else {
          if (res.data.productId && res.data.productId != 0) {
            that.setData({
              carCount: res.data.totalCarItemCount
            })
            if (data.count == 0) {
              console.log('通过加入购物车来确定购物车里面的商品数量')
            } else {
              wx.showToast({
                title: '加入购物车成功',
              })
            }
          } else {
            wx.showToast({
              title: res.data.errMsg,
              image: '/images/icons/tip.png',
              duration: 3000
            })
          }
        }



      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },

  /* 创建订单 */
  createOrder22: function (o) {
    var customIndex = app.AddClientUrl("/buy_now.html", o, 'post')
    var that = this
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (!!res.data.orderNo) {
          wx.hideLoading()
          wx.navigateTo({
            url: '/pages/edit_order/index?orderNo=' + res.data.orderNo,
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.errMsg,
            image: '/images/icons/tip.png',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      },
      complete: function (res) {

      }
    })
  },
  closeZhezhao: function () {
    this.MeasureParams = []
    this.setData({ showCount: false, focusData: null })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  opt: {},
  loadOpt: function (options) {
    // 设置页面标题
    if (options.description) {
      this.setData({
        acReport: decodeURIComponent(options.description)
      })
    }
    let navName = options.navName
    if (navName) {
      wx.setNavigationBarTitle({
        title: navName,
      })
    }

  },

  /* 
     规格操作
  */
  MeasureParams: [],

  //获取规格价格参数
  get_measure_cartesion: function () {
    this.byNowParams.cartesianId = -1
    let productId = this.data.focusData.id
    let postStr = ''
    if (this.MeasureParams.length == 0) {
      this.byNowParams.cartesianId = '0'
      return
    }
    for (let i = 0; i < this.MeasureParams.length; i++) {
      postStr += this.MeasureParams[i].value + ','
    }
    let param = {}
    param.productId = productId
    param.measureIds = postStr
    let customIndex = app.AddClientUrl("/get_measure_cartesion.html", param)

    var that = this
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        if (!res.data.id) {
          // 没有这个参数
          //......
          console.log('error')
          //.....
        }
        console.log(res.data)
        that.byNowParams.cartesianId = res.data.id
        that.setData({
          measurementJson: res.data
        })
      },
      fail: function (res) {
        console.log("fail")
        app.loadFail()
      },
      complete: function () {
      },
    })
  },
  /* 初始化 选规格 */
  chooseMeasureItem: function (focusData) {
    console.log('----------初始化规格参数-----------')
    if (!focusData.measureItem) {
      return
    }
    for (let i = 0; i < focusData.measureTypes.length; i++) {
      focusData.measureTypes[i].checkedMeasureItem = 0
      //初始化选择的数据
      let param = {}
      param.name = focusData.measureTypes[i].name
      param.value = focusData.measureTypes[i].productAssignMeasure[0].id

      this.MeasureParams.push(param)
     
    }
    console.log(focusData.measureTypes.length)
    this.setData({
      focusData: focusData
    })
    this.get_measure_cartesion()
  },
  //选择规格小巷的---显示
  radioChange: function (e) {
    let index = e.currentTarget.dataset.index
    let indexJson = app.getSpaceStr(index, '-')
    //console.log(indexJson)

    let focusData = this.data.focusData
    focusData.measureTypes[indexJson.str1].checkedMeasureItem = indexJson.str2
    this.setData({ focusData: focusData })
  },
  //选择规格小巷---获取数据
  chooseMeasure: function (e) {
    console.log(e.detail.value)
    let chooseMeasureJson = app.getSpaceStr(e.detail.value, '-')
    console.log(chooseMeasureJson)

    for (let i = 0; i < this.MeasureParams.length; i++) {
      if (this.MeasureParams[i].name == chooseMeasureJson.str1) {
        this.MeasureParams[i].value = chooseMeasureJson.str2
      }
    }
    this.get_measure_cartesion()
  },




  // 分享的部分
  //点击 ...  显示分享
  showCardShare: function (e) {
    let oldIndex = this.data.focusIndex 
    let index = e.currentTarget.dataset.index;

   console.log("index",index)

    let productData = this.data.productData
    let focusData = productData[index]
    console.log("focusData", focusData)
      let showShare = this.data.showShare
// 找到商品id
      let id = e.currentTarget.dataset.id;
      console.log("id", id)
      // 循环activityPromotion
      let activityPromotion = this.data.activityPromotion

      let a=0;
      let b=0;
    
      for (let i = 0; i < activityPromotion.length;i++){
               a=i;
              //  console.log(activityPromotion[a].products)
               if (activityPromotion[a].products.length>0){
                 for (let j = 0; j < activityPromotion[a].products.length;j++){
                   b=j;
                  //  console.log(activityPromotion[a].products[b].id)
                   if (activityPromotion[a].products[b].id==id){
                     activityPromotion[a].products[b].productShow=true
                   }
                   else{
                     activityPromotion[a].products[b].productShow = false
                   }
                 }
               }
      }
      console.log("activityPromotion", activityPromotion)
    if (oldIndex == index) {
      showShare[index] = !showShare[index];
     
    } else {
      this.closeCardShare(oldIndex)
      showShare[index] = !showShare[index];
    
    }
    console.log('--------1--------' + index)
    this.setData({
      productData: productData,
      focusIndex: index,
      showShare: showShare,
      activityPromotion: activityPromotion
    })
    console.log(this.data.activityPromotion)
  },

  //开关显示客服的
  showKefuWechatCode: function (e) {
    let index = e.currentTarget.dataset.index;
    this.closeCardShare(index)
    this.setData({
      showKefu: true
    })
    console.log("MMMMMMMMMMMMMMM", this.data.showShare, index)
    let showShare = this.data.showShare;
    showShare[index] = false;
    this.setData({
      showShare: showShare
    })
  },
  lookBigWxCode: function (e) {
    let url = e.currentTarget.dataset.url;
    if (!url) {
      return
    }
    let urls = []
    urls.push(url)
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  closeKefu: function () {
    this.setData({
      showKefu: false
    })
  },
  //关闭
  closeCardShare: function (oldIndex) {

    let index = this.data.focusIndex
    if (!isNaN(oldIndex) && oldIndex > -1) {
      index = oldIndex
    }
    console.log('--------2关闭--------' + index)
    if (index == -1) {
      return
    }
    let productData = this.data.productData
    let focusData = productData[index]
    if (focusData.showShare == false) {
      return
    }
    focusData.showShare = false
    this.setData({
      productData: productData
    })
  },
  closeKefu: function () {
    this.setData({
      showKefu: false
    })
  },



// 展示海报
  showPosters(e){
    console.log("showPostersEEEE", e.detail.e.currentTarget.dataset.id)
    let that=this;
    this.setData({
      proId: e.detail.e.currentTarget.dataset.id,
      shopId: "236",
      posterState: true,
     
    })
    this.getQrCode();

  },
  // 关闭海报
  getChilrenPoster(e) {

    let that = this;
      that.setData({
        posterState: false,
      })
  
  },

 

})