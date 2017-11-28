var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageRootPath: '',
    warelist: [],
    warenumbers: '',
    address: null,
    transpotion_number: '', //物流单号
    remarks: '', //备注
    sys_rename:'',
    sys_phone:'',
    sys_address: '',
    return_total_money: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var self = this;
    var warenumbers = options.warenumbers;
    self.setData({
      warenumbers: warenumbers
    });
    var self = this;
    var postData = {
      token: app.globalData.token,
      warenumbers: warenumbers
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'tuihuoorderaffirm.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0 && res.data.warelist != null) {
          self.setData({
            imageRootPath: res.data.imageRootPath,
            warelist: res.data.warelist,
            address: res.data.address,
            sys_rename: res.data.sys_rename,
            sys_phone: res.data.sys_phone,
            sys_address: res.data.sys_address,
            return_total_money: res.data.return_total_money
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //备注信息输入
  bindRemarksChange: function (e) {
    this.setData({
      remarks: e.detail.value
    });
  },

  //物流单号
  bindTranspotionNumberChange: function (e) {
    this.setData({
      transpotion_number: e.detail.value
    });
  },

  //添加收货地址
  addAddress: function () {
    var self = this;
    var params = 'warenumbers=' + self.data.warenumbers + '&source=return';
    wx.redirectTo({
      url: '/pages/address/edit/edit?id=-1&' + params
    })
  },

  //提交订单
  createOrder: function (e) {
    console.log(111111);
    var self = this;
    var warenumbers = '';
    var addressid = '';
    var transpotion_number = 0;
    var remarks = '';

    if (self.data.address == null) {
      self.showMsg('请先填写寄货地址');
      return false;
    }

    var warelist = self.data.warelist;
    for (var i = 0; i < warelist.length; i++) {
      warenumbers = warenumbers + warelist[i].warenumber + ',';
    }
    warenumbers = warenumbers != '' ? warenumbers.substring(0, warenumbers.length - 1) : '';
    remarks = self.data.remarks;
    transpotion_number = self.data.transpotion_number;
    addressid = self.data.address.id;
    console.log('warenumbers:' + warenumbers + ';addressid:' + addressid + ';transpotion_number:' + transpotion_number + ';remarks:' + remarks);

    var postData = {
      token: app.globalData.token,
      warenumbers: warenumbers,
      addressid: addressid,
      transpotion_number: transpotion_number,
      remarks: remarks
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mtuihuoordersub.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        self.showMsg(res.msg);
        if (res.code == 0) {
          wx.redirectTo({ url: "/pages/rent/rent" });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //关闭弹框
  closeModal: function () {
    this.setData({
      modalSpecShow: false
    });
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