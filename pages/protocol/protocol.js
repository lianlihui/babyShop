var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '用户须知'
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var self = this;
    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'xieyi.html',
      data: '',
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          self.setData({
            name: res.data.content.name
          });

          var content = res.data.content.content;
          console.log(content);
          WxParse.wxParse('content', 'html', content, self, 5);
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  }
   
})