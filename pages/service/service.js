var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    sysaddress:'',
    sysemail: '',
    sysqq: '',
    sysphone: '',
    sywx:''
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
            sysphone: res.data.sysphone,
            sywx: res.data.sywx
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
  },

  //复制
  copywxno: function (event) {
    var self = this;
    var wxno = event.currentTarget.dataset.wxno;
    console.log("wxno:" + wxno);
    wx.setClipboardData({
      data: wxno,
      success: function (res) {
        self.showMsg('复制成功');
      },
      fail: function (res) {
        self.showMsg('复制失败');
      }
    })
  },

  showMsg: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    });
  }
})