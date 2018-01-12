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
    isShow: 'show', //是否显示数据 

    isZyzbtnStatus:false,  //显示租用中操作按钮
    selectAllStatus:false,  //租用中全选状态
    operIdx: 1,
    modalOperShow: false,
    modalSpecShow: false,
    rentlist:[],

    modalWlShow:false,
    wlorderno:'',
    wlnoArr:[]
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
        ywcStatus: false,  //已完成
        yqxStatus: true,   //已取消
        allCls: 'span-item',
        dzfCls: 'span-item',
        dshCls: 'span-item',
        ywcCls: 'span-item',
        yqxCls: 'span-item-active',
      });
      self.data.status = 7;
    } else if (idx == 5) {
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
    }
    if (idx!=4){
      //不等于4时，加载订单数据
      self.setData({
        isZyzbtnStatus: false,
        page: 1,
        orderlist: [],
        loading: true,
        noData: false,
        isEmpty: '',   //是否显示空
        isShow: 'show' //是否显示数据 
      });
      self.getOrder();
    }else{
      //等于4时，加载租用中数据
      self.setData({
        operIdx: 1,
        modalOperShow: false,
        modalSpecShow: false,
        rentlist: [],
        isZyzbtnStatus: true,  //显示租用中操作按钮
        selectAllStatus: false,  //租用中全选状态
        loading:false    //不用分页
      });
      self.getRentList();
    }
    
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
  },

  /**租用中代码管理 start**/
  //获取租用中数据
  getRentList: function () {
    var self = this;
    var postData = {
      token: app.globalData.token
    };

    app.ajax({
      url: app.globalData.serviceUrl + 'mhavewarelist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        var retList = [];

        if (res.data.mrentlist.length > 0) {
          for (var i = 0; i < res.data.mrentlist.length; i++) {
            var singleObj = res.data.mrentlist[i];
            if (singleObj.status == 1) {
              singleObj.selected = false;
            }
            retList.push(singleObj);
          }

          self.setData({
            imageRootPath: res.data.imageRootPath,
            rentlist: retList,
            isShow: retList.length > 0 ? '' : 'hide',
            isEmpty: retList.length > 0 ? '' : 'show',
            isZyzbtnStatus: retList.length > 0 ? true : false,
          });
        } else {
          self.setData({
            isShow: 'hide',
            isEmpty: 'show',
            isZyzbtnStatus:false
          });
        }
      },
      failCallback: function (res) {
        self.setData({
          isShow: 'hide',
          isEmpty: 'show',
          isZyzbtnStatus:false
        });
      }
    });
  },

  //单选事件
  selectList: function (e) {
    var index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    var rentlist = this.data.rentlist;                    // 获取购物车列表
    var selected = rentlist[index].selected;         // 获取当前商品的选中状态
    rentlist[index].selected = !selected;              // 改变状态
    this.setData({
      rentlist: rentlist
    });

    //判断是否全选
    var selectAllStatus = true;
    for (var i = 0; i < rentlist.length; i++) {
      if (rentlist[i].status == 1 && !rentlist[i].selected) {
        selectAllStatus = false;
        break;
      }
    }
    this.setData({
      selectAllStatus: selectAllStatus
    });
  },

  //全选事件
  selectAll: function (e) {
    var selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    var rentlist = this.data.rentlist;

    for (var i = 0; i < rentlist.length; i++) {
      if (rentlist[i].status == 1) {
        rentlist[i].selected = selectAllStatus;            // 改变所有商品状态
      }
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      rentlist: rentlist
    });
  },

  //选择操作类型
  operClick: function (event) {
    var self = this;
    var idx = event.currentTarget.dataset.idx;
    self.setData({
      operIdx: idx
    });
  },

  //确定操作
  operClickImpl: function () {
    var self = this;
    var operIdx = self.data.operIdx;
    if (operIdx == 1) {
      //租转买
      var rentlist = self.data.rentlist;
      var haveid = '';
      var selNums = 0;
      for (var i = 0; i < rentlist.length; i++) {
        if (rentlist[i].status == 1 && rentlist[i].selected) {
          haveid = rentlist[i].id;
          selNums = selNums + 1;
        }
      }
      if (selNums != 1) {
        self.showMsg('只能选择一个操作');
        return false;
      }
      console.log('haveid:' + haveid);

      self.setData({
        modalOperShow: false
      });
      //跳转到租转买提交页面
      wx.navigateTo({
        url: '/pages/order/rentbuy/rentbuy?haveid=' + haveid
      })
    } else if (operIdx == 2) {
      //续租
      self.setData({
        modalOperShow: false,
        modalSpecShow: true,
        updRentdates: 1
      });
    } else if (operIdx == 3) {
      //退还
      var rentlist = self.data.rentlist;
      var selIds = '';
      for (var i = 0; i < rentlist.length; i++) {
        if (rentlist[i].status == 1 && rentlist[i].selected) {
          selIds = selIds + rentlist[i].warenumber + ',';
        }
      }
      selIds = selIds.substring(0, selIds.length - 1);
      console.log('selIds:' + selIds);
      self.setData({
        modalOperShow: false
      });
      //跳转到续租提交页面 
      wx.navigateTo({
        url: '/pages/order/return/return?warenumbers=' + selIds
      })
    } else if (operIdx == 4) {
      //换货
      var rentlist = self.data.rentlist;
      var selIds = '';
      for (var i = 0; i < rentlist.length; i++) {
        if (rentlist[i].status == 1 && rentlist[i].selected) {
          selIds = selIds + rentlist[i].warenumber + ',';
        }
      }
      selIds = selIds.substring(0, selIds.length - 1);
      console.log('selIds:' + selIds);
      self.setData({
        modalOperShow: false
      });
      //跳转到续租提交页面 
      wx.navigateTo({
        url: '/pages/order/exchange/exchange?warenumbers=' + selIds
      })
    }
  },

  //操作弹框
  czClick: function () {
    var self = this;
    var rentlist = self.data.rentlist;
    var selNums = 0;
    for (var i = 0; i < rentlist.length; i++) {
      if (rentlist[i].status == 1 && rentlist[i].selected) {
        selNums = selNums + 1;
      }
    }
    if (selNums == 0) {
      self.showMsg('至少选择一个操作');
      return false;
    }
    this.setData({
      operIdx: 1,
      modalOperShow: true
    });
  },

  //关闭操作弹框
  closeOperModal: function () {
    this.setData({
      modalOperShow: false
    });
  },

  //关闭弹框
  closeModal: function () {
    this.setData({
      modalSpecShow: false
    });
  },

  //续租月数输入
  bindRentdatesChange: function (e) {
    this.setData({
      updRentdates: e.detail.value
    });
  },

  //添加数量
  addNumber: function () {
    var self = this;
    var updRentdates = self.data.updRentdates;
    if (/^[0-9]+$/.test(updRentdates)) {
      updRentdates = Number(updRentdates);
      updRentdates = updRentdates + 1;
      self.setData({
        updRentdates: updRentdates
      });
    } else {
      self.showMsg('请输入正确的续租月数');
      return false;
    }
  },
  //减少数量
  reduceNumber: function () {
    var self = this;
    var updRentdates = self.data.updRentdates;
    if (/^[0-9]+$/.test(updRentdates)) {
      updRentdates = Number(updRentdates);
      updRentdates = updRentdates > 1 ? updRentdates - 1 : 1;
      self.setData({
        updRentdates: updRentdates
      });
    } else {
      self.showMsg('请输入正确的续租月数');
      return false;
    }
  },

  //续租事件
  xzClick: function (e) {
    //获取勾选项
    var self = this;
    var rentlist = self.data.rentlist;
    var selNums = 0;
    for (var i = 0; i < rentlist.length; i++) {
      if (rentlist[i].status == 1 && rentlist[i].selected) {
        selNums = selNums + 1;
      }
    }
    if (selNums == 0) {
      self.showMsg('至少选择一个续租');
      return false;
    }
    self.setData({
      modalSpecShow: true,
      updRentdates: 1
    });
  },

  //续租确定事件
  xzClickImp: function (e) {
    var self = this;
    //租赁数量
    var updRentdates = self.data.updRentdates;
    if (/^[0-9]+$/.test(updRentdates) && updRentdates != 0) {
      updRentdates = Number(updRentdates)
    } else {
      self.showMsg('请输入正确的续租月数');
      return false;
    }

    var selIds = '';
    var rentlist = self.data.rentlist;
    var updRentdateStr = '';
    for (var i = 0; i < rentlist.length; i++) {
      if (rentlist[i].status == 1 && rentlist[i].selected) {
        selIds = selIds + rentlist[i].warenumber + ',';
        updRentdateStr = updRentdateStr + updRentdates + ',';
      }
    }
    selIds = selIds.substring(0, selIds.length - 1);
    updRentdateStr = updRentdateStr.substring(0, updRentdateStr.length - 1);

    console.log('selIds:' + selIds + ';updRentdateStr:' + updRentdateStr);
    self.setData({
      modalSpecShow: false
    });
    //跳转到续租提交页面 
    wx.navigateTo({
      url: '/pages/order/relet/relet?warenumbers=' + selIds + '&rentdates=' + updRentdateStr
    })
  },

  //退还事件
  thClick: function (e) {
    //获取勾选项
    var self = this;
    var rentlist = self.data.rentlist;
    var selNums = 0;
    var selIds = '';
    for (var i = 0; i < rentlist.length; i++) {
      if (rentlist[i].status == 1 && rentlist[i].selected) {
        selNums = selNums + 1;
        selIds = selIds + rentlist[i].warenumber + ',';
      }
    }
    if (selNums == 0) {
      self.showMsg('至少选择一个退还');
      return false;
    }
    selIds = selIds.substring(0, selIds.length - 1);

    console.log('selIds:' + selIds);
    self.setData({
      modalSpecShow: false
    });
    //跳转到续租提交页面 
    wx.navigateTo({
      url: '/pages/order/return/return?warenumbers=' + selIds
    })
  },

  //换货事件
  hhClick: function (e) {
    //获取勾选项
    var self = this;
    var rentlist = self.data.rentlist;
    var selNums = 0;
    var selIds = '';
    for (var i = 0; i < rentlist.length; i++) {
      if (rentlist[i].status == 1 && rentlist[i].selected) {
        selNums = selNums + 1;
        selIds = selIds + rentlist[i].warenumber + ',';
      }
    }
    if (selNums == 0) {
      self.showMsg('至少选择一个换货');
      return false;
    }
    selIds = selIds.substring(0, selIds.length - 1);

    console.log('selIds:' + selIds);
    self.setData({
      modalSpecShow: false
    });
    //跳转到续租提交页面 
    wx.navigateTo({
      url: '/pages/order/exchange/exchange?warenumbers=' + selIds
    })
  },

  //评价
  pjOrder: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/comment/edit/edit?id=' + id
    })
  },

  //商品详情
  productInfo: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/info/info?id=' + id
    })
  },

  /**租用中代码管理 end**/

  /**查看物流信息 start */
  //查看物流
  lookLogistics: function (event) {
    var num = event.currentTarget.dataset.num;
    var orderno = event.currentTarget.dataset.orderno;
    console.log('orderno:' + orderno + ';num=' + num);
    var wlnoArr=[];
    if (num != null && num!=''){
      wlnoArr=num.split(',');
    }
    this.setData({
      modalWlShow: true,
      wlorderno: orderno,
      wlnoArr: wlnoArr
    });
  },

  //复制
  copywxno: function (event){
    var self=this;
    var wxno = event.currentTarget.dataset.wxno;
    console.log("wxno:" + wxno);
    wx.setClipboardData({
      data: wxno,
      success: function (res) {
        self.showMsg('复制成功');
      },
      fail:function(res){
        self.showMsg('复制失败');
      }
    })
  },

  closeWlModal:function(){
    this.setData({
      modalWlShow: false
    });
  },
  /**查看物流信息 end */
})