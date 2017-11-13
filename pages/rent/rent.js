var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    noData: false,
    imageRootPath: '',
    page: 1,
    rentlist: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var self = this;
    self.getRent();
  },

  getRent: function () {
    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      console.log("no login");
      return false;
    }

    var self = this;
    var postData = {
      token: app.globalData.token,
      page: self.data.page
    };

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'mhavewarelist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        var list = [];
        if (res.code != 0 || res.data == null) {
          self.setData({
            noData: true,  //显示已经没有数据
            loading: false  //滚动不用再触发
          });
          return false;
        }
        console.log(list);
        if (self.data.rentlist.length == 0) {
          list = res.data.mrentlist;
        } else {
          //时间格式处理
          var alist = res.data.mrentlist;
          list = self.data.rentlist.concat(alist);
        }
        console.log(list);
        self.setData({
          imageRootPath: res.data.imageRootPath,
          rentlist: list
        });

        if (res.data.mrentlist.length < 10) {
          self.setData({
            noData: true,  //显示已经没有数据
            loading: false  //滚动不用再触发
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //滚动分页
  onReachBottom: function () {
    console.log('loading:' + this.data.loading);
    //可以分页
    if (this.data.loading) {
      var page = this.data.page + 1;
      this.setData({
        page: page,
        loading: true
      });
      this.getRent();
    }
  }
})