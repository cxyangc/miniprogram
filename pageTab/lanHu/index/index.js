var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityPromotion: [],//已经开始的活动
    unactivityPromotion:[],//还未开始的活动
    sysWidth: "",
    currentTab: "",
    platformSetting:"",//信息
    countDownList:[],
    countDownList1:[],
    toView: 'inToView01',
    getProductData:[],//商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    this.getProductData()
    console.log("用户信息", app.setting.platformSetting)
      this.setData({
        platformSetting: app.setting.platformSetting
      })
   
   
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
      that.setData({
        activityPromotion: res.data.activityPromotion,
        unactivityPromotion: res.data.unactivityPromotion
          })
        wx.hideLoading()
        if (that.data.activityPromotion.length==0){
          that.getData();
        }
        else{
          that.getTimeAll();
        that.ungetTimeAll();
        }
       
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
    // console.log(oldData.unactivityPromotion.length);
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
      // console.log(oldData.countDownList)

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
  click:function (e) {
    console.log(e)

    wx.navigateTo({
      url: '/pageTab/lanHu/teMai/index?promotionId=' + e.currentTarget.dataset.id,
    })
  },
  click1: function (e) {
    console.log(e)
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
    // app.productParam = param
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
    this.onLoad();
    wx.stopPullDownRefresh()
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
  onShareAppMessage: function () {
  
  },


})