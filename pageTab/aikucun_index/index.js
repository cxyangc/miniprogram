
var util = require('../../utils/util.js');
const app = getApp()
var timer; // 计时器
var timerACT;
var timerACTWill;
var timerProductsACT;
Page({ 
  data: { 
    url:'',
    /* seeting */
    setting: null,
    indexData: null,
    //四个数据源
    newsList: null,
    activityPromotion: null,
    unactivityPromotion: null,
    products: null,
    activityPromotionNum:null,
    more_scene: '',
    sysWidth: 320,//图片大小 
    loginUser: null,

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
  
  //时间格式改成 05月1日 12:30
  toMonthToDay:function(str){
    let arr = str.split(" ")
    let date = arr[0].split("-")
    let time = arr[1].split(":")
    return date[1]+'月'+date[2]+'日'+time[0]+':'+time[1]
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  doNothing:function(e){
    console.log(e)
  },
  toPromotionList:function(e){
    console.log(e.currentTarget.dataset)
    let id = e.currentTarget.dataset.id;
    let description = encodeURIComponent(e.currentTarget.dataset.description);
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/promotion_products/index?promotionId=' + id + '&description=' + description + '&navName=' + name,
    })
  },
  toActvityRichText:function(e){
    console.log(e.currentTarget.dataset)
    // let content = e.currentTarget.dataset.content;
    // let name = e.currentTarget.dataset.name; 
    let id = e.currentTarget.dataset.id;
    // if (content == "undefined"){
    //     return
    // }
    // app.richTextHtml = content
    wx.navigateTo({
      url: '/pages/promotion_detail/index?id='+id,
    })
  },

  toNewsList:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/news_list/index?newsTypeId=1&pageNage=新闻公告',//?newsTypeId=1
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
    // if (content == "undefined") {
    //   return
    // }
    
    if (!content||content=='') {
      return
    }//门店详情为空时，不能点击进去；
    
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
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    /* if (app.setting.platformSetting.defaultColor == '') {
     
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: app.setting.platformSetting.defaultColor,
      })
    } */
  },
  //处理活动
  deelActivityPromotion: function (activityPromotion, unactivityPromotion,products){
    let that = this
    console.log('-----计时开始-----')
    for (let i = 0; i < activityPromotion.length; i++) {
      activityPromotion[i].startTimeDate = this.toMonthToDay(activityPromotion[i].startDate)
    }

    for(let i = 0; i < unactivityPromotion.length; i ++){
      unactivityPromotion[i].startTimeDate = this.toMonthToDay(unactivityPromotion[i].startDate)
    }
    /*04.27*/
    for (let i = 0; i < products.length; i++) {
      products[i].startTimeDate = this.toMonthToDay(products[i].startDate)
    }
    CountdownActivity(activityPromotion, that,0)
    CountdownActivityWill(unactivityPromotion, that, 0)
    CountdownProducts(products, that, 0)
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
    if (!array){
      return result;
    }
    for (let x = 0; x < array.length; x++) {
      result.push(array[x].imagePath);
    }
    return result;
  },
  sliceProductImageList: function (arr) {
    let that = this
    if(!arr){
      return arr
    }
    for (let i = 0; i < arr.length; i++) {
      arr[i].imageListArr = that.sliceArray(arr[i].itemImages, 4)
      arr[i].imageListWatcher = that.getImageUrlList(arr[i].itemImages)
      if (i < 2) {
        arr[i].showImage = true
      } else {
        arr[i].showImage = false
      }
      arr[i].current=0;
      arr[i].showShare = false //显示分享
    }
    return arr
  },
  //处理图片，只要四张
  dellProductImage: function (products){
    let productResult = this.sliceProductImageList(products)
    console.log(productResult)
    this.setData({
      products: productResult
    })
  },
  /* 热销操作 */
  //点击 ...  显示分享
  showCardShare: function (e) {
    let oldIndex = this.data.focusIndex
    let index = e.currentTarget.dataset.index;
    let products = this.data.products
    let focusData = products[index]

    console.log(focusData)
    if (oldIndex == index) {
      focusData.showShare = !focusData.showShare
    } else {
      this.closeCardShare(oldIndex)
      focusData.showShare = !focusData.showShare
    }

    console.log('--------1--------' + index)
    this.setData({
      products: products,
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

    let products = this.data.products
    let focusData = products[index]

    if (focusData.showShare == false) {
      return
    }
    focusData.showShare = false
    this.setData({
      products: products
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
  _watchBigImage:function(e){
    let urls = e.currentTarget.dataset.urls;
    let _url = e.currentTarget.dataset.url;
    let url = urls[0];
    if (!urls){
      url = _url
    }
    app.lookBigImage(url, urls)
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
    var customIndex = app.AddClientUrl("/aikucun_index.html", {}, 'get')
    //拿custom_page
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        that.setData({
          newsList: res.data.newsList,
          activityPromotion: res.data.activityPromotion,
          activityPromotionNum: res.data.activityPromotion.length, 
         /*04.27*/ // products: res.data.products,     
          unactivityPromotion: res.data.unactivityPromotion
        })
       

        if(res.data.products){
          that.dellProductImage(res.data.products)
          that.setData({
            products: res.data.products,
          })
        }else{
          that.setData({
            products: [],
          })
        }

        if (res.data.activityPromotion || res.data.activityPromotion || res.data.products) {
          that.deelActivityPromotion(res.data.activityPromotion, res.data.unactivityPromotion, res.data.products)
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
    console.log(console.log("*********", options.scene, "&&&&&&&&&"))
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
     console.error("===*****"+app.more_scene)
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
    //已开始活动
    let nowTime = util.formatTime(new Date())  //当前时间
      for (let i = 0; i < data.length;i++){
        let second = util.GetDateDiff(nowTime, data[i].endDate, 'second')
        if( second <=1){
          second = 0
        }
        data[i].second = second
        data[i].resultTime = util.timeStamp(second)
      }
    return data
  },
  getStartSecond:function(data){
    //活动预告
    let nowTime = util.formatTime(new Date())  //当前时间
    for (let i = 0; i < data.length; i++) {
      let second = util.GetDateDiff(nowTime, data[i].startDate, 'second')
      if (second <= 1) {
        second = 0
      }
      data[i].second = second
      data[i].resultTime = util.timeStamp(second)
    }
    return data
  },
  onShow: function () {
    if (app.appHide){
      app.appHide = false
      CountdownActivity(0, this, 1)
      CountdownActivityWill(0, this, 1)
      let that = this
      setTimeout(function () {
        that.onLoad();
      }, 1000)
    }

    this.setData({
      loginUser: app.loginUser
    })
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
      let products = this.data.products
      let focusData = products[index]
      if (!focusData.brandName || focusData.brandName == "") {
        focusData.brandName = ""
      };
      let imageUrl = focusData.imagePath
      let shareName = '活动价：￥' + focusData.price + '(原价：￥' + focusData.tagPrice + ')' + focusData.brandName + focusData.name
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
    CountdownActivity(0,that,1)
    CountdownActivityWill(0, that, 1)
    setTimeout(function(){
      that.onLoad();
    },1000)
    
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
  addNum: function (e) {
    let cantadd = e.currentTarget.dataset.cantadd;
    if (cantadd == 1){
      return
    }else{
      this.byNowParams.itemCount++;
      this.setData({ byNowParams: this.byNowParams })
    }
    
  },

  //点击加入购物车或立即下单
 
  bindBuy: function (e) {
    let index = e.currentTarget.dataset.index;
    let bindBuy = e.currentTarget.dataset.bindbuy;

    let products = this.data.products
    let focusData = products[index]
    this.byNowParams.productId = focusData.id
    this.byNowParams.shopId = focusData.belongShopId
    this.byNowParams.orderType = 0
    this.chooseMeasureItem(focusData)
    console.log(focusData)
    this.setData({
      focusData: focusData,
      showCount: true,
      byNowParams: this.byNowParams,
      bindBuy: bindBuy
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
    if (this.data.bindBuy == 'addto'){
      console.log('加入购物车')
        //addto
      this.addtocart()
    } else{
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
    let focusProduct = this.data.products[0]
    var params = {}
    params.productId = focusProduct.id
    params.shopId = focusProduct.belongShopId
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
    this.MeasureParams = []
    this.setData({ 
      showCount: false, 
      focusData: null,
    })
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
    if (!this.data.focusData.measureItem||this.MeasureParams.length == 0) {
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
          
          console.error('error')
          console.log(that.MeasureParams)
          console.log(res.data)
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
    if (!focusData.measureItem){
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
    this.setData({
      focusData: focusData
    })
    this.get_measure_cartesion()
    console.log(this.MeasureParams)
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
    console.log(this.MeasureParams)
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
  if (over || data == 0){
    console.log('干掉定时器Now')
    clearTimeout(timerACT)
    console.log(timerACT)
    return false;
  }else{
    let returnData = that.getArrSecond(data)
    that.setData({
      activityPromotion: returnData
    })
    timerACT = setTimeout(function () {
      CountdownActivity(data, that, over);
    }, 1000);
  }
};

function CountdownActivityWill(data, that, over) {
  if (over || data == 0) {
    console.log('干掉定时器will')
    clearTimeout(timerACTWill)
    console.log(timerACTWill)
    return false;
  } else {
    let returnData = that.getStartSecond(data)
    that.setData({
      unactivityPromotion: returnData
    })
    timerACTWill = setTimeout(function () {
      CountdownActivityWill(data, that, over);
    }, 1000);
  }
};
/*04.27*/
function CountdownProducts(data, that, over) {
  if (over || data == 0) {
    console.log('干掉定时器will')
    clearTimeout(timerProductsACT)
    console.log(timerProductsACT)
    return false;
  } else {
    let returnData = that.getArrSecond(data)
    that.setData({
      products: returnData
    })
    timerProductsACT = setTimeout(function () {
      CountdownProducts(data, that, over);
    }, 1000);
  }
};

function Countdown(page, that) {
  if (page.loginUser) {
    
    /* if (!app.loginUser.platformUser.mendian && app.more_scene.indexOf("PLATFORM_USER_ID") > 0) {
      console.error('more_scene', app.more_scene)
      app.changeUserBelong(app.more_scene)
    } */
    that.setData({
      loginUser: page.loginUser
    })
    console.log('干掉定时器timer')
    clearTimeout(timer)
  }
  else {
    timer = setTimeout(function () {
      Countdown(page, that);
    }, 1000);
  }
};