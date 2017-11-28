var app = getApp();

Page({

  data: {
    'imageRootPath': '',
    'list': [],
    'page':1,
    'hide': 'hide'
  },

  onShow: function() {
    this.getIndexData();
  },

  getIndexData: function() {
    var self = this;
    var postData = {
      token: app.globalData.token
    };

    app.ajax({
      url: app.globalData.serviceUrl + 'mpingjialist.htm',
      data: postData,
      method: 'POST',
      successCallback: function(res) {
        console.log(res);
        if(res.code == 0) {
          var isShow = res.data.mpingjialist.length > 0 ? 'hide' : 'show';
          self.setData({
            imageRootPath: res.data.imageRootPath,
            list: res.data.mpingjialist,
            hide: isShow
          });
        }
      },
      failCallback: function(res) {
      }
    });
  }
});