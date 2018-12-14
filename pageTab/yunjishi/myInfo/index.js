// pages/fx_center/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {},
    loginUser: null,
    myData: {
      account: {
        account: 0,
      },
      totalEarningAmount: 0.00,
      totalTixianAmount: 0.00,
      waitCompleteOrderDistributeAmount: 0.00
    }
  },
  /* 组件事件集合 */
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  submitFormId: function (e) {
    this.toApplyForFacilitator(e);
  },
  getservantInfo: function () {
    console.log('-------技师-1-------')
    let params = {}
    var customIndex = app.AddClientUrl("/super_shop_manager_get_manager_servant_info.html", params, 'post')
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.errcode == '0') {
          let myData = res.data.relateObj
          myData = that.dellMoneyServant(myData)
          //account 账户余额
          that.setData({
            myData: myData
          })
          that.setNav(myData)
        } else {
          wx.showModal({
            title: '失败了',
            content: '请求失败了，请下拉刷新！',
          })

        }
      }
    })
  },
  getSessionUserInfo: function (callback) {
    var that = this;
    var postParamUserBank = app.AddClientUrl("/get_session_userinfo.html")
    wx.request({
      url: postParamUserBank.url,
      data: postParamUserBank.params,
      header: app.headerPost,
      success: function (res) {
        console.log(res.data)

        if (res.data.errcode == '0') {
          let UserInfo = res.data.relateObj.platformUser

          that.setData({
            loginUser: res.data.relateObj
          })
          app.loginUser = res.data.relateObj
          try{
            callback(app.loginUser);
          }catch(e){}
        } else {
          wx.showToast({
            title: res.data.errMsg,
            image: '/images/icons/tip.png',
            duration: 1000
          })
        }
      },
      fail: function (res) {

        console.log(res.data)
      },
      complete: function (res) {
        wx.stopPullDownRefresh()
      }
    })
  },
  loginOut: function () {
    wx.navigateTo({
      url: '/pages/pre_change_user_info/index',
    })
  },
  login: function () {
    wx.navigateTo({
      // url: '../login_wx/index',
      url: '/pages/login_wx/index',
    })
  },
  getMendianInfo: function () {
    console.log('-------门店-1-------')
    let params = {}
    var customIndex = app.AddClientUrl("/ge_manager_mendian_info_admin_mendian_json.html", params, 'post')
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '0') {
          let myData = res.data.relateObj
          myData = that.dellMoneyMendian(myData)
          //account 账户余额
          that.setData({
            myData: myData
          })
          that.setNav(myData)
        } else {
          wx.showModal({
            title: '失败了',
            content: '请求失败了，请下拉刷新！',
          })

        }

        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },
  dellMoneyServant: function (myData) {
    myData.account.account = app.toFix(myData.account.account)
    myData.unrealizedParentServiceProfit = app.toFix(myData.unrealizedParentServiceProfit)
    myData.unrealizedServiceProfit = app.toFix(myData.unrealizedServiceProfit)
    return myData
  },
  dellMoneyMendian: function (myData) {
    myData.account.account = app.toFix(myData.account.account)
    myData.waitCompleteOrderDistributeAmount = app.toFix(myData.waitCompleteOrderDistributeAmount)
    myData.totalTixianAmount = app.toFix(myData.totalTixianAmount)
    return myData
  },
  setNav: function (myData) {
    if (myData && myData!=='') {
      wx.setNavigationBarTitle({
        title: myData.name,
      })
    }else{
      wx.setNavigationBarTitle({
        title: '我的',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('======app.loginUser======', app.setting)
    this.setData({
      setting: app.setting,
      loginUser: app.loginUser
    })
    console.log('======this.loginUser======', this.data.loginUser)
    if (this.data.loginUser.platformUser.managerMendianId) {
      console.log("获取平台信息")
      this.getMendianInfo()
    } else if (this.data.loginUser.platformUser.managerServantId){
      console.log("获取技师信息")
      this.getservantInfo()
      }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    var that=this;
    this.getSessionUserInfo(function(loginUser){
      console.log("====get login user===");
      if (this.data.loginUser.platformUser.managerMendianId) {
        console.log("获取平台信息")
        this.getMendianInfo()
      } else if (this.data.loginUser.platformUser.managerServantId) {
        console.log("获取技师信息")
        this.getservantInfo()
      }
    });
    
    // this.onLoad()
    // setTimeout(function () {
    //   wx.stopPullDownRefresh()
    // }, 2000)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
})
