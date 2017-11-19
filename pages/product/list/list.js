//index.js
//获取应用实例 
var app = getApp();

Page({
  data: {
    'imageRootPath': '',
    'warelist': [],
    'page':1,
    'loading': true,
    'noData': false,
  },
  onShow: function() {
    // wx.showLoading({title: '页面加载中', mask: true})
    this.getIndexData();
  },

  getIndexData: function() {
    var self = this;
    var postData = {
      page: self.data.page
    };
    
    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + '/mwarelist.html',
      data: postData,
      method: 'GET',
      successCallback: function(res) {
        var list = [];
        if (res.code != 0 || res.data == null) {
          self.setData({
            noData: true,  //显示已经没有数据
            loading: false  //滚动不用再触发
          });
          return false;
        }
        if (self.data.warelist.length == 0) {
          list = res.data.warelablelist;
        } else {
          var alist = res.data.warelablelist;
          list = self.data.warelist.concat(alist);
        }

        self.setData({
          imageRootPath: res.data.imageRootPath,
          warelist: res.data.warelablelist,
          loading: false  //隐藏加载
        });

        if (res.data.warelablelist.length < 10) {
          self.setData({
            noData: true,  //显示已经没有数据
            loading: false  //滚动不用再触发
          });
        }
      },
      failCallback: function(res) {
        console.log(res);
      }
    });
  },

  //滚动分页
  onReachBottom: function () {
    //可以分页
    if (this.data.loading) {
      var page = this.data.page + 1;
      this.setData({
        page: page,
        loading: true
      });
      this.getIndexData();
    }
  },

  //商品详情
  productInfo: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/info/info?id=' + id
    })
  },

  //跳转到搜索
  gotoSearch: function () {
    wx.redirectTo({
      url: '/pages/product/search/search?source=list'
    })
  }

})