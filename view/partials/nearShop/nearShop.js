const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');

Component({
  properties: {


    // 这里定义了innerText属性，属性值可以在组件使用时指定
    data: {
      type: JSON,
      value: 'default value',
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    page:"1",
    shops:[],
    journey:[],//公里数
  },
  ready:function(){
    this.getData();
 
  },
  methods: {
    // 这里是一个自定义方法

    tolinkUrl: function (e) {
      console.log("e.currentTarget.dataset.link=====", e.currentTarget.dataset.link)
      let linkUrl = e.currentTarget.dataset.link
      app.linkEvent(linkUrl)
    },
    // 获取附近店铺数据
    getData:function(){
  
      var that = this;

      // 店铺名可以从app.setting中拿到
      console.log("app.setting.platformSetting", app.setting);
      let shopName = app.setting.platformSetting.defaultShopBean.account.shopName
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          console.log(latitude)
          console.log(that.data.page)

          // 获取附近店铺数据
          var nearShopUrl = "/more_near_shops.html"
          var pageParam = { 
            "longitude": longitude,
            "latitude": latitude,
        //    "shopName": shopName,
            "page": that.data.page
             }
          console.log(nearShopUrl + pageParam)
          var customIndex = app.AddClientUrl(nearShopUrl, pageParam, 'get', 1)

          wx.showLoading({
            title: 'loading'
          })
          //拿custom_page
          wx.request({
            url: customIndex.url,
            header: app.header,
            method: 'GET',
            success: function (res) {
              console.log("数据", res)
              that.setData({
                shops: res.data.relateObj.result
              })
           
              // 获取公里数
              var userLongitude = longitude;
              var userLatitude = latitude;
              var index="0"
              for (var i = 0; i < res.data.relateObj.result.length; i++) {
                index=i;
                var shopLongitude = res.data.relateObj.result[index].longitude;
                var shopLatitude = res.data.relateObj.result[index].latitude;

                that.getGreatCircleDistance(userLongitude, userLatitude, shopLongitude, shopLatitude);

                // 店铺介绍
                // WxParse.wxParse('article', 'html', res.data.relateObj.result[index].shopDescription, that, 10);
              }
              
              if (res.data.errcode < 0) {
                console.log(res.data.errMsg)
              }
              else {
                wx.hideLoading()
               
              }
            },
            fail: function (res) {
              wx.hideLoading()
              app.loadFail()
            }
          })
        }

      })

     

    
    },

    // 
    getGreatCircleDistance: function (lng1, lat1, lng2, lat2){
      var EARTH_RADIUS = 6378.137; //地球半径
    lng1=parseFloat(lng1);
    lat1=parseFloat(lat1);
    lng2=parseFloat(lng2);
    lat2=parseFloat(lat2);
    console.log("a,b", lng1, lat1, lng2, lat2)
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;

    var a = radLat1 - radLat2;
    var b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0;
   
    // console.log("公里数",s)
    // console.log("公里数", this.data.journey)
    s=s.toFixed(1);
    var journey = this.data.journey
    journey.push(s);
  
    this.setData({
      journey: journey
    })
    // console.log("公里数", this.data.journey)
    return s;
  },
  

  },
})