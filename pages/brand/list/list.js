var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageRootPath:'',
    brandlist: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
  },

  onShow: function () {
    this.getBrandlist();
  },

  //获取数据
  getBrandlist: function () {
    var self = this;
    var postData = {
      token: app.globalData.token,
      cateid:1
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
            brandlist: retList
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
    wx.navigateTo({ url: "/pages/brand/detail/detail?id=" + id });
  }
})