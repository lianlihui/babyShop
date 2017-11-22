var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointlist: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
  },

  onShow: function () {
    this.getPointlist();
  },

  //获取数据
  getPointlist: function () {
    var self = this;
    var postData = {
      token: app.globalData.token
    };

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'mypointlist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          var retList = res.data.pointlist;
          self.setData({
            pointlist: retList
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  }
})