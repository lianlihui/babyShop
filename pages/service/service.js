var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    sysaddress:'',
    sysemail: '',
    sysqq: '',
    sysphone: ''
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
   
  },

  onShow: function () {
    this.getData();
  },

  //获取数据
  getData: function () {
    var self = this;
    var postData = {
      token: app.globalData.token
    };

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'mcontact.html',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          self.setData({
            sysaddress: res.data.sysaddress,
            sysemail: res.data.sysemail,
            sysqq: res.data.sysqq,
            sysphone: res.data.sysphone
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  phone: function (event){
    var sysphone = event.currentTarget.dataset.sysphone;
    console.log(sysphone);
    wx.makePhoneCall({
      phoneNumber: sysphone
    })
  }
})