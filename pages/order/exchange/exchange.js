var app = getApp();

Page({

  /**
   * 页面的初始数据 
   */
  data: {
    imageRootPath: '',
    warelist: [],
    warenumbers:'',
    address: null,
    transpotion_number:'', //物流单号
    remarks:'', //备注
    sys_rename: '',
    sys_phone: '',
    sys_address: '',
    otype: 0,  //物流类型 0一键预约物流 1自己预约物流
    addressbean: null,  //地址
    addressid:''
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      return false;
    }
    var self = this;
    if (typeof (options.raddressId) != "undefined") {
      self.setData({
        addressid: options.raddressId
      });
    }

    var warenumbers = options.warenumbers;
    self.setData({
      warenumbers: warenumbers
    });
    var postData = {
      token: app.globalData.token,
      warenumbers: warenumbers,
      addressid: self.data.addressid
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'huanhuoorderaffirm.htm',
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
            addressbean: res.data.address  //地址
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
  bindTranspotionNumberChange: function(e) {
    this.setData({
      transpotion_number: e.detail.value
    });
  },

  //添加收货地址
  addAddress: function () {
    var self = this;
    var params = 'warenumbers=' + self.data.warenumbers + '&source=exchange';
    wx.redirectTo({
      url: '/pages/address/edit/edit?id=-1&' + params
    })
  },

  //修改地址
  updateAddress: function () {
    var self = this;
    var addressid = self.data.addressbean.id;
    console.log(addressid);
    var params = 'warenumbers=' + self.data.warenumbers 
      + '&source=exchange&select=true&curid=' + addressid;
    wx.redirectTo({
      url: '/pages/address/list/list?' + params
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
    addressid=self.data.address.id;

    var type = self.data.otype;
    var fhtime = self.getCurrentDate();
    console.log('warenumbers:' + warenumbers + ';addressid:' + addressid + ';transpotion_number:' + transpotion_number + ';type:' + type + ';fhtime:' + fhtime);

    var postData = {
      token: app.globalData.token,
      warenumbers: warenumbers,
      addressid: addressid,
      transpotion_number: transpotion_number,
      remarks: remarks,
      type: type,
      fhtime: fhtime
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mhuanhuoordersub.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        self.showMsg(res.msg);
        if (res.code==0){
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

  //物流类型切换
  wlClick: function (event){
    var otype = event.currentTarget.dataset.otype;
    this.setData({
      otype: otype,
      transpotion_number:''
    });
  },

  showMsg: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  getCurrentDate:function(){
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var hours=date.getHours();
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    var minutes = date.getMinutes();
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    var seconds = date.getSeconds();
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + hours + seperator2 + minutes
      + seperator2 + seconds;
    return currentdate;
  }
})