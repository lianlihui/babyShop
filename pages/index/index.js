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
  onLoad: function (options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene)
    console.log("scene:" + scene);
    if (scene !='undefined'){//调用接口修改改用户为某实体店用户
      var postData = {
        token: app.globalData.token,
        agentid: scene,
      };
      app.ajax({
        url: app.globalData.serviceUrl + 'mbindagent.htm',
        data: postData,
        method: 'GET',
        successCallback: function (res) {
      //    if (res.code == 0 && res.data != null) {
        //    self.showMsg(res.msg);
        //  } else {
         //   self.showMsg('用户已绑定');
        //  }
        }
      });
    }
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
        console.log(warelabellist);
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

  //更多跳转
  gotoMore: function () {
    wx.switchTab({
      url: '/pages/product/list/list'
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