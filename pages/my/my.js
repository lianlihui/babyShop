var app = getApp();

Page({
  data: {
    myInfo: null
  },

  onLoad: function (options) {
    // if (!app.globalData.token) {
    //   wx.redirectTo({ url: "/pages/login/login" });
    //   return false;
    // } 
    this.getMyData();
  },

  getMyData: function() {
    var self = this;
    app.ajax({
      url: app.globalData.serviceUrl + 'muser.htm',
      data: { token: app.globalData.token},
      method: 'POST',
      successCallback: function(res) {
        console.log(res);
        if(res.code == 0) {
          self.setData({
            myInfo: res.data.userbean
          });
        }
      },
      failCallback: function(res) {
      }
    });
  },

  //积分明细
  gotoScore:function(){
    wx.redirectTo({ url: "/pages/scroce/scroce"});
  },

  //我的订单
  gotoMyOrder:function(){
    wx.redirectTo({ url: "/pages/order/list/list" });
  },

  //我的地址
  gotoMyAddress:function(){
    wx.redirectTo({ url: "/pages/address/list/list" });
  },

  //我的租用
  gotoMyRent:function(){
    wx.redirectTo({ url: "/pages/rent/rent" });
  },

  //常见问题
  gotoQuestion:function() {
    wx.redirectTo({ url: "/pages/question/list/list" });
  },

});