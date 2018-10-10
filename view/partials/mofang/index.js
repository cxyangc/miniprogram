const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    data: {
      type: JSON,
    },
  },
  data: {
    // 这里是一些组件内部数据
   

  },
  ready:function(){
    console.log('=====ready====', this.data.data)
    this.setData({ items: this.data.data.jsonData.items })
    this.setData({ width: this.data.data.jsonData.width })
    this.setData({ height: this.data.data.jsonData.height })
    this.setData({ imagePadding: this.data.data.jsonData.imagePadding })
    console.log('=====items====', this.data.items)
  },
  methods: {
    tolinkUrl: function (e) {
      let linkUrl = e.currentTarget.dataset.link
      app.linkEvent(linkUrl)
    }
  }
})