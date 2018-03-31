
const app = getApp() 
Page({
 
  data: {
    List:{
      tab:[],
      listData:[]
    },
    showTabIndex: 0,
  },

  arr1:[],

  // 点击Tab切换
  bindTab:function (e) {
    var index = e.currentTarget.dataset.id

    this.setData({
      showTabIndex: index
    })
  },
  loadTab: function () {
    //加载tab项
    let tab = [
      {
        title: '进行中',
        linkUrl: '',
        page:1,
        pageSize:0,
        curPage:0,
        totalSize:0,
      },
      {
        title: '活动预告',
        linkUrl: '',
        page: 1,
        pageSize: 0,
        curPage: 0,
        totalSize: 0,
      },
      {
        title: '过期活动',
        linkUrl: '',
        page: 1,
        pageSize: 0,
        curPage: 0,
        totalSize: 0,
      }
    ]
    let List = this.data.List
    List.tab = tab
    for (let i = 0; i < tab.length;i++){
      List.listData.push([])
    }
    this.setData({
      List: List
    })

    let listData = this.loadListData() //加载tab项对应列表数据
  },
  loadListData: function () {
    //加载tab项对应列表数据
    this.getData(0)
    this.getData(1)
    this.getData(2)
    let listData = []
    return listData
  },
  // 加载全部数据并且暴露渲染
  loadList:function (e) {
    let tab = this.loadTab() //加载tab项
    
  },

  getData: function (tabi) {
    let that = this
    let getParam = {}
    getParam.couponState = tabi
    getParam.page = that.data.List.tab[tabi].page
    let customIndex = app.AddClientUrl("/get_my_coupons_list.html", getParam, 'get')
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        if(res.data.result ){
          let List = that.data.List
          //tab数据变化
          List.tab[tabi].pageSize = res.data.pageSize;
          List.tab[tabi].curPage = res.data.curPage;
          List.tab[tabi].totalSize = res.data.totalSize;
          if(res.data.result.length == 0){
             console.log('nothing')
             
          }else{
            let result = res.data.result

            List.listData[tabi] = List.listData[tabi].concat(result)
            that.setData({ List: List })
          }
          
         
        }else{
          console.log('error')
          that.getData(tabi)
        }
        
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },
  

  /* 组件事件集合 */
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },

  optParam: {}, // option数据 用来转发和刷新
  onLoad: function (options) {
    this.optParam = options
   // this.getData(0)
    if (options.index){
      this.setData({
        showTabIndex: options.index
      })
    }
    this.loadList()
  },

  onReady: function () {
    this.setData({
      setting: app.setting,
      loginUser: app.loginUser,
      sysWidth: app.globalData.sysWidth,
      sysHeight: app.globalData.sysHeight,
    });
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

  

  onPullDownRefresh: function () {
    
    this.data.List = {
      tab: [],
      listData: []
    }
    this.onLoad()

    wx.stopPullDownRefresh() 
  },

  scrollTopToReflesh:function(){

  },
  scrollBottomToLoadMore:function(){
    console.log(this.data.List)
    let List = this.data.List
    let tabIndex = this.data.showTabIndex
    console.log(List.tab[tabIndex].page)
    
    
    if (List.tab[tabIndex].totalSize > List.tab[tabIndex].curPage * List.tab[tabIndex].pageSize) {
      ++List.tab[tabIndex].page;
      this.getData(tabIndex);
    }
  },
})