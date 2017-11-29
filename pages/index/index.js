// index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    'imgUrls': [],
    'imageRootPath': '',
    'warelabellist':[],
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
          imageRootPath: res.data.imageRootPath
        });
        var warelabellist = res.data.warelabellist;
        var allwarelist=res.data.warelist;
        for (var i = 0; i < warelabellist.length;i++){
          var warelist = allwarelist[i];
          warelabellist[i].warelist = warelist;
        }
        self.setData({
          warelabellist: warelabellist
        });
      },
      failCallback: function(res) {
        console.log(res);
      }
    });

  },

  //tab切换
  productList: function (event) {
    var idx = event.currentTarget.dataset.idx;
    var self=this;
    var allwarelist = self.data.allwarelist;
    self.setData({
      warelist: allwarelist[idx]
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
    wx.navigateTo({
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