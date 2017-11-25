// index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    'imgUrls': [],
    'imageRootPath': '',
    'warelist': [],
    'indicatorDots': true,
    'indicatorColor': '#bdaea7',
    'indicatorActiveColor': '#5eaaf9',
    'autoplay': true,
    'interval': 5000,
    'duration': 1000,
    'foodList': []
  },

  onShow: function() {
    if (!app.globalData.token) {
      app.getToken();
    } 
    this.getIndexData();
  },

  getIndexData: function() {
    var self = this;
    var postData = {
      token: ''
    };
    
    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'mindex.html',
      data: postData,
      method: 'GET',
      successCallback: function(res) {
        self.setData({
          imgUrls: res.data.poslinklist,
          imageRootPath: res.data.imageRootPath,
          warelist: res.data.warelist
        });
      },
      failCallback: function(res) {
        console.log(res);
      }
    });

  },

  //商品详情
  productInfo: function (event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/info/info?id=' + id
    })
  },

  //跳转到搜索
  gotoSearch:function(){
    wx.redirectTo({
      url: '/pages/product/search/search?source=index'
    })
  },

  //分享
  onShareAppMessage: function () {
    return {
      title: '母婴',
      desc: '母婴描述!',
      path: '/pages/index/index'
    }
  }

})