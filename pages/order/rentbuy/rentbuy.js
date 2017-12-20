var app = getApp();

Page({

  /**
   * 页面的初始数据 
   */
  data: {
    imageRootPath: '',
    warelist: [],
    selectAllStatus: false,
    updIdx: -1,   //修改序号
    updRentdates: 0,
    totalMoney: 0, //总金额
    remarks: '',  //备注
    isPoint: 0,  //是否选择积分抵扣
    userPoint: 0,   //用户积分
    haveid:''
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var self = this;
    var haveid = options.haveid;
    self.setData({
      haveid: haveid
    })
    console.log(options);
    self.getWareInfo(haveid);
  },

  //获取商品信息
  getWareInfo: function (haveid) {
    var self = this;
    var postData = {
      token: app.globalData.token,
      haveid: haveid
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mzzmaffirm.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0 && res.data.waredatalist != null) {
          var retList = [];
          self.setData({
            userPoint: res.data.point,  //用户积分
            imageRootPath: res.data.imageRootPath,
            warelist: res.data.waredatalist,
            totalMoney: res.data.totalmoney
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //续租确定事件
  editNumsImp: function (e) {
    var self = this;
    //租赁数量
    var updRentdates = self.data.updRentdates;
    if (/^[0-9]+$/.test(updRentdates) && updRentdates != 0) {
      updRentdates = Number(updRentdates)
    } else {
      self.showMsg('请输入正确的续租月数');
      return false;
    }

    var warelist = self.data.warelist;
    var idx = self.data.updIdx;
    if (idx == -1) {
      //选择修改
      for (var i = 0; i < warelist.length; i++) {
        if (warelist[i].selected) {
          warelist[i].rent_date = updRentdates;
        }
      }
    } else {
      //单个修改
      warelist[idx].rent_date = updRentdates;
    }

    var warenumbers = '';
    var rentdates = '';
    for (var i = 0; i < warelist.length; i++) {
      warenumbers = warenumbers + warelist[i].warenumber + ',';
      rentdates = rentdates + warelist[i].rent_date + ',';
    }
    warenumbers = warenumbers != '' ? warenumbers.substring(0, warenumbers.length - 1) : '';
    rentdates = rentdates != '' ? rentdates.substring(0, rentdates.length - 1) : '';
    //获取id
    console.log('warenumbers:' + warenumbers + ';rentdates:' + rentdates);
    self.setData({
      modalSpecShow: false
    });
    self.getWareInfo(warenumbers, rentdates);
  },

  //备注信息输入
  bindRemarksChange: function (e) {
    this.setData({
      remarks: e.detail.value
    });
  },

  //积分抵扣金额
  pointChange: function (e) {
    if (this.data.isPoint == 0) {
      if (this.data.userPoint == 0) {
        this.showMsg('当前无积分可抵扣');
        return false;
      }
      this.setData({
        isPoint: 1
      });
    } else {
      this.setData({
        isPoint: 0
      });
    }
  },

  //提交订单
  createOrder: function (e) {
    var self = this;
    var haveid = self.data.haveid;
    console.log('haveid:' + haveid);

    var postData = {
      token: app.globalData.token,
      haveid: haveid
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mzzmsub.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          //实现微信支付
          self.payOrder(res.data);
        } else {
          self.showMsg(res.msg);
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //微信支付
  payOrder: function (id) {
    var self = this;
    var postData = {
      token: app.globalData.token,
      id: id
    }
    var url = app.globalData.serviceUrl + 'mzzmorderwxpay.htm'
    wx.showLoading({ title: '正在请求支付', mask: true })
    app.ajax({
      url,
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        wx.hideLoading()

        var timeStamp = res.timeStamp;
        var nonceStr = res.nonceStr;
        var pkg = res.package;
        var signType = 'MD5';
        var paySign = res.paySign;

        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': pkg,
          'signType': 'MD5',
          'paySign': paySign,
          'success': function (res) {
            success({ code: 0 });
          },
          'fail': function (res) {
            self.showMsg('支付未完成，请重新支付！')
          }
        });

        function success(res) {
          const { code, data, msg } = res
          if (code == 0) {
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            })
            setTimeout(function () {
              wx.redirectTo({ url: "/pages/rent/rent" });
            }, 1500);
          } else {
            console.error(msg)
          }
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    })
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