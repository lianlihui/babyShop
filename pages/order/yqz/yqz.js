var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {

  },

  /**菜单跳转*/
  menuClick: function (e) {
    console.log(e);
    var idx = parseInt(e.currentTarget.dataset.idx);
    console.log('idx:' + idx);

    var url = '';
    switch (idx) {
      case 1: url = '/pages/order/list/list'; break;
      case 2: url = '/pages/order/dzf/dzf'; break;
      case 3: url = '/pages/order/dfh/dfh'; break;
      case 4: url = '/pages/order/dsh/dsh'; break;
      case 5: url = '/pages/order/syz/syz'; break;
      case 6: url = '/pages/order/yqz/yqz'; break;
      default: url = '/pages/order/list/list';
    }
    console.log('url:' + url);
    wx.redirectTo({
      url: url
    })
  }
})