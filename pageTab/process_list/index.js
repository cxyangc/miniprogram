
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    processList: [],
  },
  /* 获取数据 */
  getProcessList: function () {
    let that = this
    if (!app.checkIfLogin()) return;
    let getParams = {}
    getParams.customprocessId = that.params.customprocessId
    getParams.page = that.listPage.page;
    let customIndex = app.AddClientUrl("/wx_get_process_instance_list.html", getParams)
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log('====getProcessList-res===',res)
        if(res.data.errcode == 0){
          that.listPage.pageSize = res.data.relateObj.pageSize
          that.listPage.totalSize = res.data.relateObj.totalSize
          let dataArr = that.data.processList
          if ((!res.data.relateObj.result || res.data.relateObj.result.length == 0) || that.listPage.page==1) {
            dataArr=[];
          } 
          dataArr = dataArr.concat(res.data.relateObj.result)
          that.setData({ processList: dataArr })
        }
        console.log('===processList===', that.data.processList);
      },
      complete: function (res) {

      }
    })
  },
  getProcessDetail: function (processId, callback) {
    console.log('==processId==', processId)
    let that = this
    let params={};
    params.processInstanceId = processId
    let customIndex = app.AddClientUrl("/wx_get_process_instance_detail.html", params)
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log('====getProcessDetail-res===', res)
        if (res.data.errcode == 0) {
          if (callback) { callback(res)};
          that.setData({ processList: dataArr })
        }
      },
      complete: function (res) {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  params:{},
  onLoad: function (options) {
    console.log('===options===', options)
    let that=this;
    if (options && options.actionEvent){
      let params = JSON.parse(options.actionEvent)
      that.doAction(params)
    }
    that.params=options
    that.getProcessList();
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
    if (this.data.reflesh == 1) {
      this.onPullDownRefresh()
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
    this.listPage.page = 1
    this.getProcessList();
    wx.stopPullDownRefresh()
  },


  listPage: {
    page: 1,
    pageSize: 0,
    totalSize: 0,
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('===onReachBottom====')
    var that = this
    if (that.listPage.totalSize > that.listPage.page * that.listPage.pageSize) {
      that.listPage.page++
      this.getProcessList();
    }
  },

})