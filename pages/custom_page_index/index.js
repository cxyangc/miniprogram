
var util = require('../../utils/util.js');
const app = getApp()
var timer; // 计时器
Page({
  data: {  
    /* seeting */ 
    setting:null,
    renderData:null,
    PaiXuPartials:[], 
    sysWidth: 320,//图片大小
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
    ]
  },

  
  /* 搜索 */
  searchProduct:function(e){
    var product = e.detail.value
    console.log(product)
    var param ={}
    param.productName = product
    let postParam = app.jsonToStr(param)
   // app.productParam = param
    wx.navigateTo({
      url: '/pages/search_product/index' + postParam
    })
  },
   
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
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },




 
  setNavBar: function (){
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
        wx.hideLoading()
        app.renderData = res.data
        console.log("========下个页面========",res.data)
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
  
  /*onload*/
  onLoad: function (options) {
    console.log('--------------- custom_index --------------')
    
    if(!app.setting){
      app.promiseonLaunch(this)
    }else{
       this.setData({
          sysWidth: app.globalData.sysWidth
        });
        this.getParac()
        //this.getData()
        if (!!app.setting) {
          this.setNavBar()
        }
    }
  },
  onReady: function () {
    if (app.shareParam && app.shareParam.pageName){
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
    let Time2 = util.formatTime(new Date())  //当前时间
    let OldTime = '2018-3-1 15:20:33'
    let result = util.GetDateDiff(OldTime, Time2,'second') 
    let sss = util.timeStamp(result)
    console.log(sss)
  },

  /* 组件事件集合 */
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  /* 分享 */
  onShareAppMessage: function () {
    return app.shareForFx2(app.miniIndexPage)
  },
  onPullDownRefresh: function () {
    this.onLoad();
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