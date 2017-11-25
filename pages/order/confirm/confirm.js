var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    source: '',  //下单来源  pro产品详情跳转过来  cart购物车跳转过来
    wareids: '',   //物品ID
    rentids: '',
    numbers: 0,   //	数量
    waresizes: '',  //规格ID
    rentdates: 0,   //租用月数
    addressid:'',  //地址id
    point:0,  //积分
    remarks:'',  //备注
    warelist: [], //产品列表
    imageRootPath:'',
    totalmoney:0,   //订单总额
    freight:0,  //运费
    maxpoint:0,  //最大积分
    userPoint:0,  //用户积分
    isPoint:0,  //是否选择积分抵扣
    addressbean:null  //地址
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    this.setData({
      wareids: options.wareids,
      numbers: options.numbers,
      waresizes: options.waresizes,
      rentdates: options.rentdates,
      rentids: options.rentids
    });
  },

  onShow: function () {
    var self=this;
    self.getConfirmInfo();
  },

  //获取订单提交数据
  getConfirmInfo:function(){
    var self=this;
    var postData = {
      token: app.globalData.token,
      sizeids: self.data.waresizes,
      rentdates: self.data.rentdates,
      numbers: self.data.numbers
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'morderaffirm.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0 && res.data != null) {
          self.setData({
            imageRootPath: res.data.imageRootPath,
            warelist: res.data.warelist,
            totalmoney: res.data.totalmoney,   //订单总额
            freight: res.data.freight,   //运费
            maxpoint: res.data.maxpoint,  //最大积分
            userPoint: res.data.point,  //用户积分
            addressbean: res.data.addressbean  //地址
          });
        }else{
          self.showMsg('下单产品不存在');
        }
      }
    });
  },

  //备注信息输入
  bindRemarksChange:function(e){
    this.setData({
      remarks: e.detail.value
    });
  },

  //积分抵扣金额
  pointChange:function(e){
    if (this.data.isPoint == 0) {
      if (this.data.userPoint==0){
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

  //生成订单
  createOrder:function(){
    var self = this;
    var point=0;
    //使用了积分抵扣
    if (self.data.isPoint==1){
      point = self.data.userPoint > self.data.maxpoint ? self.data.maxpoint : self.data.userPoint;
    }
    if (self.data.addressbean==null){
      self.showMsg('请先填写寄货地址');
      return false;
    }
    var postData = {
      token: app.globalData.token,
      wareids: self.data.wareids,   //物品id
      numbers: self.data.numbers,   //数量
      waresizes: self.data.waresizes,   //规格id
      rentdates: self.data.rentdates,   //租用月数
      addressid: self.data.addressbean.id,    //地址id
      point: point,    //积分
      remarks: self.data.remarks   //备注
    };
    if (self.data.rentids) {
      postData.rentids = self.data.rentids
    }
    app.ajax({
      url: app.globalData.serviceUrl + 'mordersub.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0 && res.data != null) {
          //实现微信支付
          self.payOrder(res.data);
        } else {
          self.showMsg(res.msg);
        }
      }
    });
  },

  //微信支付
  payOrder:function(id){
    var self=this;
    var postData = {
      token: app.globalData.token,
      id
    }
    var url = app.globalData.serviceUrl + 'morderwxpay.htm'
    wx.showLoading({ title: '正在请求支付', mask: true })
    app.ajax({
      url,
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        wx.hideLoading()
        
        //const { timeStamp, nonceStr, package: pkg, signType, paySign } = res;
        var timeStamp = res.data.timestamp;
        var nonceStr = res.data.noncestr;
        var pkg = res.data.prepayid;
        var signType = 'MD5';
        var paySign = res.data.sign;
        wx.requestPayment({
          timeStamp, nonceStr, package: pkg, signType, paySign,
          success(res) {
            success({ code: 0 })
          },
          fail(res) {
            console.log(res)
            self.showMsg('支付未完成，请重新支付！')
          }
        })
        function success(res) {
          const { code, data, msg } = res
          if (code == 0) {
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/order/detail/detail?id=' + id
              })
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

  //添加收货地址
  addAddress:function(){
    var self=this;
    var params = 'wareids=' + self.data.wareids + '&numbers=' + self.data.numbers 
      + '&waresizes=' + self.data.waresizes + '&rentdates=' + self.data.rentdates +'&source=confirm';
    wx.redirectTo({
      url: '/pages/address/edit/edit?id=-1&' + params
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