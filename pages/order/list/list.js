var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allStatus:true,  //全部
    dzfStatus:false,  //待支付
    dshStatus:false,  //待收货
    ywcStatus:false,  //已完成
    yqxStatus:false,   //已取消
    allCls:'span-item-active',
    dzfCls: 'span-item',
    dshCls: 'span-item',
    ywcCls: 'span-item',
    yqxCls: 'span-item',
    loading: false,
    noData: false,
    imageRootPath:'',
    page:1,
    status:0,
    orderlist:[],

    payTxt: '去支付',  //控制支付状态
    payIng: false,
    isEmpty: '',   //是否显示空
    isShow: 'show' //是否显示数据 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var self=this;
    self.getOrder();
  },

  getOrder:function(){
    if (!app.globalData.token) {
      return false;
    }

    var self = this;
    var postData = {
      token: app.globalData.token,
      page: self.data.page
    };

    if(self.data.status!=0){
      postData.status = self.data.status;
    }

    if (self.data.page > 1) {
      self.setData({
        loading: true
      });
    }

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'morderlist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        var list = [];
        if (res.code != 0 || res.data==null) {
          //第一次请求 判断是否有数据
          if (self.data.page == 1) {
            self.setData({
              isShow: list.length > 0 ? '' : 'hide',
              isEmpty: list.length > 0 ? '' : 'show',
              loading: false  //滚动不用再触发
            });
          }else{
            self.setData({
              noData: true,  //显示已经没有数据
              loading: false  //滚动不用再触发
            });
          }
          return false;
        }
        console.log(list);
        if (self.data.orderlist.length == 0) {
          list = res.data.orderlist;
          //处理状态显示
          for (var i = 0; i < list.length;i++){
            list[i].statusTxt = self.getStatusTxt(list[i].status).split(';')[0];
            list[i].moneyCls = self.getStatusTxt(list[i].status).split(';')[1];
          }
        } else {
          var alist = res.data.orderlist;
          //处理状态显示
          for (var i = 0; i < alist.length; i++) {
            alist[i].statusTxt = self.getStatusTxt(alist[i].status).split(';')[0];
            alist[i].moneyCls = self.getStatusTxt(alist[i].status).split(';')[1];
          }
          list = self.data.orderlist.concat(alist);
        }
        console.log(list);
        self.setData({
          imageRootPath: res.data.imageRootPath,
          orderlist: list
        });

        if (res.data.orderlist.length < 10) {
          self.setData({
            noData: true,  //显示已经没有数据
            loading: false  //滚动不用再触发
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  /**菜单跳转*/
  menuClick: function (e) {
    var self=this;
    var idx = parseInt(e.currentTarget.dataset.idx);
    console.log('idx:' + idx);
    self.unlockPayFun();  //提示去支付，解锁支付状态
    if(idx==1){
      self.setData({
        allStatus: true,  //全部
        dzfStatus: false,  //待支付
        dshStatus: false,  //待收货
        ywcStatus: false,  //已完成
        yqxStatus: false,   //已取消
        allCls: 'span-item-active',
        dzfCls: 'span-item',
        dshCls: 'span-item',
        ywcCls: 'span-item',
        yqxCls: 'span-item',
      });
      self.data.status = 0;
    } else if (idx == 2) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: true,  //待支付
        dshStatus: false,  //待收货
        ywcStatus: false,  //已完成
        yqxStatus: false,   //已取消
        allCls: 'span-item',
        dzfCls: 'span-item-active',
        dshCls: 'span-item',
        ywcCls: 'span-item',
        yqxCls: 'span-item',
      });
      self.data.status = 1;
    } else if (idx == 3) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dshStatus: true,  //待收货
        ywcStatus: false,  //已完成
        yqxStatus: false,   //已取消
        allCls: 'span-item',
        dzfCls: 'span-item',
        dshCls: 'span-item-active',
        ywcCls: 'span-item',
        yqxCls: 'span-item',
      });
      self.data.status = '2';
    } else if (idx == 4) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dshStatus: false,  //待收货
        ywcStatus: true,  //已完成
        yqxStatus: false,   //已取消
        allCls: 'span-item',
        dzfCls: 'span-item',
        dshCls: 'span-item',
        ywcCls: 'span-item-active',
        yqxCls: 'span-item',
      });
      self.data.status = 4;
    } else if (idx == 5) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dshStatus: false,  //待收货
        ywcStatus: false,  //已完成
        yqxStatus: true,   //已取消
        allCls: 'span-item',
        dzfCls: 'span-item',
        dshCls: 'span-item',
        ywcCls: 'span-item',
        yqxCls: 'span-item-active',
      });
      self.data.status = 7;
    }
    self.setData({
      page: 1,
      orderlist:[],
      loading: true,
      noData: false,
      isEmpty: '',   //是否显示空
      isShow: 'show' //是否显示数据 
    });
    self.getOrder();
  },

  //滚动分页
  onReachBottom: function () {
    console.log('loading:' + this.data.loading);
    //可以分页
    if (this.data.loading){
      var page = this.data.page + 1;
      if (this.data.allStatus) {
        this.data.status = 0;
      } else if (this.data.dzfStatus) {
        this.data.status = 1;
      } else if (this.data.dshStatus) {
        this.data.status = 2;
      } else if (this.data.ywcStatus) {
        this.data.status = 4;
      } else if (this.data.yqxStatus) {
        this.data.status = 7;
      } 
      this.setData({
        page: page,
        loading: true
      });
      this.getOrder();
    }
  },

  //订单详情
  orderDetail: function (event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
       url: '../detail/detail?id=' + id
    })
  },

  //查看物流
  lookLogistics: function (event){
    var num = event.currentTarget.dataset.num;
    var orderId = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/logistics/logistics?num=' + num + '&orderId=' + orderId
    })
  },

  //评价
  pjOrder: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/comment/edit/edit?id=' + id
    })
  },

  //提示支付中，锁定支付状态
  lockPayFun: function () {
    var self = this;
    self.setData({
      payTxt: '支付中...',  //控制支付状态
      payIng: true
    });
  },

  //提示去支付，解锁支付状态
  unlockPayFun: function () {
    var self = this;
    self.setData({
      payTxt: '去支付',  //控制支付状态
      payIng: false
    });
  },

  //订单支付
  payOrder:function(e){
    var id = e.currentTarget.dataset.id;
    var self = this;
    //预防多次点击支付
    if (!self.data.payIng) {
      self.lockPayFun();  //提示支付中，锁定支付状态
      var postData = {
        token: app.globalData.token,
        id: id
      }
      var url = app.globalData.serviceUrl + 'morderwxpay.htm'
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
            'success':function(res){
                success({ code: 0 });
            },
            'fail':function(res){
              self.unlockPayFun();  //提示去支付，解锁支付状态
              self.showMsg('支付未完成，请重新支付！');
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
                wx.redirectTo({
                  url: '/pages/order/detail/detail?id=' + id
                })
              }, 1500);
            } else {
              self.unlockPayFun();  //提示去支付，解锁支付状态
              console.error(msg);
            }
          }
        },
        failCallback: function (res) {
          self.unlockPayFun();  //提示去支付，解锁支付状态
          console.log(res);
        }
      })
    }
  },

  //取消订单
  cancelOrder:function(e){
    var id = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单？',
      success: function (res) {
        if (res.confirm) {
          var postData = {
            token: app.globalData.token,
            id: id
          };
          app.ajax({
            url: app.globalData.serviceUrl + 'mordercancel.htm',
            data: postData,
            method: 'POST',
            successCallback: function (res) {
              if (res.code == 0) {
                var orderlist = self.data.orderlist;
                for (var i = 0; i < orderlist.length;i++){
                  if (orderlist[i].id==id){
                    orderlist[i].status=7;
                    orderlist[i].statusTxt = self.getStatusTxt(7).split(';')[0];
                    orderlist[i].moneyCls = self.getStatusTxt(7).split(';')[1];
                    break;
                  }
                }
                self.setData({
                  orderlist: orderlist
                });
              }
            },
            failCallback: function (res) {
              console.log(res);
            }
          });
        }
      }
    })
  },

  //确认收货
  shOrder:function(e){
    var id = e.currentTarget.dataset.id;
    var self = this;
    var postData = {
      token: app.globalData.token,
      id: id
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mordershouhuo.htm',
      data: postData,
      method: 'POST',
      successCallback: function (res) {
        self.showMsg(res.msg);
        if (res.code == 0) {
          var orderlist = self.data.orderlist;
          for (var i = 0; i < orderlist.length; i++) {
            if (orderlist[i].id == id) {
              orderlist[i].status = 4;
              orderlist[i].statusTxt = self.getStatusTxt(4).split(';')[0];
              orderlist[i].moneyCls = self.getStatusTxt(4).split(';')[1];
              break;
            }
          }
          self.setData({
            orderlist: orderlist
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
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

  getStatusTxt:function(status){
    var ret='';
    if (status==1){
      ret = '未支付;money-wzf';
    } else if (status == 2) {
      ret = '待发货;money-bh';
    } else if (status == 3) {
      ret = '配送中;money-bh';
    } else if (status == 4) {
      ret = '交易成功;money-cg';
    } else if (status == 5) {
      ret = '出库中;money-bh';
    } else if (status == 7) {
      ret = '已取消;money-yqx';
    }
    return ret;
  },

  //跳转到首页
  gotoIndex:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})