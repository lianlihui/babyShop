var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arcdetail: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var self = this;
    var postData = {
      token: app.globalData.token,
      id: options.id
    };

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'arcdetail.html',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          var arcdetail = res.data.arcdetail;
          self.setData({
            arcdetail: arcdetail
          });

          var content = arcdetail.content;
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