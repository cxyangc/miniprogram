const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    promotionStartDate: { time: '2018-10-27 23:59:59', background: '', color: '' },
    promotionInfo:{},
  },
  params:{
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
  toProductDetail: function (e) {
    console.log(e.currentTarget.dataset.id)
    // product_detail.html?productId= 9219;
    var a = "product_detail.html?productId=" + e.currentTarget.dataset.id;
    app.linkEvent(a);
  },
  /* 获取数据 */
  getProductData: function (param, ifAdd) {
    let that = this;
    if (!ifAdd){
      ifAdd=0;
    }
    console.log("id", this.data.id)
    param.promotionId = this.data.id
    let customIndex = app.AddClientUrl("/more_product_list.html", param, 'get')
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        that.setData({ reqState: true })
        console.log("特卖数据", res.data)
        that.params.pageSize = res.data.pageSize
        that.params.curPage = res.data.curPage
        that.params.totalSize = res.data.totalSize
        let productList = res.data.result
        for(let i=0;i<productList.length;i++){
          if (productList[i].saleCount==0){
            productList[i].stockPercent =0
          }else{
            productList[i].stockPercent = Math.floor(productList[i].saleCount / (productList[i].stock + productList[i].saleCount) * 100)
          }
        }
        if (ifAdd==1){
          that.setData({ productData: productList})
        }else{
          that.setData({ productData: that.data.productData.concat(productList)})
        }
        console.log('that.data.productData', that.data.productData)
        wx.hideLoading()
      },
      fail: function (res) {
        console.log("fail")
        wx.hideLoading()
      }
    })
  },
  getPromotionInfo: function (param){
    let that = this
    console.log("id", this.data.id)
    param.promotionId = this.data.id
    let customIndex = app.AddClientUrl("/get_promotions_detail.html", param, 'get')
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("getPromotionInfo", res.data.relateObj)
        let promotionInfo = res.data.relateObj;
        promotionInfo.promotionStartDate = { 
          time: promotionInfo.endDate, 
          background: '#fff', 
          color: that.data.setting.defaultColor, 
          fontSize:20
          },
        that.setData({promotionInfo: promotionInfo})
        wx.hideLoading()
      },
      fail: function (res) {
        console.log("fail")
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("hahahahahahah这是id", options)
    this.setData({ 
      id: options.promotionId,
      setting: app.setting.platformSetting 
    })
    this.getProductData(this.params, 1)
    this.getPromotionInfo(this.params)
  },

  onReady: function () {
    
  },

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
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom')
    var that = this
    if (that.params.totalSize > that.params.curPage * that.params.pageSize) {
      wx.showLoading({
        title:'加载中...'
      })
      that.params.page++
      // 组件内的事件
      this.getProductData(this.params)
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'loading',
        duration: 1000
      })
      console.log('到底了', that.params.curPage)
    }
  },

})