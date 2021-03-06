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
    productList: []
  },
     ready:function(){
       // 主色调
       console.log('pro============',this.data.data)
       console.log(JSON.stringify(app.setting.platformSetting.defaultColor), this.data.data);
       console.log(JSON.stringify(app.setting.platformSetting.secondColor));
       this.setData({
         defaultColor: app.setting.platformSetting.defaultColor,
         secondColor: app.setting.platformSetting.secondColor
       })
       if (this.data.data.relateBean&&this.data.data.relateBean.length!=0){
         this.data.productList = this.data.data.relateBean;
         let tagArray=[];
         for (let i = 0; i < this.data.data.relateBean.length; i++) {
           if (this.data.data.relateBean[i].tags && this.data.data.relateBean[i].tags != '') {
             tagArray = this.data.data.relateBean[i].tags.slice(1, -1).split("][")
             this.data.data.relateBean[i].tagArray = tagArray;
           }
         }
         this.setData({ data: this.data.data})
         console.log(' === this.data.data===', this.data.data)
       }
  },
  methods: {
    // 这里是一个自定义方法

    tolinkUrl: function (e) {
      console.log(e.currentTarget.dataset.id)
      // product_detail.html?productId= 9219;
      var a = "product_detail.html?productId=" + e.currentTarget.dataset.id; 
      app.linkEvent(a);
    }
  },
})