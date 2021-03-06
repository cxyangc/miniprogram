
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: "1",
    shops: null,
    journey: [],//公里数
    curPage:1,
    pageSize :10,
    totalSize : 1,
    reqState:false,
  },
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    console.log("==========linkUrl========", linkUrl)
    app.linkEvent(linkUrl)
  },
  // 获取附近店铺数据
  getData: function (page,isAdd) {
    if (!isAdd) {
      isAdd =false
    }
    console.log(page)
    let newPage=page
    var that = this;

    // 店铺名可以从app.setting中拿到
    console.log("app.setting.platformSetting", app.setting);
    let shopName = app.setting.platformSetting.defaultShopBean.account.shopName
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log('=========latitude============',latitude)
        console.log('=========that.data.page============',that.data.page)

        // 获取附近店铺数据
        var nearShopUrl = "/more_near_shops.html";
     
        var pageParam = {
          "longitude": longitude,
          "latitude": latitude,
     
        }
        console.log("=======newPage======",newPage)
        if (page && page != "") {
          pageParam.page = newPage
        }
        else {
          pageParam.page = that.data.page
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
            that.setData({reqState:true})
            console.log("数据", res.data.relateObj)
              that.setData({
                curPage: res.data.relateObj.curPage,
                pageSize: res.data.relateObj.pageSize,
                totalSize: res.data.relateObj.totalSize
            })
            let dataArr = that.data.shops//将之前的数据赋给变量
            if (!isAdd) {
              dataArr = []//正常时候先将数据制空
            }
            if (!res.data.relateObj.result || res.data.relateObj.result.length == 0) {
              that.setData({ shops: null })
            } else {
              if (dataArr == null) { dataArr = [] }
              dataArr = dataArr.concat(res.data.relateObj.result)
              that.setData({ shops: dataArr })
            }

            // 获取公里数
            var userLongitude = longitude;
            var userLatitude = latitude;
            var index = "0"
            for (var i = 0; i < that.data.shops.length; i++) {
              index = i;
              var shopLongitude = that.data.shops[index].longitude;
              var shopLatitude = that.data.shops[index].latitude;

              that.getGreatCircleDistance(userLongitude, userLatitude, shopLongitude, shopLatitude);

              // 店铺介绍
              // WxParse.wxParse('article', 'html', res.data.relateObj.result[index].shopDescription, that, 10);
            }





            if (res.data.errcode < 0) {
              console.log(res.data.errMsg)
            }
            else {
              wx.hideLoading()
              if (!!res.data.partials) {
                that.getPartials(res.data.partials)
              } else {
                console.log('--------error --------' + res.data)
              }
            }
          },
          fail: function (res) {
            wx.hideLoading()
            app.loadFail()
          },
          complete: function () {
            that.setData({ reqState: true })
          },
        })
      }

    })




  },
  // 
  getGreatCircleDistance: function (lng1, lat1, lng2, lat2) {
    var EARTH_RADIUS = 6378.137; //地球半径
    lng1 = parseFloat(lng1);
    lat1 = parseFloat(lat1);
    lng2 = parseFloat(lng2);
    lat2 = parseFloat(lat2);
    // console.log("a,b", lng1, lat1, lng2, lat2)
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;

    var a = radLat1 - radLat2;
    var b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0;

    // console.log("公里数",s)
    // console.log("公里数", this.data.journey)
    s = s.toFixed(1);
    var journey = this.data.journey
    journey.push(s);

    this.setData({
      journey: journey
    })
    console.log("公里数", this.data.journey)
    return s;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page=1;
    this.getData(page);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({ setting: app.setting })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.reflesh == 1) {
      this.onPullDownRefresh()
    }
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
    this.data.Data = []

    this.listPage.page = 1
    let page=1;
    this.getData(page);
    wx.stopPullDownRefresh()
  },


  listPage: {
    page: 1,
    pageSize: 0,
    totalSize: 0,
    curpage: 1
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
      // 如果跳到下一页把上一页的数据加进去
    //  现获取数据，当翻页后把上一页的内容加进去
      if(that.data.reqState){
        this.setData({ reqState: false })
        setTimeout(function () {
          if (that.data.totalSize > that.data.curPage * that.data.pageSize) {
            that.data.page++
            that.getData(that.data.page,true);
          }
        }, 300);
      }
  },

})