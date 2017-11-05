var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalSpecShow:false,
    id: 0, //产品id
    warebean: null //产品详情
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
  },

  onShow: function() {
    this.getInfoData();
  },

  //获取产品详情信息
  getInfoData: function() {
    var self = this;
    var postData = {
      wareid: self.data.id
    };
    
    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'mWareDetail.html',
      data: postData,
      method: 'GET',
      successCallback: function(res) {
        self.setData({
          // imgUrls: res.data.poslinklist,
          imageRootPath: res.imageRootPath,
          warebean: res.warebean
        });
      },
      failCallback: function(res) {
        console.log(res);
      }
    });
  },

  openModal: function () {
    this.setData({
      modalSpecShow: true
    });
  },

  closeModal: function (e, modalName) {
    this.setData({
      modalSpecShow: false
    });
  },
})