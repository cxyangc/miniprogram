
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
    dataAndTime:{},
    processType:false,
    gainActionEvent: {},
    region: "请选择您的地址",
  },
  // 返回
  back:function(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    console.log(options)
    let formDetailData = app.AddClientUrl("/wx_get_custom_form_commit.html", { formCommitId: options.custom_form_commit_id}, 'get')
    wx.request({
      url: formDetailData.url,
      data: formDetailData.params,
      header: app.headerPost,
      method: 'get',
      success: function (res) {
        console.log(res)
        that.setData({ allFormData: res.data.relateObj})
        let customForm = that.data.allFormData.customForm;
        let commitJson = JSON.parse(that.data.allFormData.commitJson);
        console.log("===commitJson==", commitJson)
        if (customForm.items.length > 0) {
          let upLoadImageList = {};
          for (let i = 0; i < customForm.items.length; i++) {
            for (let j in commitJson){
              if (customForm.items[i].type == 7) {
                if (customForm.items[i].name == j) {
                  upLoadImageList['img_' + i] = commitJson[j]
                }
              } else if(customForm.items[i].type == 9) {
                if (customForm.items[i].name == j) {
                  customForm.items[i].defaultValue = commitJson[j]
                }
              } else {
                if (customForm.items[i].name==j){
                  customForm.items[i].defaultValue = commitJson[j]
                }
              } 
            }
          }
          that.setData({upLoadImageList: upLoadImageList})
          that.setData({ customForm: customForm })
          console.log(that.data.customForm)
        }
        wx.setNavigationBarTitle({
          title: that.data.customForm.formName
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})