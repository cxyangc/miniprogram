// pages/fx_center/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {},
    loginUser: null,
    orderData: {},
    orderState: { pendingPaymentNum: 0, pendingDeliveryNum: 0, pendingGoodsNum:0},
    mendian: {
      account: {
        account: 0,
      },
      totalEarningAmount: 0.00,
      totalTixianAmount: 0.00,
      waitCompleteOrderDistributeAmount: 0.00
    }
  },
  /*获取订单类型数据 */
  getOrderList: function (params) {
    let tab = this.data.orderData
    var customIndex = app.AddClientUrl("/get_order_list.html", params)
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {

        console.log('-----------orderList--------')
        console.log(res.data)
        let result = res.data.result
        if (params.easyStatus==2){
          that.data.orderState.pendingPaymentNum = res.data.totalSize
        } else if (params.easyStatus == 3) {
          that.data.orderState.pendingDeliveryNum = res.data.totalSize
        } else if (params.easyStatus == 4) {
          that.data.orderState.pendingGoodsNum = res.data.totalSize
        }
        that.setData({
          orderState: that.data.orderState
        })
        console.log("===that.data.orderState====", that.data.orderState)
        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      },
    })
  },
  /* 组件事件集合 */
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  submitFormId: function (e) {
    this.toApplyForFacilitator(e);
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
          // let orderData = that.orderData
          // orderData.cells[0].showCountNum = UserInfo.unpayedCount
          // orderData.cells[1].showCountNum = UserInfo.unsendedCount
          // orderData.cells[2].showCountNum = UserInfo.unreceivedCount

          that.setData({
            // orderData: orderData,
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

        // unsendedCount //待发货
        // unreceivedCount //待收货
        // unpayedCount //逮住款

        console.log(res.data)
      },
      complete: function (res) {
        wx.stopPullDownRefresh()
      }
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
          let mendian = res.data.relateObj
          mendian = that.dellMoney(mendian)
          //account 账户余额
          that.setData({
            mendian: mendian
          })
          that.setNav(mendian)
        } else {
          wx.showModal({
            title: '失败了',
            content: '请求失败了，请下拉刷新！',
          })

        }
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
          let mendian = res.data.relateObj
          mendian = that.dellMoney(mendian)
          //account 账户余额
          that.setData({
            mendian: mendian
          })
          that.setNav(mendian)
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
  dellMoney: function (mendian) {
    mendian.account.account = app.toFix(mendian.account.account)
    mendian.totalEarningAmount = app.toFix(mendian.totalEarningAmount)
    mendian.totalTixianAmount = app.toFix(mendian.totalTixianAmount)
    mendian.waitCompleteOrderDistributeAmount = app.toFix(mendian.waitCompleteOrderDistributeAmount)
    return mendian
  },
  setNav: function (mendian) {
    if (mendian&&mendian!=='') {
      wx.setNavigationBarTitle({
        title: mendian.name,
      })
    }else{
      wx.setNavigationBarTitle({
        title: '我的',
      })
    }
  },
  //扫一扫 登录后台
  toLoginBackstage: function (e) {
    wx.scanCode({
      onlyFromCamera: true,
      success: (scanRes) => {
        let params = {}
        var customIndex = app.AddClientUrl("/wx_mini_scan_uuid.html", params, 'post')
        if (scanRes.errMsg == 'scanCode:ok') {
          let { result } = scanRes
          // 跳转-确认、取消登录页面
          wx.navigateTo({
            url: '/pages/scan_login/scan_login?scan_result=' + result,
            success(data) {
              wx.request({
                url: customIndex.url,
                data: customIndex.params,
                header: app.headerPost,
                method: 'POST',
                success: function (res) {
                  console.log('扫码成功')
                },
                fail: function (res) {

                }
              })
            }
          })
        }

      }
    })
  },

  //跳转到申请服务商web页面
  toApplyForFacilitator: function (e) {
    wx.navigateTo({
      url: '/pages/apply_for_facilitator/apply_for_facilitator?formId=' + e.detail.formId
    })
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
    this.getOrderList({ easyStatus: 2 })
    this.getOrderList({ easyStatus: 3 })
    this.getOrderList({ easyStatus: 4 })
    if (this.data.loginUser.platformUser.managerMendianId){
      this.getMendianInfo()
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
      that.getOrderList({ easyStatus: 2 })
      that.getOrderList({ easyStatus: 3 })
      that.getOrderList({ easyStatus: 4 })
      if (loginUser.platformUser.managerMendianId) {
        that.getMendianInfo()
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
