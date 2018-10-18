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
    showPopup:false,
    renderData: null,
    PaiXuPartials: [], 
  },

  ready: function () {
    let that=this;
    console.log('zujian',this.data.data)
    this.setData({ setting: app.setting })
    console.log('setting', this.data.setting)
    this.getParac();
    wx.getSetting({//检查用户是否授权了
      success(res) {
        console.warn("======getSetting:res========", res)
        if (!res.authSetting['scope.userInfo']) {
          console.log('=====1userInfo====')
          that.setData({ showPopup: true })
        } else {
          console.log('=====2userInfo====')
          that.setData({ showPopup: false })
        }
      }});
  },
  methods: {
    // 这里是一个自定义方法
    /* 组件事件集合 */
    bindGetUserInfo: function (e) {
      this.setData({ showPopup: false })
      console.log(e.detail.userInfo)
      if (e.detail.userInfo) {
        //用户按了允许授权按钮
        console.log('用户按了允许授权按钮')
        if (app.loginUser && app.loginUser.platformUser&&!app.loginUser.platformUser.nickname) {
           app.sentWxUserInfo(app.loginUser)
        }
      } else {
        console.log('用户按了拒绝按钮')
        //用户按了拒绝按钮
      }
    },
    cancel:function(){
      this.setData({ showPopup: false })
    },
    getParac: function () {
      var that = this
      var customIndex = app.AddClientUrl("/custom_page_" + that.data.data + ".html", {}, 'get', '1')
      //拿custom_page
      wx.request({
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          console.log("====== res.data=========", res.data)
          if (!res.data.errcode||res.data.errcode=='0'){
            wx.setNavigationBarTitle({
              title: res.data.channelTitle,
            })
            wx.hideLoading()
            app.renderData = res.data
            that.setData({ renderData: res.data })
            if (res.data.partials.length == 0) {
              that.setData({ PaiXuPartials: null })
            } else {
              that.getPartials();
            }
          }else{
            console.log('加载失败')
          }
        },
        fail: function (res) {
          console.log('------------2222222-----------')
          console.log(res)
          wx.hideLoading()

          //app.loadFail()

          wx.showModal({
            title: '提示',
            content: '加载失败，点击【确定】重新加载',
            success: function (res) {

              if (res.confirm) {
                that.getParac()
              } else if (res.cancel) {
                app.toIndex()
              }
            }
          })
        }
      })
    },
    getPartials: function () {
      var partials = this.data.renderData.partials;
      console.log("=====partials=====", partials)
      var PaiXuPartials = [];
      //排序
      if (partials && partials.length) {
        for (let i = 0; i < partials.length; i++) {
          // 产品标签的转化为数组start
          if (partials[i].partialType == 15 && partials[i].relateBean && partials[i].relateBean.length != 0) {
            for (let j = 0; j < partials[i].relateBean.length; j++) {
              if (partials[i].relateBean[j].tags && partials[i].relateBean[j].tags != '') {
                let tagArray = partials[i].relateBean[j].tags.slice(1, -1).split("][")
                partials[i].relateBean[j].tagArray = tagArray;
              }
            }
          }
          // 产品标签的转化为数组end
          if (typeof (partials[i].jsonData) == "string") {
            partials[i].jsonData = JSON.parse(partials[i].jsonData)
          } else {
            continue;
          }

          console.log("=====partials=====", partials)
          PaiXuPartials.push(partials[i]);
        }
      }
      this.setData({ PaiXuPartials: PaiXuPartials })
      console.log(this.data.PaiXuPartials)
    },

  },
})