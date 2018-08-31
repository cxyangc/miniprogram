
const app = getApp() 
Page({
 
  /** 
   * 页面的初始数据
   */ 
  data: { 
    orderData:{},
    orderNo:'',
    checkedRadio:0,
    //优惠券 
    getEditOrderDetailData:null,
    coupon:[],
    coupon2:[],
    index: 0,//
    gotCouponListId:0,
    couponMoney:0,

    setting: null,
    loginUser: null,
    
    //otherArr
    showArr:false,
    addrArr:null,
    hasAddnewAddr:false,
  },
  radioChance:function(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      checkedRadio:index
    })
  },
  //will sent
  orderMessage:{
    platformNo:'',
    gotCouponListId:'',
    userId:'', 
    orderNo: '',
    payType: '3',
    buyerScript: '',
    addressId: '',
    jifenDikou: '0',
    buyerBestTime: '',
  },
  /* 积分抵扣 */
  jifenChange :function (e){
    //console.log(e.detail.value[0])
    let jifen = e.detail.value[0]
    if (jifen){
    this.orderMessage.jifenDikou = jifen
    }
  },
  /* 获取地址列表 */
  showOtherArr:function() {
    var customIndex = app.AddClientUrl("/get_login_user_address_list.html")
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url ,
      header: app.header,
      success: function (res) {
        console.log("获取地址列表" + JSON.stringify(res))
        wx.hideLoading()
        that.setData({ addrArr:res.data.result, showArr: true })
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
    
  },
  toaddress_new: function() {
    this.setData({ hasAddnewAddr:true})
    wx.navigateTo({
      url: '/pages/add_address/index',
    })
  },
  // 地址从微信上调取需要的参数
  needParam: {
    contactName: '',
    telno: '',
    province: '',
    city: '',
    district: '',
    detail: '', //详细地址
    longitude: '',
    latitude: '',
    defaultAddress: 0,
  },
  wx_toaddress_new:function(){
    
    let that=this;
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName) //收货人姓名
        console.log(res.postalCode) //邮编
        console.log(res.provinceName)// 省
        console.log(res.cityName)//  市
        console.log(res.countyName)//区
        console.log(res.detailInfo)// 详细地址
        console.log(res.telNumber)//手机号

        that.needParam.contactName = res.userName //名字
        that.needParam.province = res.provinceName //省
        that.needParam.city = res.cityName //市
        that.needParam.district = res.countyName //
        that.needParam.telno = res.telNumber  //手机号
        that.needParam.detail = res.detailInfo
        that.needParam.defaultAddress = "1" //默认

        console.log("参数" + JSON.stringify(that.needParam))
      let customIndex = app.AddClientUrl("/add_address.html", that.needParam, 'post')
        wx.request({
          url: customIndex.url,
          data: customIndex.params,
          header: app.headerPost,
          method: 'POST',
          success: function (res) {
            console.log(res)
            wx.hideLoading()
            app.addrEditParam = that.needParam
            // 添加成功后重新刷新列表
            that.showOtherArr()
          },
          fail: function (res) {
            wx.hideLoading()
            app.loadFail()
          }
        })
      },

 

    })
  },
  chooseNewAddr: function (e) {
    wx.showLoading()
    //console.log(e.currentTarget.dataset.chooseid)
    var addrArr = this.data.addrArr
    console.log(addrArr)
    var addressId = e.currentTarget.dataset.chooseid
    console.log("addressId" + addressId)
    var selectAddr = null
    for (let i = 0; i < addrArr.length;i++){
      if (addressId == addrArr[i].id){
        selectAddr = addrArr[i]
      }
    }
    console.log(selectAddr)
    let newData = this.data.orderData
    newData.buyerName = selectAddr.contactName
    newData.buyerTelno = selectAddr.telNo
    newData.buyerProvince = selectAddr.province
    newData.buyerCity = selectAddr.city
    newData.buyerArea = selectAddr.area
    newData.buyerAddress = selectAddr.address
   // this.data.orderData.buyerName = selectAddr.contactName
    newData.addressId = addressId
    this.orderMessage.addressId = addressId
    this.setData({
      orderData: newData,
      showArr:false
    })
    wx.hideLoading()
  },
  closeShowArr: function () {
    this.setData({ showArr: false })
  },
  /* 支付方式 */
  payWayChange: function(e) {
    console.log(e.detail.value)
    this.orderMessage.payType = e.detail.value
  },
  getBuyerScript: function(e) {
    this.orderMessage.buyerScript = e.detail.value
  },
  //优惠券
  bindPickerChange: function(e) {
    console.log(e.detail)
    var index = e.detail.value
    var coupon = this.data.coupon
    if (index == 0){
      this.setData({
        index: index,
        couponMoney: 0
      })
    }else{
      var gotCouponListId = coupon[index].id
      console.log(gotCouponListId)
      this.orderMessage.gotCouponListId = gotCouponListId
      this.getEditOrderDetail()
      this.setData({
        index: index,
        gotCouponListId: gotCouponListId,
        couponMoney: coupon[index].coupon.youhuiAmount
      })
    }
   
  },
  // 这里需要修改
  getavailableCouponsArr: function() { 
    var arr = ['no']
    var arr2 = ['请选择优惠券']
    var data=this.data;
    if (data&&data.getEditOrderDetailData.availableCoupons){
    for (let i = 0; i < this.data.getEditOrderDetailData.availableCoupons.length;i++){
      arr.push(this.data.getEditOrderDetailData.availableCoupons[i])
      arr2.push(this.data.getEditOrderDetailData.availableCoupons[i].couponName)
    }}
    this.setData({ coupon: arr, coupon2: arr2})
    console.log('----------1----------')
    console.log(arr)
    console.log('----------2----------') 
    console.log(arr2)
  },
 
  getEditOrderDetail: function () {
    var that = this
    var getParams = {}
    getParams.orderNo = that.data.orderNo
    getParams.gotCouponListId = that.data.gotCouponListId
    var customIndex = app.AddClientUrl("/get_edit_order_detail.html", getParams)
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("=====orde detail=======",res)

        that.setData({ getEditOrderDetailData:res.data })
        that.setData({ orderData:res.data})

  // 获取门店自提
        let allowMendianZiti = res.data.allowMendianZiti
        console.log(allowMendianZiti)
        that.setData({
      allowMendianZiti: allowMendianZiti
    })
    // 允许但不优先
        if (that.data.allowMendianZiti=="1"){
          that.setData({
         mendianZiti:0
       })
    }
    // 允许并优先
        else if (that.data.allowMendianZiti == "2"){
          that.setData({
        mendianZiti: 1
      })
    }
    // 只允许门店自提
        else if (that.data.allowMendianZiti == "3") {
          that.setData({
        mendianZiti: 1
      })
    }
    else{
          that.setData({
        mendianZiti: 1
      })
    }
        console.log("=====mendianZiti======", that.data.mendianZiti)


        that.getavailableCouponsArr()
        that.loadMessage()
        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },
  /* 确认订单 */
  submitOrder:function(){
    var that = this
    console.log(that.orderMessage)
    // 不允许自提的时候没写地址
    if (!that.orderMessage.addressId &&that.data.allowMendianZiti == "0"){
        wx.showModal({
          title: '提示',
          content: '请添加收货地址',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/add_address/index'
              })
            } else if (res.cancel) {

            }
          }
        })
      
  
      
    }else{
      // 如果允许自提但没打勾
      if (that.data.allowMendianZiti != "0" && that.data.mendianZiti == "0" && !that.orderMessage.addressId){
        wx.showModal({
          title: '提示',
          content: '请添加收货地址',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/add_address/index'
              })
            } else if (res.cancel) {

            }
          }
        })
        }

else{

        // 如果是订餐的话携带桌子ID
        // 查找缓存
        console.log("22222222222222")
        try {
          let tableID = wx.getStorageSync('tableID')
          if (tableID) {
            that.orderMessage.tableId = tableID
          }
        } catch (e) {
        }
        // 判断是否自提
        console.log("======mendianZiti=========", that.data.mendianZiti)
        that.orderMessage.mendianZiti = that.data.mendianZiti
        console.log("=========参数orderMessage===========", JSON.stringify(that.orderMessage))
        var customIndex = app.AddClientUrl("/submit_order.html", that.orderMessage, 'post')

        wx.showLoading({
          title: 'loading',
          mask: true
        })
        wx.request({
          url: customIndex.url,
          data: customIndex.params,
          header: app.headerPost,
          method: 'POST',
          success: function (res) {
            console.log('--------确认订单------- ')
            console.log(res)
            console.log(res.data)
            if (res.data.errcode == '10001') {
              app.loadLogin()
            } else {
              app.payItem = res.data  /* 全局传过去吧... */
              wx.hideLoading()
              wx.redirectTo({
                url: '/pages/submit_order_result/index',
              })
            }


          },
          fail: function (res) {
            wx.hideLoading()
            app.loadFail()
          }
        })

}


   
    }
  },

  
  //增加 购买过程中——及时收获地址——可编辑的状态
  addressModifyInTime: function (e) {
    var addrId = e.currentTarget.dataset.id
    for (let i = 0; i < this.data.addrArr.length; i++) {
      if (addrId == this.data.addrArr[i].id) {
        app.EditAddr = this.data.addrArr[i]
      }
    }
    this.hasEditAddr = true
    wx.navigateTo({
      url: '../add_address/index?addrId=' + addrId,
    })
  },

  getAddr: function () {
    if (!app.checkIfLogin()) {
      return
    }
    var customIndex = app.AddClientUrl("/get_login_user_address_list.html")
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    //拿custom_page 
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log('-------地址---------')
        console.log(res.data)
        if (res.data.result.errcode == '-1') {
          console.log('err')
          app.echoErr(res.data.result.errMsg)
        } else {
        
            that.setData({ addrArr: res.data.result })
          
        }
        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },

  // 添加一个地址到
  subMitArrFrom: function (e) {
    console.log(this.needParam)
    var that = this
    /* 判断地址是否有空的 */
    let pass = this.dellAddrSpace(this.needParam)
    if (pass == '0') {
      /* 判断是编辑还是新增 */
      var customIndex = null
      if (!this.data.ifEid) {
        customIndex = app.AddClientUrl("/add_address.html", that.needParam, 'post')
      }
      else {
        customIndex = app.AddClientUrl("/edit_address.html", that.needParam, 'post')
      }


      wx.showLoading({
        title: 'loading',
        mask: true
      })

      wx.request({
        url: customIndex.url,
        data: customIndex.params,
        header: app.headerPost,
        method: 'POST',
        success: function (res) {
          console.log(res)
          wx.hideLoading()
          app.addrEditParam = that.needParam
          wx.navigateBack()
        },
        fail: function (res) {
          wx.hideLoading()
          app.loadFail()
        }
      })
    } else {
      wx.showToast({
        title: pass,
        image: '/images/icons/tip.png',
        duration: 2000
      })
    }

  },
  onLoad: function (o) {
    var that = this
    console.log("========app.setting======", app.setting)
    // 查找缓存(先暂时把id当成桌号，后台暂时没有配置桌号，后面再去改)
    try {
      var tableID = wx.getStorageSync('tableID')
      if (tableID && tableID!="") {
          this.setData({
            tableID: tableID
          })
      }
    } catch (e) {
     
    }
    console.log("=========tableID===========", tableID)

    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function (res) {
        // success  
        var longitude = res.longitude
        var latitude = res.latitude
        that.needParam.longitude = longitude
        that.needParam.latitude = latitude
        that.setData({ needParam: that.needParam })
      },
      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
    })
    this.setData({ setting: app.setting })
    this.setData({ loginUser: app.loginUser })
    console.log("==================o===================", o)
    console.log("==================o===================", o.orderNo)
    let orderData = o.orderNo
  

  //  获取订单号
    if (!!orderData && orderData!=""){
      this.data.orderNo = orderData
      this.setData({
        orderData: orderData
      })
     
      that.getEditOrderDetail()
      console.log("===================", this.data.orderData)
    }
  },
  check:function(){
    if (this.data.allowMendianZiti=="3"){
      this.setData({
        mendianZiti: 0
      })
    }else{
      this.setData({
        mendianZiti: 1
      })
    }
    console.log(this.data.mendianZiti)
  },
  uncheck:function(){
    if (this.data.allowMendianZiti == "3") {
      this.setData({
        mendianZiti: 1
      })
    } else {
      this.setData({
        mendianZiti: 0
      })
    }
    console.log(this.data.mendianZiti)

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  loadMessage: function () {
    this.orderMessage.platformNo = app.setting.platformSetting.platformNo
    this.orderMessage.userId = app.loginUser.id
    this.orderMessage.orderNo = this.data.orderData.orderNo
    if (this.data.orderData.orderJifen && this.data.orderData.orderJifen.tuijianDikou){
    this.orderMessage.jifenDikou = this.data.orderData.orderJifen.tuijianDikou
    }
    this.orderMessage.gotCouponListId = this.data.gotCouponListId
    this.orderMessage.addressId = this.data.orderData.addressId



    console.log('----------------------------')
    console.log(this.orderMessage)
    console.log('----------------------------')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  hasEditAddr: false,
  onShow: function () {
    if (!!this.data.orderNo) {
      //this.getEditOrderDetail()
      this.getAddr()
    }
    if (this.data.hasAddnewAddr) {
      this.showOtherArr()
      // this.getAddr()
    }
    let addrEditParam = app.addrEditParam
    if (addrEditParam && this.hasEditAddr) {
      console.log(addrEditParam)
      this.changOutAddr(addrEditParam);
    }
    
  },
  changOutAddr: function (addrEditParam) {
    app.addrEditParam = null
    this.hasEditAddr = false
    let orderData = this.data.orderData
    orderData.buyerName = addrEditParam.contactName
    orderData.buyerTelno = addrEditParam.telno
    orderData.buyerProvince = addrEditParam.province
    orderData.buyerCity = addrEditParam.city
    orderData.buyerArea = addrEditParam.district
    orderData.buyerAddress = addrEditParam.detail

    this.orderMessage.addressId = addrEditParam.addressId

    this.setData({
      orderData: orderData
    })

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