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
    loading:true,
    noData:false,
    imageRootPath:'',
    page:1,
    status:0,
    orderlist:[]
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
      wx.redirectTo({ url: "/pages/login/login" });
      console.log("no login");
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

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'morderlist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        var list = [];
        if (res.code != 0 || res.data==null) {
          self.setData({
            noData: true,  //显示已经没有数据
            loading: false  //滚动不用再触发
          });
          return false;
        }
        console.log(list);
        if (self.data.orderlist.length == 0) {
          list = res.data.orderlist;
        } else {
          //时间格式处理
          var alist = res.data.orderlist;
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
      self.data.status = '2,3,5';
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
        this.data.status = 2,3,5;
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
    wx.redirectTo({
       url: '../detail/detail?id=' + id
    })
  },

  //订单支付
  payOrder:function(e){
    var id = e.currentTarget.dataset.id;
    console.log('pay:'+id);
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
  }
})