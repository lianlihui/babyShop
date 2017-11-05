//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    'imageRootPath': '',
    'warelist': []
  },
  onShow: function() {
    // wx.showLoading({title: '页面加载中', mask: true})
    this.getIndexData();
  },

  getIndexData: function() {
    var self = this;
    var postData = {
      waretypeid: ''
    };
    
    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + '/mwarelist.html',
      data: postData,
      method: 'GET',
      successCallback: function(res) {
        self.setData({
          imageRootPath: res.data.imageRootPath,
          warelist: res.data.warelablelist
        });
      },
      failCallback: function(res) {
        console.log(res);
      }
    });

  }

})