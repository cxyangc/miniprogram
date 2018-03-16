
var util = require('../../utils/util.js');
const app = getApp()
var timer; // 计时器
var timerACT;
Page({
  data: { 
    /* seeting */
    setting: null,
    indexData: null,
    
    sysWidth: 320,//图片大小 
    loginUser: null,

    activityList:null, //活动相关

    /* 热销数据 */
    //规格信息
    showCount: false,
    focusData: null,
    measurementJson: null,

    byNowParams: {},//购买的参数
    bindType: 'addto', //加入购物车or直接下单
    focusIndex:0,
    showKefu: false,
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toPromotionList:function(e){
    console.log(e.currentTarget.dataset)
    let id = e.currentTarget.dataset.id;
    let description = e.currentTarget.dataset.description;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/promotion_products/index?promotionId=' + id + '&description=' + description + '&navName=' + name,
    })
  },
  toActvityRichText:function(e){
    console.log(e.currentTarget.dataset)
    let content = e.currentTarget.dataset.content;
    let name = e.currentTarget.dataset.name;
    if (content == "undefined"){
        return
    }
    app.richTextHtml = content
    wx.navigateTo({
      url: '/pages/richText/index?navName='+name,
    })
  },

  toNewsList:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/news_list/index?promotionId=' + id,
    })
  },
  //查看大图
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
  //查看门店说明富文本
  showMendianHtml:function(e){
    console.log(e.currentTarget.dataset)
    let content = e.currentTarget.dataset.content;
    let name = e.currentTarget.dataset.name;
    if (content == "undefined") {
      return
    }
    app.richTextHtml = content
    wx.navigateTo({
      url: '/pages/richText/index?navName=' + name,
    })
  },

  setNavBar: function () {
    if (app.setting.platformSetting.siteTitle == '') {
      wx.setNavigationBarTitle({
        title: '首页',
      })
    } else {
      wx.setNavigationBarTitle({
        title: app.setting.platformSetting.siteTitle,
      })
    }

    if (app.setting.platformSetting.defaultColor == '') {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: app.setting.platformSetting.defaultColor,
      })
    }
  },
  //处理活动
  deelActivityPromotion:function(data){
    let activityIng = data.activityPromotion
    let activityWill = data.unactivityPromotion
    let activityList = {}
    activityList.activityPromotion = data.activityPromotion
    activityList.unactivityPromotion = data.unactivityPromotion
    let that = this
    console.log('-----计时开始-----')
    CountdownActivity(activityList, that,0)
  },

  /* 处理热销 */
  //切割数组
  sliceArray: function (array, size) {
    var result = [];
    for (let x = 0; x < Math.ceil(array.length / size); x++) {
      let start = x * size;
      let end = start + size;
      result.push(array.slice(start, end));
    }
    return result;
  },
  //获取图片数组 用来预览用
  getImageUrlList: function (array) {
    let result = [];
    for (let x = 0; x < array.length; x++) {
      result.push(array[x].imagePath);
    }
    return result;
  },
  sliceProductImageList: function (arr) {
    let that = this
    for (let i = 0; i < arr.length; i++) {
      arr[i].imageListArr = that.sliceArray(arr[i].itemImages, 4)
      arr[i].imageListWatcher = that.getImageUrlList(arr[i].itemImages)
      arr[i].showShare = false //显示分享
    }
    return arr
  },
  //处理图片，只要四张
  dellProductImage:function(data){
    let products = data.products
    this.sliceProductImageList(products)
    console.log(data)
    this.setData({
      indexData: data
    })
  },
  /* 热销操作 */
  //点击 ...  显示分享
  showCardShare: function (e) {
    let oldIndex = this.data.focusIndex
    let index = e.currentTarget.dataset.index;
    let productData = this.data.indexData
    let focusData = this.data.indexData.products[index]

    console.log(focusData)
    if (oldIndex == index) {
      focusData.showShare = !focusData.showShare
    } else {
      this.closeCardShare(oldIndex)
      focusData.showShare = !focusData.showShare
    }

    console.log('--------1--------' + index)
    this.setData({
      indexData: productData,
      focusIndex: index
    })
  },
  //关闭 ... 
  closeCardShare: function (oldIndex) {

    let index = this.data.focusIndex
    if (!isNaN(oldIndex) && oldIndex > -1) {
      index = oldIndex
    }
    console.log('--------2--------' + index)
    if (index == -1) {
      return
    }

    let productData = this.data.indexData
    let focusData = productData.products[index]

    if (focusData.showShare == false) {
      return
    }
    focusData.showShare = false
    this.setData({
      indexData: productData
    })
  },
  //开关显示客服的
  showKefuWechatCode: function (e) {
    
    let index = e.currentTarget.dataset.index;
    this.closeCardShare(index)
    this.setData({
      showKefu: true
    })
  },
  //查看客服里面的二维码
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

  //看大图
  watchBigImage: function (e) {
    let urls = e.currentTarget.dataset.urls;
    let myurl = e.currentTarget.dataset.me
    console.log(urls)
    wx.previewImage({
      current: myurl, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  getData: function () {
    var that = this
    var customIndex = app.AddClientUrl("/aikucun_index.html", {}, 'get',1)
    //拿custom_page
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        that.setData({
          indexData : res.data
        })
        if (res.data.activityPromotion){
          that.deelActivityPromotion(res.data)
        }
        if(res.data.products){
          that.dellProductImage(res.data)
        }
        wx.hideLoading()

      },
      fail: function (res) {
        wx.hideLoading()

        //app.loadFail()

        wx.showModal({
          title: '提示',
          content: '加载失败，点击【确定】重新加载',
          success: function (res) {

            if (res.confirm) {
              that.onLoad()
            } else if (res.cancel) {
              //app.toIndex()
            }
          }
        })
      },
      complete:function(){

        wx.stopPullDownRefresh()
      },
    })
  },


  /*onload*/
  onLoad: function (options) {
    console.log('--------------- custom_index --------------')
    this.getData()
    if (!app.setting) {
      app.promiseonLaunch(this)
    } else {
      this.setData({
        sysWidth: app.globalData.sysWidth
      });
      
      if (!!app.setting) {
        this.setNavBar()
      }
    }
  },
  onReady: function () {
    if (app.shareParam && app.shareParam.pageName) {
      this.jumpToPage(app.shareParam)
    }
    
    this.setData({ setting: app.setting })
   Countdown(app,this);
  },
  // 点击转发的链接获取参数后跳转
  jumpToPage: function (shareParam) {
    if (shareParam.pageName == 'custom_page_index') {
      return
    } else if (shareParam.pageName == 'shopping_car_list') {
      return
    } else if (shareParam.pageName == 'custom_page_userinfo') {
      return
    } else {
      let paramStr = app.jsonToStr(shareParam)
      wx.navigateTo({
        url: '/pages/' + shareParam.pageName + '/index' + paramStr,
      })
    }
  },
  getArrSecond:function(data){
    let nowTime = util.formatTime(new Date())  //当前时间
    
      for (let i = 0; i < data.activityPromotion.length;i++){
        let second = util.GetDateDiff(nowTime, data.activityPromotion[i].endDate, 'second')
        if( second <=1){
          second = 0
        }
        data.activityPromotion[i].second = second
        data.activityPromotion[i].resultTime = util.timeStamp(second)
      }
    
    
      for (let i = 0; i < data.unactivityPromotion.length; i++) {
        let second = util.GetDateDiff(nowTime, data.unactivityPromotion[i].startDate, 'second')
        if (second <= 1) {
          second = 0
        }
        data.unactivityPromotion[i].second = second
        data.unactivityPromotion[i].resultTime = util.timeStamp(second)
      }
    
    return data
  },
  getArrTimeStap:function(){

  },
  onShow: function () {
    if (app.appHide){
      app.appHide = false
      this.onLoad()
    }

  },
  /**
    * 页面上拉触底事件的处理函数
    */
  onReachBottom: function () {
    var that = this
      this.setData({
        listEnd: true
      })
  },
  /* 组件事件集合 */
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  /* 分享 */
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from == "button") {
      let index = res.target.dataset.index
      let productData = this.data.indexData
      let focusData = this.data.indexData.products[index]
      let imageUrl = focusData.imagePath
      let shareName = focusData.brandName + focusData.name + '原价：￥' + focusData.tagPrice + '活动价：￥' + focusData.price
      let shareParams = {}
      shareParams.productName = focusData.productCode
      console.log('nnnnnnnnnn' + shareName)
      return app.shareForFx2('promotion_products', shareName, shareParams, imageUrl)
    }

    else {
      return app.shareForFx2(app.miniIndexPage)
    }
    
  },

  /* 下拉刷新 */
  onPullDownRefresh: function () {
    let that = this
    let data = this.data.activityList
    CountdownActivity(data,that,1)
    this.onLoad();
   // app.StartRefresh()
    
  },



  /* 规格和加入购物车部分 */
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
  addNum: function () {
    this.byNowParams.itemCount++;
    this.setData({ byNowParams: this.byNowParams })
  },

  //点击加入购物车或立即下单
 
  bindBuy: function (e) {
    var index = e.currentTarget.dataset.index;
    let productData = this.data.indexData.products
    let focusData = productData[index]
    this.byNowParams.productId = focusData.id
    this.byNowParams.shopId = focusData.belongShopId
    this.byNowParams.orderType = 0
    this.chooseMeasureItem(focusData)
    console.log(focusData)
    this.setData({
      focusData: focusData,
      showCount: true,
      byNowParams: this.byNowParams,
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
      //立即购买
      console.log('立即购买')
      this.createOrder22(this.byNowParams)
    

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
            duration: 3000
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
    this.setData({ showCount: false, focusData: null })
  },


  /* 
     规格操作
  */
  MeasureParams: [],
  //提交规格产品
  submitMeasure: function (id) {
    var that = this
    let focusProduct = this.data.focusData
    let measurementJson = this.data.measurementJson
    let data = {}
    data.cartesianId = measurementJson.id
    data.productId = focusProduct.id
    data.shopId = focusProduct.belongShopId
    data.count = 1
    data.type = 'add'

    var customIndex = app.AddClientUrl("/change_shopping_car_item.html", data, 'post')
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        console.log('--------add----------')
        console.log(res.data)

      },
      fail: function (res) {
        app.loadFail()
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  //获取规格价格参数
  get_measure_cartesion: function () {

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

    for (let i = 0; i < focusData.measureTypes.length; i++) {
      focusData.measureTypes[i].checkedMeasureItem = 0
      //初始化选择的数据
      let param = {}
      param.name = focusData.measureTypes[i].name
      param.value = focusData.measureTypes[i].productAssignMeasure[0].id

      this.MeasureParams.push(param)

    }
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
})

function CountdownActivity(data, that ,over) {
  if (over){
    console.log('干掉定时器')
    clearTimeout(timerACT)
    console.log(timerACT)
    return false;
  }else{
    let returnData = that.getArrSecond(data)
    that.setData({
      activityList: returnData
    })

    timerACT = setTimeout(function () {
      CountdownActivity(data, that, over);
    }, 1000);
  }
  
  
};


function Countdown(page, that) {
  console.log('2')
  if (page.loginUser) {
    that.setData({
      loginUser: page.loginUser
    })
  }
  else {
    timer = setTimeout(function () {
      Countdown(page, that);
    }, 1000);
  }
};