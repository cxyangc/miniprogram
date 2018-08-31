 
import { json2Form } from "../../public/json2Form.js";
const app = getApp()
Page({
 
  /** 
   * 页面的初始数据 
   */ 
  data: {
    setting: null,
    cartData: [],
    allchecked:false,
    loginUser: null,
    countPrice:0,
    countGood:0,
    pushItem:[],
    checkedItem: [],

    maskLoad: false, //按钮loading

    showHongDong:false, //活动
  },
  toProductDetail: function (e) {
    let info = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '/pages/productDetail/index?id=' + info.productId + "&addShopId=" + info.belongShop,
    })

  },
  /* 右上删除 */
  deleById:function(e){
    let info = e.currentTarget.dataset.info
    let listPro = {}
    listPro.shopId = info.belongShop
    listPro.selectedIds = info.id 

    this.delectCart(listPro);
  },
 /* 全部删除 */
 delectAll:function(e){
   var that = this
   var listPro = {
     shopId: '',
     selectedIds: '',
     type: 'shopall'
   }
   listPro.shopId = e.currentTarget.dataset.shopid
   wx.showModal({
     title: '提示',
     content: '全部删除',
     success: function (res) {
       if (res.confirm) {
         that.delectCart(listPro);
       } else if (res.cancel) {
       }
     }
   })
 },
  /* 删除选中 */
  delectChecked:function(){
    var that = this
    var pushItem = this.data.pushItem
    var listPro = {
      shopId: '',
      selectedIds: '',
      type:'selected'
    }
    if (pushItem.length == 0) {
      return
    }
    for (let i = 0; i < pushItem.length; i++) {
      listPro.shopId = pushItem[i].belongShop
      listPro.selectedIds += pushItem[i].id + ','
    }
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success: function (res) {
        if (res.confirm) {
          that.delectCart(listPro);
        } else if (res.cancel) {
        }
      }
    })
   
  }, 
  //删除购物车的调用函数
  delectCart: function (params) {
    var that = this
    var customIndex = app.AddClientUrl("/delete_shopping_car_list_item.html",params,'post')
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        console.log('-----------delect----------')
        console.log(res.data)
        wx.hideLoading()
        that.getCart()
      },
      fail: function (res) {
        wx.hideLoading()
        
      }
    })
  },
/* 购物车操作  */

  createOrder : function () {
    if (!app.checkShopOpenTime()) {
      return
    }
    if (this.data.maskLoad) {
      console.log('mask')
      return
    }
    var listPro = {
      shopId : '',
      selectedIds : ''
    }
    
    var pushItem = this.data.pushItem
    if (pushItem.length == 0){
      return
    }
    for (let i = 0; i < pushItem.length;i++ ){
      listPro.shopId = pushItem[i].belongShop
      listPro.selectedIds += pushItem[i].id+ ','
    }
    this.setData({
      maskLoad: true
    })
    var that = this
    var customIndex = app.AddClientUrl(" /list_promotions_by_car_items.html", listPro,'post')
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'post',
      success: function (res) {
        console.log('------这里应该有promotionId数组--------')
        console.log(res.data)
        
        wx.hideLoading()
       
        
        if (res.data.length && res.data[0].id) {

          if (res.data.length == 1) {
            listPro.promotionId = res.data[0].id
            that.createOrder22_car(listPro)
          } else {
            that.listPro_passActive = listPro
            that.setData({
              showHongDong: true,
              chooseArr: res.data
            })
          }
        } else {
          listPro.promotionId = '0'
          that.createOrder22_car(listPro)
        }
      },
      fail: function (res) {
        wx.hideLoading()
        that.setData({
          maskLoad: false
        })
        app.loadFail()
      }
    })
  },
  /* 选择活动 */
  closeHuodong:function(){
    this.setData({
      showHongDong: false,
    })
  },
  listPro_passActive:{},
  chooseActive:function(e){
    let id = e.currentTarget.dataset.id;
    console.log(id)
    let listPro = this.listPro_passActive
    listPro.promotionId = id
    console.log(listPro)
    this.createOrder22_car(listPro)
  },
  /* 创建订单 */
  createOrder22_car: function (o) {
    var customIndex = app.AddClientUrl("/shopping_car_list_item_create_order.html", o,'post')
    var that = this
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
        if (res.data.orderNo){
        
          wx.navigateTo({
            url: '/pages/edit_order/index?orderNo=' + res.data.orderNo,
          })
        }else{
          wx.showToast({
            title: res.data.errMsg ,
            image: '/images/icons/tip.png',
            duration: 2000
          })
          that.setData({
            maskLoad: false
          })
        }
        
      },
      fail: function (res) {
        wx.hideLoading()
        that.setData({
          maskLoad: false
        })
        app.loadFail()
        
      }
    })
  },
  /* 加入購物車 */
  subNum: function (e) {
    let that = this
    let index = e.currentTarget.dataset.id
    let focusCartItem = this.data.cartData[0].carItems[index]

    let params = {
      cartesianId: '0',
      productId: '',
      shopId: '',
      secretCode: '',
      count: '',
      type: '',
    }
    params.cartesianId = focusCartItem.measureCartesianId
    params.productId = focusCartItem.productId
    params.shopId = focusCartItem.belongShop
    params.secretCode = "sansan"

    if (focusCartItem.count == 1){
      console.log(focusCartItem)
      params.count = 0
      params.type = 'change'
    }
    else{
      params.count = 1
      params.type = 'dec'
    }
    
    this.postParams(params,focusCartItem)
  },

  addNum: function (e) {
    let that = this
    let index = e.currentTarget.dataset.id
    let focusCartItem = this.data.cartData[0].carItems[index]

   
    let params = {
      cartesianId:'0',
      productId: '',
      shopId: '',
      secretCode: '',
      count: '',
      type: '',
    }
    params.cartesianId = focusCartItem.measureCartesianId
    
    params.productId = focusCartItem.productId
    params.shopId = focusCartItem.belongShop
    params.secretCode = "sansan"
    params.count = 1
    params.type = 'add'
    this.postParams(params, focusCartItem)

  },
  postParams: function (data, focusCartItem) {
    var that = this

    if (!focusCartItem){
      focusCartItem = 0
    }
    
    var customIndex = app.AddClientUrl("/change_shopping_car_item.html", data,'post')
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        
        console.log(res.data)
        wx.hideLoading()
        if (res.data.id){
          if (focusCartItem) {
            focusCartItem.count = res.data.count
            that.setData({
              cartData: that.data.cartData
            })
          }
        }
        if ((data.count == 1 || data.count == 0) && data.type == 'change') {
          that.getCart()
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

/* 加载购物车内容 */

  getCart: function () {
    var customIndex = app.AddClientUrl("Client.User.CarItemList")
    var that = this
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '10001'){
          that.setData({ cartData: null })
          app.loadLogin()
        }
        else{
          
          if (!res.data.result||res.data.result.length == 0){
            that.setData({ cartData: null })
          }else{
            that.setData({ cartData: res.data.result })
          }
          that.showPrice()
          
        }
        
        //wx.hideLoading()
      },
      fail: function (res) {
       // wx.hideLoading()
       
      }
    })
  },

  checkboxChange:function (e) {
    console.log('--------checkBox------')
    console.log(e.detail.value)
    var checkedItem = e.detail.value
    console.log(checkedItem)
    
    let cartData = this.data.cartData[0].carItems
    if (checkedItem.length == cartData.length){
      this.setData({
        allchecked:true
      })
    }
    this.setData({
      checkedItem: checkedItem
    })
    this.showPrice()
  },
  chooseAll:function () {
    if (!this.data.cartData){
      return
    }
    var checkedItem=[]
    if (!this.data.allchecked){
      for (let i = 0; i < this.data.cartData[0].carItems.length; i++) {
        let cartId = this.data.cartData[0].carItems[i].id
        checkedItem.push(cartId)
      }
    }else{
      checkedItem.length = 0
    }
    
    this.setData({
      checkedItem: checkedItem,
      allchecked: !this.data.allchecked
    })
    this.showPrice()
  },
 
  showPrice: function () {
    if (!this.data.cartData){
      this.setData({
        countGood: 0,
        countPrice: 0
      })
      return
    }
    var checkedItem = this.data.checkedItem
    var cartDataItem = this.data.cartData[0].carItems

    var pushItem = []
    var countGood = 0
    var countPrice = 0

    for (let i = 0; i < cartDataItem.length; i++){
      for (let j = 0; j < checkedItem.length; j++) {
        if (cartDataItem[i].id == checkedItem[j]){
          pushItem.push(cartDataItem[i])
        }
      }
    }
    for (let i = 0; i < pushItem.length; i++) {
      countGood += parseInt(pushItem[i].count)
      countPrice += parseInt(pushItem[i].count) * pushItem[i].carItemPrice
    }
    countPrice = countPrice.toFixed(2)
    this.setData({
      pushItem: pushItem,
      countGood: countGood,
      countPrice: countPrice
    })
    console.log(pushItem)
    console.log(countGood)
    console.log(countPrice)
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({ 
      setting: app.setting ,
      loginUser: app.loginUser
    })

    this.getCart()
    

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
    if (!!app.loginUser) {
      this.setData({ loginUser: app.loginUser })
    }
    this.setData({
      maskLoad: false
    })
    this.getCart()
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
    this.getCart()
    wx.stopPullDownRefresh()
  },
  /* 分享 */
  onShareAppMessage: function () {
    return app.shareForFx2(app.miniIndexPage)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },


})