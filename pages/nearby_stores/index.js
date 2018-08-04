const app = getApp()
Page({

  /**
   * 页面的初始数据 
   */
  // arr不能为空的原因：组件的ready事件在页面的加载事件之后，如果为空，那么就会先把arr判断为空。页面上就会先跳出来暂无门店。然后才会去更改
  data: {
arr:[1],
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  clickCatch:function(e){
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    console.log(this.data.arr[index])
    let latitude = this.data.arr[index].latitude;
    let longitude = this.data.arr[index].longitude;
    // 判断金纬度是否为空
    if (latitude == "" || longitude==""){
        returen;
    }
    else{
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        scale: 12,

      })
    }
   
  },
  onLoad: function (option) {
    var that = this 
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude1 = res.latitude
        var longitude1 = res.longitude;
        console.log(longitude1 + "..............." + latitude1)
        let menDian = {
          longitude: longitude1,
          latitude: latitude1
        }

        // longitude 经度        
        // 获取门店的样式
 
        let menDianYangShi = app.AddClientUrl("/find_mendians.html", menDian, 'get')
        // console.log("customIndex--------" + JSON.stringify(menDianYangShi))
        // console.log("customIndex--------" + menDianYangShi.url)
        wx.request({
          url: menDianYangShi.url,
          data: menDianYangShi.params,
          header: app.headerPost,
          method: 'GET',
          success: function (res) {
            console.log(res)
            console.log(res.data.relateObj.result)
            if (res.data.errcode == "-1") {
              wx.showToast({
                title: res.data.errMessage,
                image: '/images/icons/tip.png',
                duration: 2000
              })
            }
            else {
              that.setData({
                arr: res.data.relateObj.result,
              })

            }


          }
        })
      }

    })



  },
  // 设置门店
  setUpMenDian: function (MenDianID) {
    var id = MenDianID
    let menDianParameter = {
      mendianId: id
    }

    let menDianYangShi = app.AddClientUrl("/location_mendian.html", menDianParameter, 'get')
    wx.request({
      url: menDianYangShi.url,
      data: menDianYangShi.params,
      header: app.headerPost,
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.errcode == "-1") {
          wx.showToast({
            title: res.data.errMessage,
            image: '/images/icons/tip.png',
            duration: 2000
          })
        }
        else {
          console.log("设置成功")

        }
      }
    })
  },
  click: function (e) {
  
    var index = e.currentTarget.dataset.index;
    app.currentMendianComponentCallback(this.data.arr[index]);
    console.log(this.data.arr[index].id);
    this.setUpMenDian(this.data.arr[index].id)
  wx.navigateBack({
    delta: 1,
  })
    return;
  
   
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
