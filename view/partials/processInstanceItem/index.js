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
    processItem:{},
    paymentCodeUrl:"",
    paymentCodeState:false
  },

  ready: function () {
    let that = this;
    console.log("====processInstanceItem====", that.data.data)
    that.setData({ processItem: that.data.data,setting: app.setting, loginUser: app.loginUser })
  },
  methods: {
    createPaymentCode: function (event){
      wx.showToast({
        title: '生成中...',
        icon: 'loading',
      })
      let that = this;
      that.setData({ paymentCodeState: false })
      let processInstanceId = event.currentTarget.dataset.id || 0;
      let getParams={};
      getParams.processInstanceId = processInstanceId;
      let customIndex = app.AddClientUrl("/pay_process_instance_with_wx_qr_code.html", getParams)
      wx.request({
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          wx.hideLoading();
          console.log('====createPaymentCode===', res)
          if (res.data.errcode == 0) {
            that.setData({ paymentCodeState: true, paymentCodeUrl: { imageUrl: res.data.relateObj, price: that.data.processItem.serviceAmount}})
          } else {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'success',
              duration: 2000
            })
          }
        },
        complete: function (res) {
          wx.hideLoading()
        }
      })
    },
    doProcessAction: function (event) {
      console.log(event)
      let that = this;
      let params = {};
      let customFormId = event.currentTarget.dataset.formid || 0;
      if (event) {
        params.processStageActionId = event.currentTarget.dataset.actionid;
        params.processInstanceId = event.currentTarget.dataset.processinstanceid;
      }
      if (customFormId && customFormId != 0) {
        app.preCallbackObj = { 'processInstanceItem':{callback:function(obj){
          params.formCommitId = obj;
          console.log("===========================process intance item  hello===="+obj);
          that.doAction(params)
        }}
        };
        let linkUrl = "form_detail.html?customFormId=" + customFormId + "&actionEvent=" + JSON.stringify(params);
        app.linkEvent(linkUrl);
      } else {
        params.formCommitId = 0;
        wx.showModal({
          title: '提示',
          content: '主人~您是否确认执行!',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.doAction(params)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    doAction: function (params) {
      let that=this;
      let getParams = params;
      let customIndex = app.AddClientUrl("/wx_doProcess_instance_action.html", getParams)
      wx.request({
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          console.log('====doAction-res===', res)
          if (res.data.errcode == 0) {
            that.setData({ processItem: res.data.relateObj})
            wx.showToast({
              title: res.data.errMsg,
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'success',
              duration: 2000
            })
          }
        },
        complete: function (res) {

        }
      })
    },
    confirmProcessOrder: function (event) {
      console.log(event)
      let that = this;
      let params = {};
      let processInstanceId;
      if (event && event.currentTarget.dataset.id) {
        processInstanceId = event.currentTarget.dataset.id
      }
      params.processInstanceId = processInstanceId || 0;
      let customIndex = app.AddClientUrl("/wx_confirm_process_instance_servant.html", params)
      wx.request({
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          console.log('====confirmProcessOrder-res===', res)
          if (res.data.errcode == 0) {
            wx.showToast({
              title: "接单成功",
              icon: 'success',
              duration: 2000
            })
            that.setData({ processItem: res.data.relateObj })
          }
        },
        complete: function (res) {

        }
      })
    },
  },
})