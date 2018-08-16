const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    proId: {
      type: String,
      value: '0',
    },
    shopId: {
      type: String,
      value: '0',
    },
    ewmImgUrl: {
      type: String,
      value: '0',
    },
  },
  data: {
    // 这里是一些组件内部数据
    maskHidden:true,
    someData: {},
    productData:{},
    imgInfo: {scale_y:0, scale_x:0,w:0,h:0},
  },
  ready:function(){
    this.getProInfo();
  },
  methods: {
    downFileFun: function (url,typeData) {
      let that = this
      const downloadTask = wx.downloadFile({
        url: url, //仅为示例，并非真实的资源
        success: function (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          console.log('=======downloadTask======', res)
          if (res.statusCode === 200) {
            if (typeData ==='proImg'){
              that.setData({
                img_l: res.tempFilePath //将下载的图片临时路径赋值给img_l,用于预览图片
              })
            } else if (typeData === 'showEwm'){
              that.setData({
                img_ewm: res.tempFilePath //将下载的图片临时路径赋值给img_l,用于预览图片
              })
            }
          }
          that.getImgBiLi(that.data.img_l)
        }
      })
    },
    getImgBiLi:function(url){
      let that = this;
      var clientWidth = wx.getSystemInfoSync().screenWidth;
      var imgInfo = { scale_y: 0, scale_x: 0, w: 0, h: 0};
      wx.getImageInfo({
        src: url,
        success: function (res) {
          console.log('==getImageInfo===', res.width)
          console.log('==getImageInfo===', res.height)
          imgInfo.w = res.width     //图片真实宽度
          imgInfo.h = res.height   //图片真实高度
          imgInfo.scale_x = clientWidth * imgInfo.w / imgInfo.h;
          imgInfo.scale_y = clientWidth * imgInfo.h / imgInfo.w ;
          that.setData({
            imgInfo: imgInfo //将下载的图片临时路径赋值给img_l,用于预览图片
          })
          console.log('==getImageInfo===', that.data.imgInfo)
          that.customMethod();
        }
      })
    },
    getProInfo: function () {
      let that = this
      wx.showLoading({
        title: 'loading'
      })

      let postParam = {}
      postParam.productId =this.data.proId
      postParam.addShopId = this.data.shopId
      let customIndex = app.AddClientUrl("/product_detail.html", postParam)

      wx.request({
        /* url: app.clientUrl + app.clientNo + "/product_detail_" + param.id + ".html?jsonOnly=1" + "&addShopId=" + param.addShopId, */
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          console.log(res.data)
          console.log('--------------getData-------------')
          that.setData({ productData: res.data })
          that.downFileFun(that.data.productData.images[0].imagePath,'proImg')
          that.downFileFun(that.data.ewmImgUrl,'showEwm')
        },
        fail: function (res) {
          console.log("fail")
          app.loadFail()
        },
        complete: function (res) {
          wx.hideLoading()
        },
      })
    },
    // 这里是一个自定义方法
    customMethod: function () {
      let that=this;
      console.log('4444444444444', this.data.innerText)
      var clientWidth = wx.getSystemInfoSync().screenWidth;
      var context = wx.createCanvasContext('shareCanvas', this)
      // if (that.data.imgInfo.h > that.data.imgInfo.w) {
      //   context.drawImage(that.data.img_l, 0, 0, that.data.imgInfo.w, that.data.imgInfo.h, 16, 16, that.data.imgInfo.scale_x, that.data.imgInfo.scale_y);
      // } else {
      //   context.drawImage(that.data.img_l, 0, 0, that.data.imgInfo.w, that.data.imgInfo.h, 16, 16, that.data.imgInfo.scale_x, that.data.imgInfo.scale_y);
      // }
      context.drawImage(that.data.img_l, 16, 16, clientWidth * 0.65, clientWidth * 0.65)
      context.setTextAlign('left')    // 文字居中
      context.setFillStyle('#000000')  // 文字颜色：黑色
      context.setFontSize(12)         // 文字字号：22px
      //context.fillText("叶礼旺大师，极品青兔毫！口径14.8×5.5cm", 0, clientWidth * 0.7)
      context.lineWidth = 0.8;
      var str = that.data.productData.productInfo.name
      that.InterceptStr(str, clientWidth * 0.62, clientWidth * 0.7 + 16, context)
      //context.fillText(str, 15, clientWidth * 0.7+16)
      //this.strFun(str, clientWidth * 0.62, clientWidth * 0.7,context)

      context.lineWidth =0.5;
      context.setTextAlign('left')    // 文字居中
      context.setFillStyle('#999')  // 文字颜色：黑色
      context.setFontSize(12)         // 文字字号：22px
      //that.InterceptStr(that.data.productData.productInfo.description, clientWidth * 0.62, clientWidth * 0.75 + 16, context)
      //context.fillText(that.data.productData.productInfo.description, 16, clientWidth * 0.75 + 16)
      // 横线
      context.moveTo(16, clientWidth * 0.8 + 16);
      context.strokeStyle = "#999"  // 文字颜色：黑色
      context.lineTo(clientWidth * 0.68, clientWidth * 0.8 + 16);

      context.setTextAlign('left')    // 文字居中
      context.setFillStyle('#000')  // 文字颜色：黑色
      context.setFontSize(12)         // 文字字号：22px
      context.fillText("长按识别小程序码访问", 16, clientWidth * 0.88 + 16)

      context.setTextAlign('left')    // 文字居中
      context.setFillStyle('#999')  // 文字颜色：黑色
      context.setFontSize(12)         // 文字字号：22px
      context.fillText("三三网络科技有限公司", 16, clientWidth * 0.93 + 16)

      context.drawImage(that.data.img_ewm, clientWidth * 0.5 - 16, clientWidth * 0.8 + 16, 80, 80)

      context.stroke()
      context.draw()
      //绘制图片
      wx.showToast({
        title: '分享图片生成中...',
        icon: 'loading',
        duration: 1000
      });
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'shareCanvas',
          fileType:'jpg',
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            console.log(tempFilePath);
            that.setData({
              imagePath: tempFilePath,
              maskHidden: false
              // canvasHidden:true
            });
            wx.hideToast()
          },
          fail: function (res) {
            console.log(res);
          }
        },that);
      }, 500);
      // context.draw(false, wx.canvasToTempFilePath({
      //   canvasId: 'shareCanvas',
      //   success: function (res) {
      //     var tempFilePath = res.tempFilePath;
      //     console.log('99999999',tempFilePath);
      //     that.setData({
      //       imagePath: tempFilePath,
      //       maskHidden: false
      //       // canvasHidden:true
      //     });
      //     wx.hideToast()
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   }
      //   },this))
     },
    saveImageToLocal: function (e) {
      let imgSrc = this.data.imagePath
      console.log(imgSrc)
      let PostImageSrc = imgSrc.replace(/http/, "https")
      // let PostImageSrc = imgSrc
      console.log(PostImageSrc)
      if (!imgSrc) {
        return
      }
      let urls = []
      urls.push(imgSrc)
      wx.previewImage({
        current: imgSrc, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    },
    closeFun:function(){
      this.triggerEvent('closePoaster', 0) //myevent自定义名称事件，父组件中使用
    },
    InterceptStr: function (str, canvasWidth, canvasHeight, context){
      var lineWidth = 0;
      var canvasWidth = canvasWidth;//计算canvas的宽度
      var initHeight = canvasHeight;//绘制字体距离canvas顶部初始的高度
      var lastSubStrIndex = 0; //每次开始截取的字符串的索引
      for (let i = 0; i < str.length; i++) {
        lineWidth += context.measureText(str[i]).width;
        if (lineWidth > canvasWidth) {
          context.fillText(str.substring(lastSubStrIndex, i), 16, initHeight);//绘制截取部分
        }else{
          context.fillText(str.substring(lastSubStrIndex, i), 16, initHeight);//绘制截取部分
        }
      }
    },
    strFun: function (str, canvasWidth, canvasHeight, context){
       var lineWidth = 0;
       var canvasWidth = canvasWidth;//计算canvas的宽度
       var initHeight = canvasHeight;//绘制字体距离canvas顶部初始的高度
       var lastSubStrIndex = 0; //每次开始截取的字符串的索引
       for (let i = 0; i < str.length; i++) {
         lineWidth += context.measureText(str[i]).width;
         if (lineWidth > canvasWidth) {
           context.fillText(str.substring(lastSubStrIndex, i), 0, initHeight);//绘制截取部分
           initHeight += 20;//20为字体的高度
           lineWidth = 0;
           lastSubStrIndex = i;
         }
         if (i == str.length - 1) {//绘制剩余部分
           context.fillText(str.substring(lastSubStrIndex, i + 1), 0, initHeight);
         }
       }
     }
  }
})