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
    someData: {}
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