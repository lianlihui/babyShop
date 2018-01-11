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
      },
      failCallback: function (res) {
      }
    });
  },

  //商品详情
  productInfo: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/info/info?id=' + id
    })
  },

  //跳转到首页
  gotoIndex: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  //删除
  deleteCollection: function (event){
    var self = this;
    var cid = event.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '确定删除该收藏？',
      success: function (res) {
        if (res.confirm) {
          var postData = {
            token: app.globalData.token,
            cid: cid
          };
          app.ajax({
            url: app.globalData.serviceUrl + 'mcollectdel.htm',
            data: postData,
            method: 'GET',
            successCallback: function (res) {
              if (res.code == 0) {
                self.getIndexData();
              } else {
                self.showMsg(res.msg);
              }
            }
          })
        }
      }
    })
  },

  showMsg: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});