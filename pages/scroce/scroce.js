var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myInfo:null,
    pointlist: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
  },

  onShow: function () {
    this.getMyData();
    this.getPointlist();
  },

  //获取用户数据
  getMyData: function () {
    var self = this;
    app.ajax({
      url: app.globalData.serviceUrl + 'muser.htm',
      data: { token: app.globalData.token },
      method: 'POST',
      successCallback: function (res) {
        if (res.code == 0) {
          self.setData({
            myInfo: res.data.userbean
          });
        }
      },
      failCallback: function (res) {
      }
    });
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