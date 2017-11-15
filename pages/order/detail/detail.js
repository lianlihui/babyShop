var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageRootPath: '',
    order:null
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      return false;
    }

    var self=this;
    var id = options.id;
    var postData = {
      token: app.globalData.token,
      id: id
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'morderdetail.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if(res.code==0 && res.data.orderbean!=null){
          self.setData({
            order: res.data.orderbean,
            imageRootPath: res.data.imageRootPath
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //订单支付
  payOrder: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log('pay:' + id);
  },

  //取消订单
  cancelOrder: function (e) {
    var id = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单？',
      success: function (res) {
        if (res.confirm) {
          var postData = {
            token: app.globalData.token,
            id: id
          };
          app.ajax({
            url: app.globalData.serviceUrl + 'mordercancel.htm',
            data: postData,
            method: 'POST',
            successCallback: function (res) {
              if (res.code == 0) {
                var order = self.data.order;
                order.status = 7;
                self.setData({
                  order: order
                });
              }
            },
            failCallback: function (res) {
              console.log(res);
            }
          });
        }
      }
    })
  },

  //确认收货
  shOrder: function (e) {
    var id = e.currentTarget.dataset.id;
    var self = this;
    var postData = {
      token: app.globalData.token,
      id: id
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mordershouhuo.htm',
      data: postData,
      method: 'POST',
      successCallback: function (res) {
        self.showMsg(res.msg);
        if (res.code == 0) {
          //重新加载数据
          self.setData({
            page: 1,
            orderlist: [],
            loading: true,
            noData: false,
          });
          self.getOrder();
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  showMsg: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    });
  }
})