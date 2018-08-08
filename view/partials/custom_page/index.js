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
  },

  ready: function () {
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
  },
  methods: {
    // 这里是一个自定义方法
    /* 组件事件集合 */
    tolinkUrl: function (e) {
      console.warn("=======e=======", e)
      let linkUrl = e.currentTarget.dataset.link
      app.linkEvent(linkUrl)
    },
    // 滚动切换标签样式
    switchTab: function (e) {
      this.setData({
        currentTab: e.detail.current
      });
      this.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function (e) {
      var cur = e.target.dataset.current;
      if (this.data.currentTaB == cur) { return false; }
      else {
        this.setData({
          currentTab: cur
        })
      }
   
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
      this.setData({ partials: PaiXuPartials })
      console.log(PaiXuPartials)
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