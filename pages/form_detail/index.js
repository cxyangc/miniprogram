
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData:null,
    sexArray:['男','女'],
    pickerIndex:0,
    upLoadImageList:{},
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e, this.data.formData)
    let index = e.target.dataset.index
    this.data.formData.items[index].defaultValue = e.detail.value
    this.setData({
      formData: this.data.formData
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e, this.data.formData)
    let index = e.target.dataset.index
    this.data.formData.items[index].defaultValue = e.detail.value
    this.setData({
      formData: this.data.formData
    })
  },
  // 返回首页
  toIndex:function(){
    app.toIndex();
  },
  login: function(e) {
    wx.switchTab({
      url: '../../pageTab/custom_page_index/index',
    })
  },
  bindPickerChange:function(event){
    console.log('====index', event)
    let index = event.detail.value
    this.setData({ pickerIndex: index})
  },
  params:{
    formJson:'',
    customFormId:'',
    miniNotifyFormId:'',
  },
  formSubmit:function(e){
    console.log('form发生了submit事件，携带数据为：', e)
    var that = this;
    console.log(that.params);
    let value = e.detail.value;
    let imgObj = {};
    for (let i = 0; i<that.data.formData.items.length;i++){
      if (that.data.formData.items[i].type==7){
        imgObj[that.data.formData.items[i].name] = that.data.upLoadImageList['img_' + i]
      } else if (that.data.formData.items[i].type ==2){
        
      }
    }
    value = Object.assign({}, value, imgObj)
    console.log('===value=====', value)
    that.params.miniNotifyFormId = e.detail.formId;
    that.params.formJson = JSON.stringify(value);
    var formData = app.AddClientUrl("/wx_commit_custom_form.html", that.params, 'post')
    wx.request({
      url: formData.url,
      data: formData.params,
      header: app.headerPost,
      success: function (res) {
        console.log(res.data)

        if (res.data.errcode == '0') {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            that.toIndex()
          }, 1000)
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
  removeImg:function(event){
    let that=this;
    console.log('======event==',event);
    let index = event.currentTarget.dataset.index;
    that.data.upLoadImageList['img_' + index]='';
    console.log('that.data.upLoadImageList', that.data.upLoadImageList);
    that.setData({ upLoadImageList: that.data.upLoadImageList })
  },
  addCommitImage: function (e) {
    console.log('===addCommitImage=',e)
    var that = this;
    let index = e.currentTarget.dataset.index;
    let upLoadImageList = that.data.upLoadImageList
    if (upLoadImageList.length == 1) {
      return
    }
    wx.chooseImage({
      count: 8, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths
        that.uploadImage(tempFilePaths, tempFilePaths.length,index)
      }
    })
  },
  uploadImage: function (tempFilePaths, count,index) {
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
            upLoadImageList['img_' + index] = data.relateObj.imageUrl
            // upLoadImageList.push(data.relateObj.imageUrl)
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
        console.log('==upLoadImageList==',that.data.upLoadImageList)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    console.log(options)
    that.params.customFormId = options.customFormId;
    console.log(that.params);
    let formDetailData = app.AddClientUrl("/wx_get_custom_form.html", options, 'get')
    console.log('==formDetailData===', formDetailData)
    wx.request({
      url: formDetailData.url,
      data: formDetailData.params,
      header: app.headerPost,
      method: 'get',
      success: function (res) {
        console.log(res)
        that.setData({ formData: res.data.relateObj})
        if (that.data.formData.items.length>0){
          for (let i = 0; i < that.data.formData.items.length; i++) {
            if (that.data.formData.items[i].listValues) {
              that.data.formData.items[i].listValues=that.data.formData.items[i].listValues.split(",")
            }
          }
          that.setData({ formData: that.data.formData })
          console.log(that.data.formData)
          console.log(that.data.formData.items);
        }
        wx.setNavigationBarTitle({
          title: that.data.formData.formName
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})