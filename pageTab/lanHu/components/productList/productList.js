const app = getApp();

Component({
  properties: {


    // 这里定义了innerText属性，属性值可以在组件使用时指定
    data: {
      type: JSON,
      value: 'default value',
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  }, timer: null,
  ready: function () {

  let that=this;
    setTimeout(function () {
     
      console.log("that", that.data)
      let products = that.data.data
      that.setData({
        products: products
      })

    }, 1000)
  },
  methods: {
    // 这里是一个自定义方法
    getData: function () {
      console.log("this", this.data)
      let products = this.data.data.products
      this.setData({
        products: products
      })
    },
    tolinkUrl: function (e) {
      console.log(e.currentTarget.dataset.id)
      // product_detail.html?productId= 9219;
      var a = "product_detail.html?productId=" + e.currentTarget.dataset.id;
      app.linkEvent(a);
    },
      //点击 ...  显示分享
  showCardShare: function (e) {
    if (this.timer){
     clearTimeout(this.timer);
    }
    console.log("this", this.data)
  let that=this;
       // 找到商品id
      let id = e.currentTarget.dataset.id;
      console.log("id", id)
       // 循环products
      let products = this.data.data
      let a = 0;
      for (let i = 0; i < products.length; i++) {
        a = i;
        if (products[a].id == id) {
          products[a].productShow = true
          console.log(products[a])
            }
            else {
          products[a].productShow = false
            }
          }
      this.setData({
        products: products,
      })
   this.timer = setTimeout(function () {
        let productsCloseShow = that.data.products
        let b = 0;
        for (let j = 0; j < productsCloseShow.length; j++) {
          b = j;
          if (productsCloseShow[b].productShow == true) {

            productsCloseShow[b].productShow = false
    
          }
     
        }
        that.setData({
          products: productsCloseShow,
        })
   
   
      }, 5000)
     
 
    
    },
  closeCardShare: function (e) {
    // 找到商品id
    let id = e.currentTarget.dataset.id;
    console.log("id", id)

    // 循环products
    let products = this.data.data

    let a = 0;
    for (let i = 0; i < products.length; i++) {
      a = i;
      if (products[a].id == id) {

        products[a].productShow = false
        console.log(products[a])
      }
      else {
        products[a].productShow = false
      }
    }
    this.setData({
      products: products,
    })
    console.log(this.data.products)

  },
  // 加入购物车
    bindAddtocart: function (e) {
     console.log("e",e)
      this.triggerEvent("action", {e});
    },
    showPosters(e) {
      console.log("showPostersEEEE", e.detail.e.currentTarget.dataset.id)
      let that = this;
      this.setData({
        proId: e.detail.e.currentTarget.dataset.id,
        shopId: "236",
        posterState: true,

      })
   
    },
    // 点击海报
    showPosters: function (e) {
      console.log("eeeeeeeeeeeeeeeeeeeee", e)
      let id = e.target.dataset.id;
  

      let that=this;
      let productsCloseShow = that.data.products
      let b = 0;
      for (let j = 0; j < productsCloseShow.length; j++) {
        b = j;
        if (productsCloseShow[b].productShow == true) {
          productsCloseShow[b].productShow = false
        }
      }
      that.setData({
        products: productsCloseShow,
        posterState:true,
        proId:id
      })
      this.getQrCode();

      // this.triggerEvent("showPosters", { e });
    },
    // 获取二维码
    getQrCode: function () {

      let userId = "";
      if (app.loginUser && app.loginUser.platformUser) {
        userId = 'MINI_PLATFORM_USER_ID_' + app.loginUser.platformUser.id
      }
      console.log("app.loginUser.platformUser", app.loginUser.platformUser.id)
      // path=pageTab%2findex%2findex%3fAPPLY_SERVER_CHANNEL_CODE%3d'
      let postParam = {}
      postParam.SHARE_PRODUCT_DETAIL_PAGE = this.data.proId;
      postParam.scene = userId

      // 上面是需要的参数下面的url
      var customIndex = app.AddClientUrl("/super_shop_manager_get_mini_code.html?path=pageTab%2findex%2findex%3fSHARE_PRODUCT_DETAIL_PAGE%3d" + this.data.proId + "%26scene%3d" + userId, postParam, 'get', '1')
      var result = customIndex.url.split("?");

      customIndex.url = result[0] + "?" + result[1]

      console.log("customIndex", customIndex.url, result[0])

      var that = this
      that.setData({
        qrCodeUrl: customIndex.url
      })

    },
    // 关闭海报
    getChilrenPoster(e) {

      let that = this;
      that.setData({
        posterState: false,
      })

    },
  },
})