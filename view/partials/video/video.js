const app = getApp();
var part_urls = {};
var videoPage;
var pageArr = new Array()
import qqVideo from "../../../public/qqVideo.js"
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
    host:{}
  },
  ready: function () {
    var that = this;
    console.log('=====readyvideo====', this.data.data)
    let url = this.data.data.jsonData.source;
    if (url.indexOf('https://v.qq.com/')!=-1){
      console.log('====1====')
     url = url.match(/https:\/\/v.qq.com\/x\/(\S*).html/)[1]
     console.log('url===', url)
     let urlArray = url.split('/')
     console.log('urlArray===', urlArray)
     this.setData({ vid: urlArray[urlArray.length - 1] })
      // 处理视频
      if (this.data.vid != undefined) {
        this.setData({
          file_id: this.data.vid
        });
      } else {
        wx.showToast({
          title: '未传入视频id',
        })
      }
      videoPage = 1;
      pageArr = new Array();
      part_urls = {};
      const vid = this.data.vid;
      console.log(vid);
      qqVideo.getVideoes(vid).then(function (response) {

        for (var i = 1; i < response.length + 1; i++) {
          var indexStr = 'index' + (i)
          pageArr.push(i);
          part_urls[indexStr] = response[i - 1];
        }
        that.setData({
          videUrl: response[0],
        });
        console.log('====videUrl====', that.data.videUrl)

      });
    } else {
      console.log('====2====')
      that.setData({
        videUrl: url,
      });
   }
  },
  methods: {
    // 这里是一个自定义方法

    tolinkUrl: function (event) {
      console.log(event.currentTarget.dataset.link)
      app.linkEvent(event.currentTarget.dataset.link);


      // wx.navigateTo({
      //   url: '/pages/' + event.currentTarget.dataset.page + '/index'
      // })
    },
    // playEnd: function () {
    //   console.log('====playEnd====')
    //   //页面渲染完成
    //   that.videoContext = wx.createVideoContext('myVideo')
    //   if (videoPage > parseInt(pageArr.length)) {
    //     // part_urls = {};
    //     videoPage = 1;
    //     this.videoContext.exitFullScreen
    //   } else {
    //     videoPage++;
    //     var index = 'index' + videoPage;
    //     this.setData({
    //       videUrl: ''
    //     });
    //     this.setData({
    //       videUrl: part_urls[index]
    //     });
    //     console.log('videUrl', this.data.videUrl)
    //   }
    // },
   
  },
})