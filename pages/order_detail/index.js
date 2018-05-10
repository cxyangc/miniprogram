
const app = getApp() 
Page({

  /**
   * 页面的初始数据 
   */
  data: {

    setting: null,
    loginUser: null,

    orderNo:null,
    orderDetailData:null,
    showArr: false,
    addrArr: null,
    hasAddnewAddr: false,
  },
  /* 获取地址列表 */
  showOtherArr: function () {
    var customIndex = app.AddClientUrl("/get_login_user_address_list.html")
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        that.setData({ addrArr: res.data.result, showArr: true })
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })

  },
  
  chooseNewAddr: function (e) {
    wx.showLoading()
    let that = this
    var addrArr = this.data.addrArr
    var index = e.currentTarget.dataset.index
    var selectAddr = addrArr[index]
    console.log(selectAddr)
    let addrParam = {}
    addrParam.addressId = selectAddr.id
    addrParam.orderNo = this.data.orderDetailData.orderNo
    let customIndex = app.AddClientUrl("/change_order_address.html", addrParam, 'post')
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if(res.data.errcode == 0){
          let orderDetailData = that.data.orderDetailData
          orderDetailData.buyerName = selectAddr.contactName
          orderDetailData.buyerTelno = selectAddr.telNo
          orderDetailData.buyerProvince = selectAddr.province
          orderDetailData.buyerCity = selectAddr.city
          orderDetailData.buyerArea = selectAddr.area
          orderDetailData.buyerAddress = selectAddr.address
          that.setData({
            orderDetailData: orderDetailData,
            showArr: false
          })
          wx.showToast({
            title: '地址修改成功',
          })
        }
        


      },
      fail: function (res) {
        app.loadFail()
      }
    })


   
    wx.hideLoading()
  },
  closeShowArr: function () {
    this.setData({ showArr: false })
  },

  toaddress_new: function () {
    this.setData({ hasAddnewAddr: true })
    wx.navigateTo({
      url: '/pages/add_address/index',
    })
  },
  
  getOrderDetail:function(id){
    let that = this
    let getParams = {}
    getParams.orderNo = id
    let customIndex = app.AddClientUrl("/get_order_detail.html", getParams)
    
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log('-----------orderDetail--------')
        console.log(res.data)
        that.setData({ orderDetailData: res.data})
        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },
  //物流单号 一键复制的事件
  copyTBL:function(){
    var that=this;
    wx.setClipboardData({
      data: that.data.orderDetailData.invoiceNo,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {            
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    var that = this
    this.setData({ setting: app.setting })
    this.setData({ loginUser: app.loginUser })
    console.log(o)
    if (!!o.orderNo) {
      this.data.orderNo = o.orderNo
      this.setData({
        orderNo: this.data.orderNo
      })

      that.getOrderDetail(o.orderNo)
    }else{
      wx.navigateBack()
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
    if (this.data.hasAddnewAddr) {
      this.showOtherArr()
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

})