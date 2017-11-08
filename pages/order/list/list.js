var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allStatus:true,  //全部
    dzfStatus:false,  //待支付
    dfhStatus:false,  //待发货
    dshStatus:false,  //待收货
    syzStatus:false,  //使用中
    yqzStatus:false,   //逾期中
    allCls:'span-item-active',
    dzfCls: 'span-item',
    dfhCls: 'span-item',
    dshCls: 'span-item',
    syzCls: 'span-item',
    yqzCls: 'span-item',
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
        if (self.data.orderlist.length == 0) {
          list = res.data.orderlist;
        } else {
          //时间格式处理
          var alist = res.data.orderlist;
          list = self.data.orderlist.concat(alist);
        }

        self.setData({
          imageRootPath: res.data.imageRootPath,
          orderlist: list,
          loading: false  //隐藏加载
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
        dfhStatus: false,  //待发货
        dshStatus: false,  //待收货
        syzStatus: false,  //使用中
        yqzStatus: false,   //逾期中
        allCls: 'span-item-active',
        dzfCls: 'span-item',
        dfhCls: 'span-item',
        dshCls: 'span-item',
        syzCls: 'span-item',
        yqzCls: 'span-item'
      });
      self.data.status = 0;
    } else if (idx == 2) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: true,  //待支付
        dfhStatus: false,  //待发货
        dshStatus: false,  //待收货
        syzStatus: false,  //使用中
        yqzStatus: false,   //逾期中
        allCls: 'span-item',
        dzfCls: 'span-item-active',
        dfhCls: 'span-item',
        dshCls: 'span-item',
        syzCls: 'span-item',
        yqzCls: 'span-item'
      });
      self.data.status = 1;
    } else if (idx == 3) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dfhStatus: true,  //待发货
        dshStatus: false,  //待收货
        syzStatus: false,  //使用中
        yqzStatus: false,   //逾期中
        allCls: 'span-item',
        dzfCls: 'span-item',
        dfhCls: 'span-item-active',
        dshCls: 'span-item',
        syzCls: 'span-item',
        yqzCls: 'span-item'
      });
      self.data.status = 2;
    } else if (idx == 4) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dfhStatus: false,  //待发货
        dshStatus: true,  //待收货
        syzStatus: false,  //使用中
        yqzStatus: false,   //逾期中
        allCls: 'span-item',
        dzfCls: 'span-item',
        dfhCls: 'span-item',
        dshCls: 'span-item-active',
        syzCls: 'span-item',
        yqzCls: 'span-item'
      });
      self.data.status = 3;
    } else if (idx == 5) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dfhStatus: false,  //待发货
        dshStatus: false,  //待收货
        syzStatus: true,  //使用中
        yqzStatus: false,   //逾期中
        allCls: 'span-item',
        dzfCls: 'span-item',
        dfhCls: 'span-item',
        dshCls: 'span-item',
        syzCls: 'span-item-active',
        yqzCls: 'span-item'
      });
    } else if (idx == 6) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dfhStatus: false,  //待发货
        dshStatus: false,  //待收货
        syzStatus: false,  //使用中
        yqzStatus: true,   //逾期中
        allCls: 'span-item',
        dzfCls: 'span-item',
        dfhCls: 'span-item',
        dshCls: 'span-item',
        syzCls: 'span-item',
        yqzCls: 'span-item-active'
      });
    }
    self.setData({
      page: 1,
      loading: true,
      orderlist:[],
      loading: true,
      noData: false,
    });
    self.getOrder();
  },

  //滚动分页
  onReachBottom: function () {
    //可以分页
    if (this.data.loading){
      var page = this.data.page + 1;
      if (this.data.allStatus) {
        self.data.status = 0;
      } else if (this.data.dzfStatus) {
        self.data.status = 1;
      } else if (this.data.dfhStatus) {
        self.data.status = 2;
      } else if (this.data.dshStatus) {
        self.data.status = 3;
      } 
      this.setData({
        page: page,
        loading: true
      });
      this.getOrder();
    }
  },

  //订单详情
  orderDetail:function(){
    var id = event.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../detail/detail?id=' + id
    })
  }
})