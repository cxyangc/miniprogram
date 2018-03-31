// pages/back_item_detail/index.js
const app = getApp()
Page({
  /** 
   * 页面的初始数据
   */
  data: {
    setting: null,
    Data: null,
    sentTagId: '',
    sysWidth: 320,
    tags: [],
    chooseTag: 0,
    ImageList: [],
    upLoadImageList: []
  },
  radioChange: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({ chooseTag: index })
  },
  chooseTag: function (e) {
    console.log(e.detail.value)
    this.setData({
      sentTagId: e.detail.value
    })

  },
  lookBigImage: function (e) {
    let url = e.currentTarget.dataset.url
    let urls = e.currentTarget.dataset.urls
    app.lookBigImage(url, urls)
  },
  deleSelectImage: function (e) {
    let index = e.currentTarget.dataset.index
    let upLoadImageList = this.data.upLoadImageList
    //upLoadImageList = upLoadImageList[index]
    upLoadImageList.splice(index, 1)
    this.setData({
      upLoadImageList: upLoadImageList
    })
  },
  /* 添加商品评论图片 */
  addCommitImage: function (e) {
    var that = this
    let upLoadImageList = that.data.upLoadImageList
    if (upLoadImageList.length > 7) {
      return
    }
    wx.chooseImage({
      count: 8, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths
        that.uploadImage(tempFilePaths, tempFilePaths.length)
        //that.addCommitImageToData( tempFilePaths)
      }
    })
  },
  uploadImage: function (tempFilePaths, count) {
    if (!app.loginUser) {
      app.echoErr('用户未登录')
      return
    }
    console.log(count)
    let that = this
    let param = {
      userId: app.loginUser.id
    }
    var customIndex = app.AddClientUrl("/file_uploading.html", param, 'POST')
    wx.uploadFile({
      url: customIndex.url, //仅为示例，非真实的接口地址
      header: {
        'content-type': 'multipart/form-data'
      },
      filePath: tempFilePaths[count - 1],
      name: 'file',
      formData: customIndex.params,
      success: function (res) {
        let upLoadImageList = that.data.upLoadImageList
        var data = res.data
        console.log(data)

        if (typeof (data) == 'string') {
          data = JSON.parse(data)
          console.log(data)
          if (data.errcode == 0) {
            upLoadImageList.push(data.relateObj.imageUrl)
            that.setData({
              upLoadImageList: upLoadImageList
            })
          }
        } else if (typeof (data) == 'object') {
          if (data.errcode == 0) {
            upLoadImageList.push(data.relateObj.imageUrl)
            that.setData({
              upLoadImageList: upLoadImageList
            })
          }
        }

        //do something
      }, fail: function (e) {
        console.log(e)
      }, complete: function (e) {
        if (count == 1 || count < 1) {
          return false;
        } else {
          that.uploadImage(tempFilePaths, --count)
        }

      }
    })
  },
  dellImageToSureBack: function (imageList) {
    let resultStr = ''

    for (let i = 0; i < imageList.length; i++) {
      resultStr += '<img src="' + imageList[i] + '"/>'

    }
    return resultStr

  },
  // 上传
  sureBackItem: function (e) {
    console.log(e.detail.value)
    let formData = e.detail.value
    if (!formData.backReason) {
      wx.showToast({
        title: "请填写退款原因",
        image: '/images/icons/tip.png',
        duration: 2000
      })
      return
    }
    let Data = this.data.Data
    let param = {}
    param.orderItemId = Data.id,
      param.backReason = formData.backReason
    param.tags = formData.tags
    if (this.data.upLoadImageList.length) {
      param.backImages = this.dellImageToSureBack(this.data.upLoadImageList)
    }

    var that = this
    wx.showModal({
      title: '提示',
      content: '确认退款',
      success: function (res) {
        if (res.confirm) {
          var customIndex = app.AddClientUrl("/send_back_order_item_req.html", param, 'POST')

          wx.request({
            url: customIndex.url,
            data: customIndex.params,
            header: app.headerPost,
            method: 'POST',
            success: function (res) {
              console.log(res.data)

              if (res.data.errcode == '0') {
                wx.showToast({
                  title: '申请退款成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack()
                }, 2000)
              } else {
                wx.showToast({
                  title: res.data.errMsg,
                  image: '/images/icons/tip.png',
                  duration: 2000
                })
              }

            },
            fail: function (res) {

            }
          })
        } else if (res.cancel) {

        }
      }
    })

  },

  getItem: function (orderItemId) {
    var that = this
    let param = {}
    param.orderItemId = orderItemId
    console.log(orderItemId)
    var customIndex = app.AddClientUrl("/get_back_order_item_page.html", param, 'get')
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res)
        // if(res.data.errcode)
        that.setData({
          Data: res.data
        })
        console.log(res.data)

      },
      fail: function (res) {
        app.loadFail()
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getItem(options.orderItemId)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let setting = app.setting
    let tags = setting.platformSetting.tagsMap['售后']

    console.log(tags)
    this.setData({
      setting: app.setting,
      sysWidth: app.globalData.sysWidth,
      tags: tags,
      sentTagId: tags[0].id
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})