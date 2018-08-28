

var util = require('../../utils/util.js');
const app = getApp()
var timer; // 计时器
Page({
  
  data: {  
    listenerId: null,
    /* seeting */ 
    setting:null,
    renderData:null,
    PaiXuPartials:[], 
    sysWidth: 750,//图片大小
    topName: {
      SearchProductName: "",//头部搜索的
    },
    loginUser:null,

    reportText: [
      {
        title:'abbbbbbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaccccccccc'
      },
      {
        title: 'bsssss'
      },
      {
        title: 'caa'
      },
    ],
    countDownDay: "",
    countDownHour: "",
    countDownMinute: "",
    countDownSecond: "",

    // 测试时间组件用的
    timeTime:"2019-07-13 14:55:12"

  },

  // 子组件做出更改后更改相应的样式
  exFun(v) {

    console.log("56565555555555555555555555" + JSON.stringify(v))
    console.log(this.data.PaiXuPartials)

    this.data.listenerId = (v.currentTarget.id);

    var data = this.data.PaiXuPartials;
    var index = 0;
    console.log(data.length)
    var a = [];
    for (var i = 0; i < data.length; i++) {
      index = i;
      console.log(data[index].partialType)
      if (data[index].partialType == "13") {
        a.push(data[index]);
        console.log(a)
        this.setData({
          PaiXuPartials: a
        })
      }
    }

  },
  /* 搜索 */
  // searchProduct:function(e){
  //   var product = e.detail.value
  //   console.log(product)
  //   var param ={}
  //   param.productName = product
  //   let postParam = app.jsonToStr(param)
  //  // app.productParam = param
  //   wx.navigateTo({
  //     url: '/pages/search_product/index' + postParam
  //   })
  // },
   
  /* 查看更多 */
  lookMoreProduct:function(e){
    let url = e.currentTarget.dataset.link;
    if(!url){
      return
    }
    var urlData = app.getUrlParams(url)
    console.log(urlData)
    {
      wx.navigateTo({
        url: '/pages/' + urlData.url + '/index' + urlData.param,
      })
    }
  },
  //partials
  getPartials: function (){
    var partials = this.data.renderData.partials;
    console.log("=====partials=====", partials)
    var PaiXuPartials = [];
    //排序
    if (partials && partials.length){
    for (let i = 0; i < partials.length; i++){
      if (typeof (partials[i].jsonData) == "string"){
        partials[i].jsonData = JSON.parse(partials[i].jsonData)
      }else{
        continue;
      }
      PaiXuPartials.push(partials[i]);
    }}
    this.setData({ PaiXuPartials: PaiXuPartials  })
    console.log(this.data.PaiXuPartials)

      
        
  },
  toPage: function(event) {
    console.log(event.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/' + event.currentTarget.dataset.page+'/index'
    })
  },

 





  

  toProductDetail: function (event) {
    console.log("--------toProductDetail------")
    console.log(event.currentTarget.dataset)
    var detailurl = event.currentTarget.dataset.detailurl
    var productId = detailurl.replace(/[^0-9]/ig, "");
    console.log(productId)
    wx.navigateTo({
      url: '/pages/productDetail/index?id=' + productId + "&addShopId=236",
    })
  
  },

  




  
  onUnload:function(e){
    
  },
 
  getUserInfo: function(e) {
    console.log("+++++e+++++",e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },




 
  setNavBar: function (){
    console.warn("1111111111111")
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
  getParac:function(){
    var that = this
    var customIndex = app.AddClientUrl("/custom_page_index.html",{},'get','1')
    //拿custom_page
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("====== res.data=========", res.data)
        wx.setNavigationBarTitle({
          title: res.data.channelTitle,
        })
        wx.hideLoading()
        app.renderData = res.data
        that.setData({ renderData: res.data })
        if (res.data.partials.length == 0 ){
          that.setData({ PaiXuPartials:null })
        }else{
          that.getPartials();
        }
        
     
        
      },
      fail: function (res) {
        console.log('------------2222222-----------')
        console.log(res)
        wx.hideLoading()

        //app.loadFail()
        
        wx.showModal({
          title: '提示',
          content: '加载失败，点击【确定】重新加载' ,
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
  getData: function () {
    console.log('---------------index - getsetting --------------')
    var that = this
    if (!app.setting) {
      console.log('-------------hasNoneSetting-----------')
      app.getSetting(that)
    } else {
      console.log('-------------hasSetting-----------')
      this.setData({ setting: app.setting })
      console.log(this.data.setting)
    }
  },
  buttom:function(){
    // console.log("1111111111111")
    app.wxLogin(1011)
    // wx.chooseAddress({
    //   success: function (res) {
    //     console.log(res.userName)
    //     console.log(res.postalCode)
    //     console.log(res.provinceName)
    //     console.log(res.cityName)
    //     console.log(res.countyName)
    //     console.log(res.detailInfo)
    //     console.log(res.nationalCode)
    //     console.log(res.telNumber)
    //   }
    // })
  },
  /*onload*/
  onLoad: function (options) {

    console.warn("======onLoad:options======", options)
    console.log('--------------- custom_index --------------')
    if(!app.setting){
      app.promiseonLaunch(this)
    }else{
       this.setData({
          sysWidth: app.globalData.sysWidth
        });
       //this.getData()
       this.getParac()
      
        if (!!app.setting) {
          this.setNavBar()
        }
    }
    // 

     
    // }
   
  
  },

  onReady: function () { 
  
   

   
    if (app.shareParam && app.shareParam.pageName){
      console.log("这是custom_page里面ready事件的shareParam" + app.shareParam)
      this.jumpToPage(app.shareParam)
    }
    
    // Countdown(app,this);
  },
  jumpToPage: function (shareParam){
    if (shareParam.pageName == 'custom_page_index'){
      return
    } else if (shareParam.pageName == 'shopping_car_list') {
      return
    } else if (shareParam.pageName == 'custom_page_userinfo') {
      return
    } else{
      let paramStr = app.jsonToStr(shareParam)
      wx.navigateTo({
        url: '/pages/' + shareParam.pageName + '/index' + paramStr,
      })
    }

  },
  onShow: function () {
    console.log('-----------------a---------------')
    this.audioCtx = wx.createAudioContext('myAudio');
    let Time2 = util.formatTime(new Date())  //当前时间
    let OldTime = '2018-3-1 15:20:33'
    let result = util.GetDateDiff(OldTime, Time2,'second') 
    let sss = util.timeStamp(result)
    console.log(sss)
  },

  /* 组件事件集合 */
  tolinkUrl: function (e) {
    console.warn("=======e=======",e)
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  /* 分享 app.js862行*/
  onShareAppMessage: function () {
    console.log(app.miniIndexPage)

    return app.shareForFx2(app.miniIndexPage)
    
  },
  onPullDownRefresh: function () {
    // 下拉刷新的时候首先判断存不存在tab

    if (this.data.listenerId) {

      console.log("hello:" + this.data.listenerId);
      try {
   
        this.selectComponent('#' + this.data.listenerId).refresh();
      } catch (e) {
        console.log("e", e)
      }
    }
    console.log(this.data.PaiXuPartials)

    var data = this.data.PaiXuPartials;
    var index = 0;
    console.log(data.length)
    var a = [];
    for (var i = 0; i < data.length; i++) {
      index = i;
      console.log(data[index].partialType)
      if (data[index].partialType == "13") {
        a.push(data[index]);
        console.log(a)
        this.setData({
          PaiXuPartials: a
        })
      }

    }

    if (this.data.PaiXuPartials.length == "0") {

      this.onLoad();
      // wx.stopPullDownRefresh()
    }
 
      wx.stopPullDownRefresh()
 
  },
})
function Countdown(page,that) {
  console.log('2')
  if (page.loginUser) {
    that.setData({
      loginUser: page.loginUser
    })
    
  

  }
  else {
    timer = setTimeout(function () {
      Countdown(page,that);
    }, 1000);
  }
};