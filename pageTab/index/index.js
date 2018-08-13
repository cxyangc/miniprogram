const app = getApp()
var timer11; // 计时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoadFail:false,
    showLoading:false ,
    page_name:""
  },
  
  toIndex:function(){
    let that=this; 
    setTimeout(function () {
 
      console.log("========app==", app, app.more_scene);
      // custom_page_index.html是首页也就是app.miniIndexPage+".html" 
      if (that.data.page_name != "" && that.data.page_name != app.miniIndexPage+".html"){
        // that.data.page_name是带着.html先去掉
        var linkUrl=that.data.page_name
        let urlData = app.getUrlParams(linkUrl)
        var resultUrl = linkUrl.substring(12, linkUrl.length - 5)
        if (urlData.param == '') {
          urlData.param = '?'
        }

        console.log("urlData" + urlData.param + "------" + resultUrl)
        wx.reLaunch({
          url: '/pages/custom_page/index' + urlData.param + '&Cpage=' + resultUrl,
        })

      }
      else{

      

   

        // wx.reLaunch({
        //   url: '/pageTab/' + app.miniIndexPage + '/index'
        // })

        // console.log("进入蓝湖")
        // wx.reLaunch({
        //   url: '/pageTab/lanHu/preApplyMendian/index?code=' +"LIN567"
        // })


        console.log("进入蓝湖")
        wx.reLaunch({
          url: '/pageTab/lanHu/index/index' 
        })

    

   
      }
 
      // if (app.more_scene && app.more_scene.indexOf("MINI_INVITATION_CODE")!=-1){
      //   wx.reLaunch({          
      //     url: '/pages/apply_for_facilitator/apply_for_facilitator?scene=' + app.more_scene,//申请服务商
      //   })
      // }else{
      //   wx.reLaunch({
      //     url: '/pageTab/' + app.miniIndexPage + '/index'         
      //   })
      // }
     
    }, 100)
  },
  reloadJs:function(){//重新加載
    this.setData({
      showLoading: true
    })
    app.loadFirstEnter(app.more_scene)
    clearTimeout(timer11)
    this.count = 5
    this.Countdown(app);
    
  },
  opt:{},
  setNav:function(){
    wx.setNavigationBarTitle({
      title: '加载失败',
    })
  },
  onLoad: function (options) {
    console.log("=====options=====", options)
    let that = this
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType == 'none'){
            //无网络
            console.error('无网络')
            that.setNav()
            that.setData({
              showLoadFail:true
            })
        }
      }
    }) 
      // 预览页面 实际上就2点更改clientNo，重新获取setting（自己想多了）
    if (options.ENTER_PLATFORM_NO && options.ENTER_PLATFORM_NO != "" && options.ENTER_PAGE_NAME && options.ENTER_PAGE_NAME!=""){
      console.log("options.page_name", options.ENTER_PAGE_NAME)
       that.setData({
         page_name: options.ENTER_PAGE_NAME
       })
       console.log(" app.clientNo", app.clientNo)
       app.clientNo = options.ENTER_PLATFORM_NO
       app.getSetting();
      
  return;

      }

    //林做的，以后可以删除（项目）
    if (options.lanhu) {
      console.log("进入蓝湖")
              wx.reLaunch({
          url: '/pageTab/lanHu/index/index'         
        })
        return;
    } 
    if (options.APPLY_SERVER_CHANNEL_CODE && options.APPLY_SERVER_CHANNEL_CODE!=""){
      console.log("进服务商页面", options.APPLY_SERVER_CHANNEL_CODE)
      wx.reLaunch({
        url: '/pageTab/lanHu/preApplyMendian/index?code=' + options.APPLY_SERVER_CHANNEL_CODE
      })

      return;
   }

    //调用分销

    //如果传入的是 MINI_PLATFORM_USER_开头的更改用户推广人
    
    if (!!options.scene && options.scene.indexOf('MINI_PLATFORM_USER_ID')!=-1){ 
      if(app.loginUser){
        app.USER_DEFINED_SCENE = options.scene;
      app.changeUserBelong(options.scene)
      }else{
        app.USER_DEFINED_SCENE=options.scene;
      }
    } 

    //如果传入的是 MendainID

    if (!!options.ENTER_MENDIAN && options.ENTER_MENDIAN != -1) {
       console.log("传入的是id" + options.ENTER_MENDIAN)
       app.enterMenDianID = options.ENTER_MENDIAN;
        } 
    //转发的数据都在这里，   这时候的scene已经被app.unlunch使用了。   
    ///我们这里只需要把参数解析一下？放全局，等跳到首页的时候再做跳转
    // console.log("这个传进来的参数", options.ENTER_MENDIAN_OFF_PAY)
    let ENTER_MENDIAN_OFF_PAY = options.ENTER_MENDIAN_OFF_PAY;
        if (!!ENTER_MENDIAN_OFF_PAY) {
          console.log("ENTER_MENDIAN_OFF_PAY" + ENTER_MENDIAN_OFF_PAY)
          wx.reLaunch({
            // new_pay_offline/index
            url: '/pages/new_pay_offline/index?id=' + ENTER_MENDIAN_OFF_PAY,
          })
          return;
        } 
   else if (app.setting && options.pageName && app.shareParam && app.shareParam.pageName) {
      setTimeout(function(){
        wx.reLaunch({
          url: '/pageTab/' + app.miniIndexPage + '/index',
     
        })
      },100)
      

    }else{
      this.Countdown(app);
    }
    
  },

  onReady: function () {
    
  },

  onShow: function () {
    if (app.appHide) {
      console.log("=======app.onLaunchOptions==========", app.onLaunchOptions)
     
      app.appHide = false
      app.onLaunch(app.onLaunchOptions)
      this.onReady()
    }

  },
  count:8,
  Countdown:function(){
    let that = this
    --this.count;
    console.log('-------获取 setting 中--------')
    if (app.setting ) {
      // console.log("测试有走到这里index页面111行")
      clearTimeout(timer11)
      that.toIndex()
      return false;
    }
    if (this.count < 1) {
      app.echoErr('获取setting数据失败')
      this.setData({
        showLoadFail: true,
        showLoading: false
      })
      this.setNav()     
      clearTimeout(timer11)
      return false;
    }
    else {
      timer11 = setTimeout(function () {
        that.Countdown();
      }, 1000);
    }
  }

})

//定时器
/*  function Countdown(page) {
   console.log('2')
   if (!!page.setting){
     //setTimeout(function () {  }, 200)
     page.toIndex()
   }
   else{
     timer = setTimeout(function () {
       Countdown(page);
     }, 1000);
   }
}; */