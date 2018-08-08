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
    someData: {},
    sysWidth: "",
    arr:[],
    currentTab:"",
  },

  ready: function () {

    var that=this;
    this.setData({
      sysWidth: app.globalData.sysWidth
    });
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });

    // console.log( this.data.data.jsonData.tabs[0].linkUrl)
    var linkUrl = this.data.data.jsonData.tabs[0].linkUrl
    var resultUrl = linkUrl.substring(12, linkUrl.length - 5)
     // 查看当前页面的内容
    var finnalUrl = "/" + linkUrl
    var pageParam = { "Cpage": resultUrl }
    console.log(finnalUrl + pageParam.Cpage)
    var customIndex = app.AddClientUrl(finnalUrl, pageParam, 'get', 1)
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    //拿custom_page
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data.partials)
        that.setData({
          arr: res.data.partials
        })
        if (res.data.errcode < 0) {
          console.log(res.data.errMsg)
        }
        else {
          wx.hideLoading()
          if (!!res.data.partials) {
            that.getPartials(res.data.partials)
          } else {
            console.log('--------error --------' + res.data)
          }
        }
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })

    this.triggerEvent("action", { object: this });
  },

 
  methods: {

    refresh:function(){
      console.log("===test=11======", this.data.currentTab)
      if (this.data.currentTab == "") {
        var linkUrl = this.data.data.jsonData.tabs[0].linkUrl
     
       }
      else {
        var linkUrl = this.data.data.jsonData.tabs[this.data.currentTab].linkUrl
      }
        // console.log( this.data.data.jsonData.tabs[0].linkUrl)
      var resultUrl = linkUrl.substring(12, linkUrl.length - 5)
        // 查看当前页面的内容
        var finnalUrl = "/" + linkUrl
        var pageParam = { "Cpage": resultUrl }
        console.log(finnalUrl + pageParam.Cpage)
        var customIndex = app.AddClientUrl(finnalUrl, pageParam, 'get', 1)
        var that = this
        wx.showLoading({
          title: 'loading'
        })
        //拿custom_page
        wx.request({
          url: customIndex.url,
          header: app.header,
          success: function (res) {
            console.log("这是resultUrl",res.data.partials)
            let data = res.data.partials
            let index=0;
            let a=[];
            for (var i = 0; i < data.length; i++) {
              index = i;
              console.log(data[index].partialType)
              if (data[index].partialType != "13") {
                a.push(data[index]);
                console.log(a)
                that.setData({
                  arr: a
                })
              }

            }
            console.log("这是resultUrl的数据", that.data.arr)
            if (res.data.errcode < 0) {
              console.log(res.data.errMsg)
            }
            else {
              wx.hideLoading()
              if (!!res.data.partials) {
                that.getPartials(res.data.partials)
              } else {
                console.log('--------error --------' + res.data)
              }
            }
          },
          fail: function (res) {
            wx.hideLoading()
            app.loadFail()
          }
        })
   
    },
 

   
    getPartials: function (partials) {
      var PaiXuPartials = [];
      var that = this
      for (let i = 0; i < partials.length; i++) {
        if (typeof (partials[i].jsonData) == "string") {
          partials[i].jsonData = JSON.parse(partials[i].jsonData)
        }
        if (partials[i].partialType == 1) {

          WxParse.wxParse('article', 'html', partials[i].jsonData.content, that, 5);
        }
        if (partials[i].partialType == 12) {
          wx.setNavigationBarTitle({
            title: partials[i].jsonData.title
          })
          if (!partials[i].jsonData.titleColor) {
            partials[i].jsonData.titleColor = '#000000'
          }
          if (!partials[i].jsonData.bgColor) {
            partials[i].jsonData.bgColor = '#ffffff'
          }
          console.log('setTitle-' + typeof (partials[i].jsonData.titleColor))
          wx.setNavigationBarColor({
            frontColor: partials[i].jsonData.titleColor,
            backgroundColor: partials[i].jsonData.bgColor,
          })

        } else {
          PaiXuPartials.push(partials[i]);
        }

      }
      this.setData({ arr: PaiXuPartials })
      console.log(PaiXuPartials)
    },
    // 这里是一个自定义方法
    // 滚动切换标签样式
    switchTab: function (e) {

      this.setData({
        currentTab: e.detail.current
      });
      this.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function (e) {
      var that=this;
      var cur = e.target.dataset.current;
      var linkUrl = e.target.dataset.html
      var resultUrl = linkUrl.substring(12, linkUrl.length - 5)
      console.log("这是值" + resultUrl)

      if (this.data.currentTaB == cur) { return false; }
      else {
        this.setData({
          currentTab: cur
        })
      }

      //triggerEvent函数接受三个值：事件名称、数据、选项值    
      // 查看当前页面的内容
      var finnalUrl = "/"+linkUrl
      var pageParam = { "Cpage": resultUrl }
     console.log(finnalUrl + pageParam.Cpage)
      var customIndex = app.AddClientUrl(finnalUrl, pageParam, 'get', 1)
      var that = this
      wx.showLoading({
        title: 'loading'
      })
      //拿custom_page
      wx.request({
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          console.log(res.data.partials)
        //  that.setData({
        //    arr: res.data.partials
        //  })
          if (res.data.errcode < 0) {
            console.log(res.data.errMsg)
          }
          else {
            wx.hideLoading()
            if (!!res.data.partials) {
              that.getPartials(res.data.partials)
            } else {
              console.log('--------error --------' + res.data)
            }
          }
        },
        fail: function (res) {
          wx.hideLoading()
          app.loadFail()
        }
      })
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function () {
      if (this.data.currentTab > 4) {
        this.setData({
          scrollLeft: 300
        })
      } else {
        this.setData({
          scrollLeft: 0
        })
      }
    },
  },
})