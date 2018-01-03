var app = getApp();

Page({

  data: {
    'imageRootPath': '',
    'list': [],
    isEmpty: '',   //是否显示空
    isShow: 'hide' //是否显示数据 
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
        if (res.code==0&&res.data!=null){
          self.setData({
            imageRootPath: res.data.imageRootPath,
            list: res.data.orderlist,
            isShow: res.data.orderlist.length > 0 ? '' : 'hide',
            isEmpty: res.data.orderlist.length > 0 ? '' : 'show',
          });
        }
        self.setData({
          isShow: res.data.orderlist.length < 0 ? '' : 'hide',
          isEmpty: res.data.orderlist.length < 0 ? '' : 'show',
        });
      },
      failCallback: function (res) {
      }
    });
  },

  //跳转到首页
  gotoIndex: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
});