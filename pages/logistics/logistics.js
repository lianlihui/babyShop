// index.js
//获取应用实例
var app = getApp();

Page({
  data: {
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
        console.log(res);
      },
      failCallback: function(res) {
        console.log(res);
      }
    });

  }
  
})