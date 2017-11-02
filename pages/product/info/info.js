var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalSpecShow:false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {

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