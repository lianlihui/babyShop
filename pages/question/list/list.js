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
  },

  onShow: function () {
    this.getGuizelist();
  },

  //获取数据
  getGuizelist: function () {
    var self = this;
    var postData = {
      token: app.globalData.token
    };

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'mguize.html',
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
  },

  //跳转到详情
  gotoDetail:function(e){
    var index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    var guizelist = this.data.guizelist;                    // 获取购物车列表
    var id = guizelist[index].id;
    console.log('id:'+id);
    wx.redirectTo({ url: "/pages/question/detail/detail?id="+id });
  }
})