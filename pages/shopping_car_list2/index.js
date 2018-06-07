
import { json2Form } from "../../public/json2Form.js";
const app = getApp()
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    setting: null,
    cartData: [],
    allchecked: false,
    loginUser: null,
    countPrice: 0,
    countGood: 0,
    pushItem: [],
    checkedItem: [],

    maskLoad: false, //按钮loading

    showHongDong: false, //活动购买的时候
    /* 热销数据 */
    products: null,
    //规格信息
    showCount: false,
    focusData: null,
    measurementJson: null,

    byNowParams: {},//购买的参数
    bindType: 'addto', //加入购物车or直接下单
    focusIndex: 0,
    showKefu: false,
    hasMore: false
  },
  toProductDetail: function (e) {
    let info = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '/pages/productDetail/index?id=' + info.productId + "&addShopId=" + info.belongShop,
    })

  },
  oldEditIndex: -1,
  /* 编辑购物车 */
  closeOldEdit: function (index) {
    let cartData = this.data.cartData
    let focusCart = cartData[0].carItems[index]
    focusCart.showEditView = false
    this.setData({
      cartData: cartData
    })
  },
  editCart: function (e) {
    let index = e.currentTarget.dataset.index;

    if (this.oldEditIndex == -1) {

    } else {
      this.closeOldEdit(this.oldEditIndex)
    }
    this.oldEditIndex = index


    let cartData = this.data.cartData
    let focusCart = cartData[0].carItems[index]
    focusCart.showEditView = true
    focusCart.count2 = focusCart.count

    this.CartParamWaitPost.cartesianId = focusCart.measureCartesianId
    this.CartParamWaitPost.productId = focusCart.productId
    this.CartParamWaitPost.shopId = focusCart.belongShop
    this.CartParamWaitPost.count = focusCart.count
    this.CartParamWaitPost.type = 'change'

    this.setData({
      cartData: cartData
    })
  },
  sureChange: function (e) {
    let index = e.currentTarget.dataset.index;
    let cartData = this.data.cartData
    let focusCart = cartData[0].carItems[index]
    focusCart.showEditView = false
    console.log(this.CartParamWaitPost)
    this.postParams(this.CartParamWaitPost)
    this.setData({
      cartData: cartData
    })

  },
  _watchBigImage: function (e) {
    let urls = e.currentTarget.dataset.urls;
    let _url = e.currentTarget.dataset.url;
    let url = urls[0];
    if (!urls) {
      url = _url
    }
    app.lookBigImage(url, urls)
  },
  /* 右上删除 */
  deleById: function (e) {
    let that = this
    let info = e.currentTarget.dataset.info
    let listPro = {}
    listPro.shopId = info.belongShop
    listPro.selectedIds = info.id

    wx.showModal({
      title: '提示',
      content: '删除该商品',
      success: function (res) {
        if (res.confirm) {
          that.delectCart(listPro);
        } else if (res.cancel) {
          return
        }
      }
    })


  },
  /* 全部删除 */
  delectAll: function (e) {
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
  delectChecked: function () {
    var that = this
    var pushItem = this.data.pushItem
    var listPro = {
      shopId: '',
      selectedIds: '',
      type: 'selected'
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
    var customIndex = app.AddClientUrl("/delete_shopping_car_list_item.html", params, 'post')
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

  createOrder_car: function () {
    if (!app.checkShopOpenTime()) {
      return
    }
    if (this.data.maskLoad) {
      console.log('mask')
      return
    }


    var listPro = {
      shopId: '',
      selectedIds: ''
    }

    var pushItem = this.data.pushItem
    if (pushItem.length == 0) {
      return
    }
    for (let i = 0; i < pushItem.length; i++) {
      listPro.shopId = pushItem[i].belongShop
      listPro.selectedIds += pushItem[i].id + ','
    }
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    this.setData({
      maskLoad: true
    })
    var that = this
    var customIndex = app.AddClientUrl("/list_promotions_by_car_items.html", listPro, 'post')
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
            that.checkedActive = res.data[0].id
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
  closeHongDong: function () {
    this.setData({
      showHongDong: false,
      maskLoad: false
    })
  },

  listPro_passActive: {},
  checkedActive: -1,  //选择的活动radio
  chooseHuodong: function (e) {
    this.checkedActive = e.detail.value
  },
  chooseActive: function (e) {
    if (this.checkedActive == -1) {
      return
    }

    let id = this.checkedActive;

    console.log('选择的id', id)
    let listPro = this.listPro_passActive
    listPro.promotionId = id
    console.log(listPro)
    this.createOrder22_car(listPro)
  },
  /* 创建订单 */
  createOrder22_car: function (o) {
    var customIndex = app.AddClientUrl("/shopping_car_list_item_create_order.html", o, 'post')
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
        if (res.data && res.data.orderNo) {
          wx.navigateTo({
            url: '/pages/edit_order/index?orderNo=' + res.data.orderNo,
          })
        } else if (!res.data) {
          wx.showToast({
            title: '出错了,请刷新后重试',
            image: '/images/icons/tip.png',
            duration: 2000
          })
          that.setData({
            maskLoad: false
          })
        }
        else {
          wx.showToast({
            title: res.data.errMsg,
            image: '/images/icons/tip.png',
            duration: 2000
          })
          that.setData({
            maskLoad: false
          })
        }
        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
        that.setData({
          maskLoad: false
        })
      },
      complete: function () {

      },
    })
  },
  /* 加入購物車 */
  subCarNum: function (e) {
    let that = this
    let index = e.currentTarget.dataset.id
    let count = e.currentTarget.dataset.count
    let cantadd = e.currentTarget.dataset.cantadd
    console.log(cantadd)
    if (cantadd) {
      console.log(1)
      return
    }
    let cartData = this.data.cartData
    let focusCartItem = cartData[0].carItems[index]
    if (count == 1) {
      return
    }
    focusCartItem.count2 = --count
    this.CartParamWaitPost.count = count

    that.setData({
      cartData: cartData
    })
  },
  CartParamWaitPost: {
    cartesianId: '0',
    productId: '',
    shopId: '',
    count: '',
    type: 'change',
  },
  addCarNum: function (e) {
    let that = this
    let index = e.currentTarget.dataset.id
    let count = e.currentTarget.dataset.count
    let cantadd = e.currentTarget.dataset.cantadd
    console.log(cantadd)
    if (cantadd) {
      console.log(1)
      return
    }

    let cartData = this.data.cartData
    let focusCartItem = cartData[0].carItems[index]
    focusCartItem.count2 = ++count
    this.CartParamWaitPost.count = count

    that.setData({
      cartData: cartData
    })

  },
  postParams: function (data, focusCartItem) {
    var that = this

    if (!focusCartItem) {
      focusCartItem = 0
    }

    var customIndex = app.AddClientUrl("/change_shopping_car_item.html", data, 'post')
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {

        console.log(res.data)
        wx.hideLoading()
        if (res.data.id) {
          if (focusCartItem) {
            focusCartItem.count = res.data.count
          }
        }

        that.getCart()

      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  /* 加载购物车内容 */

  getCart: function () {
    var customIndex = app.AddClientUrl("/get_shopping_car_list_item.html")
    var that = this
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log('------error-------')
        console.log(res.data)
        if (res.data.errcode == '10001') {
          that.setData({ cartData: null })
          app.loadLogin()
        }
        else if (res.data.result.errcode == '-1') {
          that.setData({ cartData: null })
          app.echoErr(res.data.result.errMsg)
        }
        else {
          if (!res.data.result || res.data.result.length == 0) {
            that.setData({ cartData: null })
          }
          else if (res.data.result.errcode) {
            that.setData({ cartData: null })
            app.echoErr(res.data.result.errMsg)
          }
          else {
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

  checkboxChange: function (e) {
    console.log('--------checkBox------')
    console.log(e.detail.value)
    var checkedItem = e.detail.value
    console.log(checkedItem)

    let cartData = this.data.cartData[0].carItems
    if (checkedItem.length == cartData.length) {
      this.setData({
        allchecked: true
      })
    }
    this.setData({
      checkedItem: checkedItem
    })
    this.showPrice()
  },
  chooseAll: function () {
    if (!this.data.cartData) {
      return
    }
    var checkedItem = []
    if (!this.data.allchecked) {
      for (let i = 0; i < this.data.cartData[0].carItems.length; i++) {
        let cartId = this.data.cartData[0].carItems[i].id
        checkedItem.push(cartId)
      }
    } else {
      checkedItem.length = 0
    }

    this.setData({
      checkedItem: checkedItem,
      allchecked: !this.data.allchecked
    })
    this.showPrice()
  },

  showPrice: function () {
    if (!this.data.cartData) {
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

    for (let i = 0; i < cartDataItem.length; i++) {
      for (let j = 0; j < checkedItem.length; j++) {
        if (cartDataItem[i].id == checkedItem[j]) {
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
  getHotProduct: function () {

    let param = {
      orderType: 1,
    }
    var customIndex = app.AddClientUrl("/more_product_list.html", param, 'get', '1')
    var that = this
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        if (res.data.result) {
          that.dellProductImage(res.data.result)
        }
      },
      fail: function (res) {
        console.log("fail")
        app.loadFail()
      }
    })
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      sysWidth: app.globalData.sysWidth,
      loginUser: app.loginUser,
      setting: app.setting
    });
    this.getCart()
    this.getHotProduct()

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
    //this.getCart()
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
    this.setData({
      hasMore: false
    })
    wx.stopPullDownRefresh()
  },
  //点击购物车中的商品，跳转到详情页面
  cart_pro_click_toDetail: function (e) {
    console.log("点击购物车中的商品，跳转到详情页面")
    console.log(e.currentTarget.dataset)
    let promotionId = e.currentTarget.dataset.promotionid;
    let productId = e.currentTarget.dataset.productid;
    let description = e.currentTarget.dataset.description.description;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/promotion_products/index?' +
      'description=' + description + '&navName=' + name + '&productName=' + productId + '&id=' + promotionId,
    })
  },
  /* 分享 */
  onShareAppMessage: function (res) {
    if (res.from == "button") {
      let index = res.target.dataset.index
      let products = this.data.products
      let focusData = products[index]
      if (!focusData.brandName || focusData.brandName == "") {
        focusData.brandName = ""
      };
      let imageUrl = focusData.imagePath
      let shareName = '活动价：￥' + focusData.price + '(原价：￥' + focusData.tagPrice + ')' + focusData.brandName + focusData.name
      let shareParams = {}
      shareParams.productName = focusData.productCode
      console.log('nnnnnnnnnn' + shareName)
      return app.shareForFx2('promotion_products', shareName, shareParams, imageUrl)
    }

    else {
      return app.shareForFx2(app.miniIndexPage)
    }
  },
  onReachBottom: function () {
    var that = this
    this.setData({
      listEnd: true
    })
  },

  /* 处理热销 */
  //切割数组
  sliceArray: function (array, size) {
    var result = [];
    if (!array) {
      return result;
    }
    for (let x = 0; x < Math.ceil(array.length / size); x++) {
      let start = x * size;
      let end = start + size;
      result.push(array.slice(start, end));
    }
    return result;
  },
  //获取图片数组 用来预览用
  getImageUrlList: function (array) {
    let result = [];
    if (!array) {
      return result;
    }
    for (let x = 0; x < array.length; x++) {
      result.push(array[x].imagePath);
    }
    return result;
  },
  sliceProductImageList: function (arr) {
    let that = this
    for (let i = 0; i < arr.length; i++) {
      arr[i].imageListArr = that.sliceArray(arr[i].itemImages, 4)
      arr[i].imageListWatcher = that.getImageUrlList(arr[i].itemImages)
      arr[i].showShare = false //显示分享
    }
    return arr
  },
  //处理图片，只要四张
  dellProductImage: function (products) {

    let productsResult = this.sliceProductImageList(products)
    this.setData({
      products: productsResult
    })
  },
  /* 热销操作 */
  //点击 ...  显示分享
  showCardShare: function (e) {
    let oldIndex = this.data.focusIndex
    let index = e.currentTarget.dataset.index;
    let products = this.data.products
    let focusData = products[index]

    console.log(focusData)
    if (oldIndex == index) {
      focusData.showShare = !focusData.showShare
    } else {
      this.closeCardShare(oldIndex)
      focusData.showShare = !focusData.showShare
    }

    console.log('--------1--------' + index)
    this.setData({
      products: products,
      focusIndex: index
    })
  },
  //关闭 ... 
  closeCardShare: function (oldIndex) {

    let index = this.data.focusIndex
    if (!isNaN(oldIndex) && oldIndex > -1) {
      index = oldIndex
    }
    console.log('--------2--------' + index)
    if (index == -1) {
      return
    }

    let products = this.data.products
    let focusData = products[index]

    if (focusData.showShare == false) {
      return
    }
    focusData.showShare = false
    this.setData({
      products: products
    })
  },
  //开关显示客服的
  showKefuWechatCode: function (e) {

    let index = e.currentTarget.dataset.index;
    this.closeCardShare(index)
    this.setData({
      showKefu: true
    })
  },
  //查看客服里面的二维码
  lookBigWxCode: function (e) {
    let url = e.currentTarget.dataset.url;
    if (!url) {
      return
    }
    let urls = []
    urls.push(url)
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  closeKefu: function () {
    this.setData({
      showKefu: false
    })
  },

  //看大图
  watchBigImage: function (e) {
    let urls = e.currentTarget.dataset.urls;
    let myurl = e.currentTarget.dataset.me
    console.log(urls)
    wx.previewImage({
      current: myurl, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },


  /* 规格和加入购物车部分 */
  byNowParams: {
    productId: '',
    itemCount: 1,
    shopId: '',
    cartesianId: '0',
    orderType: ''
  },
  subNum: function () {
    if (this.byNowParams.itemCount == 1) {
      return
    }
    this.byNowParams.itemCount--;
    this.setData({ byNowParams: this.byNowParams })
  },
  addNum: function (e) {
    let cantadd = e.currentTarget.dataset.cantadd;
    if (cantadd == 1) {
      return
    } else {
      this.byNowParams.itemCount++;
      this.setData({ byNowParams: this.byNowParams })
    }
  },

  //点击加入购物车或立即下单

  bindBuy: function (e) {
    let index = e.currentTarget.dataset.index;
    let bindBuy = e.currentTarget.dataset.bindbuy;

    let products = this.data.products
    let focusData = products[index]
    this.byNowParams.productId = focusData.id
    this.byNowParams.shopId = focusData.belongShopId
    this.byNowParams.orderType = 0
    this.chooseMeasureItem(focusData)
    console.log(focusData)
    this.setData({
      focusData: focusData,
      showCount: true,
      byNowParams: this.byNowParams,
      bindBuy: bindBuy
    })
  },
  buyNow: function () {
    console.log(this.byNowParams)
    if (!app.checkShopOpenTime()) {
      return
    }

    if (!app.checkIfLogin()) {
      return
    }
    //立即购买
    if (this.data.bindBuy == 'addto') {
      console.log('加入购物车')
      //addto
      this.addtocart()
    } else {
      console.log('立即购买')
      this.createOrder22(this.byNowParams)
    }

  },
  /* 加入購物車 */
  addtocart: function () {

    if (!app.checkIfLogin()) {

      return
    }
    var params = {
      cartesianId: '',
      productId: '',
      shopId: '',
      count: '',
      type: '',
    }

    if (!this.data.focusData.measureItem || this.data.focusData.measureTypes.length == 0) {
      params.cartesianId = '0'
    }
    else {
      params.cartesianId = this.data.measurementJson.id
    }

    params.productId = this.data.focusData.id
    params.shopId = this.data.focusData.belongShopId
    params.count = this.byNowParams.itemCount
    params.type = 'add'

    this.postParams_hot(params)

  },

  postParams_hot: function (data) {
    var that = this
    var customIndex = app.AddClientUrl("/change_shopping_car_item.html", data, 'post')
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        console.log('---------------change_shopping_car_item-----------------')
        console.log(res.data)
        wx.hideLoading()

        if (that.data.bindType == 'addto') {
          that.setData({ showCount: false })
        }
        if (res.data.productId && res.data.productId != 0) {
          that.setData({
            carCount: res.data.totalCarItemCount
          })
          if (data.count == 0) {
            console.log('通过加入购物车来确定购物车里面的商品数量')
          } else {
            wx.showToast({
              title: '加入购物车成功',
            })
            that.setData({
              hasMore: true
            })
          }
        } else {
          wx.showToast({
            title: res.data.errMsg,
            image: '/images/icons/tip.png',
            duration: 3000
          })
        }


      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },

  /* 创建订单 */
  createOrder22: function (o) {
    var customIndex = app.AddClientUrl("/buy_now.html", o, 'post')
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
        if (!!res.data.orderNo) {
          wx.hideLoading()
          wx.navigateTo({
            url: '/pages/edit_order/index?orderNo=' + res.data.orderNo,
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.errMsg,
            image: '/images/icons/tip.png',
            duration: 3000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      },
      complete: function (res) {

      }
    })
  },
  closeZhezhao: function () {
    this.MeasureParams = []
    this.setData({ showCount: false, focusData: null })
  },


  /* 
     规格操作
  */
  MeasureParams: [],
  //提交规格产品
  submitMeasure: function (id) {
    var that = this
    let focusProduct = this.data.focusData
    let measurementJson = this.data.measurementJson
    let data = {}
    data.cartesianId = measurementJson.id
    data.productId = focusProduct.id
    data.shopId = focusProduct.belongShopId
    data.count = 1
    data.type = 'add'

    var customIndex = app.AddClientUrl("/change_shopping_car_item.html", data, 'post')
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        console.log('--------add----------')
        console.log(res.data)

      },
      fail: function (res) {
        app.loadFail()
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  //获取规格价格参数
  get_measure_cartesion: function () {
    this.byNowParams.cartesianId = -1
    let productId = this.data.focusData.id
    let postStr = ''

    if (!this.data.focusData.measureItem || this.MeasureParams.length == 0) {
      this.byNowParams.cartesianId = '0'
      return
    }
    for (let i = 0; i < this.MeasureParams.length; i++) {
      postStr += this.MeasureParams[i].value + ','
    }
    let param = {}
    param.productId = productId
    param.measureIds = postStr
    let customIndex = app.AddClientUrl("/get_measure_cartesion.html", param)

    var that = this
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        if (!res.data.id) {
          // 没有这个参数
          //......
          console.log('error')
          //.....
        }
        console.log(res.data)
        that.byNowParams.cartesianId = res.data.id
        that.setData({
          measurementJson: res.data
        })
      },
      fail: function (res) {
        console.log("mesure_fail")
        app.loadFail()
      },
      complete: function () {
      },
    })
  },
  /* 初始化 选规格 */
  chooseMeasureItem: function (focusData) {
    console.log('----------初始化规格参数-----------')
    if (!focusData.measureItem) {
      return
    }
    for (let i = 0; i < focusData.measureTypes.length; i++) {
      focusData.measureTypes[i].checkedMeasureItem = 0
      //初始化选择的数据
      let param = {}
      param.name = focusData.measureTypes[i].name
      param.value = focusData.measureTypes[i].productAssignMeasure[0].id

      this.MeasureParams.push(param)

    }
    this.setData({
      focusData: focusData
    })
    this.get_measure_cartesion()
  },
  //选择规格小巷的---显示
  radioChange: function (e) {
    let index = e.currentTarget.dataset.index
    let indexJson = app.getSpaceStr(index, '-')
    //console.log(indexJson)

    let focusData = this.data.focusData
    focusData.measureTypes[indexJson.str1].checkedMeasureItem = indexJson.str2
    this.setData({ focusData: focusData })
  },
  //选择规格小巷---获取数据
  chooseMeasure: function (e) {
    console.log(e.detail.value)
    let chooseMeasureJson = app.getSpaceStr(e.detail.value, '-')
    console.log(chooseMeasureJson)

    for (let i = 0; i < this.MeasureParams.length; i++) {
      if (this.MeasureParams[i].name == chooseMeasureJson.str1) {
        this.MeasureParams[i].value = chooseMeasureJson.str2
      }
    }
    this.get_measure_cartesion()
  },
})