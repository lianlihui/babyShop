var app = getApp();

Page({

  data: {
    'imageRootPath': '',
    'list': []
  },

  onShow: function () {
    this.getIndexData();
  },

  getIndexData: function () {
    var self = this;
    var postData = {
      token: app.globalData.token
    };

    app.ajax({
      url: app.globalData.serviceUrl + 'mcollectlist.htm',
      data: postData,
      method: 'POST',
      successCallback: function (res) {
        console.log(res);
      },
      failCallback: function (res) {
      }
    });
  }
});