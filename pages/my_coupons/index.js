
const app = getApp()
Page({ 

  /**
   * 页面的初始数据
   */ 
  data: {
    showCoupon:[], 
    showState:0
  },
  gotoGet:function(){
    wx.navigateTo({
      url: '../available_coupons/index',
    })
  },
  /* 回首页 */
  toproduct:function(){
    wx.navigateTo({
      url: '/pages/search_product/index'
    })
  },
  /* 切换tab */
  showCouponState:function(e){
    var index = e.currentTarget.dataset.id
    
    this.setData({
      showState:index
    })
    this.getMyCouponsList(index,2)

    /* if(index == 0){
      this.setData({
        showCoupon: this.list0
      })
    } else if (index == 1) {
      this.setData({
        showCoupon: this.list1
      })
    } else if (index == 2) {
      this.setData({
        showCoupon: this.list2
      })
    } */
    console.log(this.data.showCoupon)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  /* 去掉日期的时间 */
  spliceData: function(e) {
    for(let i = 0;i<e.length;i++){
      e[i].couponStartDate = e[i].couponStartDate.substring(0,10)
      e[i].couponEndDate = e[i].couponEndDate.substring(0, 10)
    }
    return e;
  },
  /* 增加使用标志 */
  getState: function(e,n) {
    if(n==0){
      for (let i = 0; i < e.length; i++) {
        e[i].state = '未使用'
      }
    }
    if (n == 1) {
      for (let i = 0; i < e.length; i++) {
        e[i].state = '已使用'
      }
    }
    if (n == 2) {
      for (let i = 0; i < e.length; i++) {
        e[i].state = '已过期'
      }
    }
    return e;
  },


  list0:null,
  list1: null,
  list2: null,
  getMyCouponsList: function (i,fresh) {
    let that = this
    if(!fresh){
      fresh = 1
    }
    let getParam = {}
    getParam.couponState = i
    getParam.page = that.listPage.page
    let customIndex = app.AddClientUrl("/get_my_coupons_list.html", getParam,'get')
    wx.request({
      url: customIndex.url ,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        let result = that.spliceData(res.data.result)
        let result2 = that.getState(result, i)

        that.listPage.pageSize = res.data.pageSize
        that.listPage.curPage = res.data.curPage
        that.listPage.totalSize = res.data.totalSize

        

        let dataArr = that.data.showCoupon
        if (fresh == 2){
          dataArr = []
        }
        dataArr = dataArr.concat(result2)

        /* if(i == 0){
          that.list0 = that.getState(result,i) 
        } else if (i == 1) {
          that.list1 = that.getState(result,i) 
        } else if (i == 2) {
          that.list2 = that.getState(result,i) 
        } */

        that.setData({ showCoupon: dataArr})
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },

  listPage: {
    page: 1,
    pageSize: 0,
    totalSize: 0,
    curpage: 1
  },
  
  onLoad: function (options) {
    this.getMyCouponsList(0)
  },
  onReady: function () {
    this.setData({ setting: app.setting })
    this.setData({ loginUser: app.loginUser })
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
    
    let showState = this.data.showState
    console.log(showState)
    this.getMyCouponsList(showState,2)
    this.setData({ showState: showState})
   
    wx.stopPullDownRefresh() 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let showState = this.data.showState
    var that = this
    if (that.listPage.totalSize > that.listPage.curPage * that.listPage.pageSize) {
      that.listPage.page++
      this.getNewCouponsList(showState);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})