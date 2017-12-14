var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageRootPath: '',
    guidelist: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
  },

  onShow: function () {
    this.getGuidelist();
  },

  //获取数据
  getGuidelist: function () {
    var self = this;
    var postData = {
      token: app.globalData.token,
      cateid: 0
    };

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'arclist.html',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          var retList = res.data.arclist;
          self.setData({
            imageRootPath: res.data.imageRootPath,
            guidelist: retList
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //跳转到详情
  gotoDetail: function (e) {
    var id = e.currentTarget.dataset.id;    // 获取data- 传进来的index
    console.log('id:' + id);
    wx.navigateTo({ url: "/pages/guide/detail/detail?id=" + id });
  }
})