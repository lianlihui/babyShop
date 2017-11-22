var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guizelist: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var self = this;
    var postData = {
      token: app.globalData.token,
      id:options.id
    };

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'mguizedetail.html',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          var retList = res.data.guizelist;
          self.setData({
            guizelist: retList
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  }
})