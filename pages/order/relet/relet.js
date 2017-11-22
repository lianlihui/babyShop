var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageRootPath: '',
    warelist: [],
    selectAllStatus:false,
    updIdx:-1,   //修改序号
    updRentdates:0,
    totalMoney:0 , //总金额
    remarks:'',  //备注
    isPoint:0,  //是否选择积分抵扣
    userPoint:0   //用户积分
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var self = this;
    var warenumbers = options.warenumbers;
    var rentdates = options.rentdates;
    console.log(options);
    self.getWareInfo(warenumbers, rentdates);
  },

  //获取商品信息
  getWareInfo: function (warenumbers, rentdates){
    var self = this;
    var postData = {
      token: app.globalData.token,
      warenumbers: warenumbers,
      rentdates: rentdates
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mxuzhuorderaffirm.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0 && res.data.warelist != null) {
          var retList = [];
          for (var i = 0; i < res.data.warelist.length; i++) {
            var singleObj = res.data.warelist[i];
            singleObj.selected = self.data.selectAllStatus;;
            retList.push(singleObj);
          }
          self.setData({
            userPoint: res.data.point,  //用户积分
            imageRootPath: res.data.imageRootPath,
            warelist: retList,
            totalMoney: res.data.totalmoney
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //单选事件
  selectList: function (e) {
    var index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    var warelist = this.data.warelist;                    // 获取购物车列表
    var selected = warelist[index].selected;         // 获取当前商品的选中状态
    warelist[index].selected = !selected;              // 改变状态
    this.setData({
      warelist: warelist
    });

    //判断是否全选
    var selectAllStatus = true;
    for (var i = 0; i < warelist.length; i++) {
      if (!warelist[i].selected) {
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
    var warelist = this.data.warelist;

    for (var i = 0; i < warelist.length; i++) {
      warelist[i].selected = selectAllStatus;            // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      warelist: warelist
    });
  },

  //续租月数输入
  bindRentdatesChange: function (e) {
    this.setData({
      updRentdates: e.detail.value
    });
  },

  //单一编辑
  editNums:function(e){
    var index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    var warelist = this.data.warelist;                    // 获取购物车列表
    var rent_date = warelist[index].rent_date;         // 获取当前商品的数量
    this.setData({
      modalSpecShow: true,
      updIdx: index,
      updRentdates: rent_date
    });
  },

  //单一编辑
  editAllNums: function (e) {
    var self = this;
    var warelist = self.data.warelist;
    var selNums = 0;
    for (var i = 0; i < warelist.length; i++) {
      if (warelist[i].selected) {
        selNums = selNums + 1;
      }
    }
    if (selNums == 0) {
      self.showMsg('至少选择一个修改');
      return false;
    }
    self.setData({
      modalSpecShow: true,
      updIdx: -1,
      updRentdates: 1
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
    if (idx==-1){
      //选择修改
      for (var i = 0; i < warelist.length; i++) {
        if (warelist[i].selected){
          warelist[i].rent_date = updRentdates;
        }
      }
    }else{
      //单个修改
      warelist[idx].rent_date = updRentdates;
    }
    
    var warenumbers = '';
    var rentdates = '';
    for (var i = 0; i < warelist.length;i++){
      warenumbers = warenumbers+warelist[i].warenumber+',';
      rentdates = rentdates + warelist[i].rent_date + ',';
    }
    warenumbers = warenumbers != '' ? warenumbers.substring(0, warenumbers.length-1):'';
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
  createOrder:function(e){
    var self = this;
    var warenumbers='';
    var rentdates='';
    var point=0;
    var remarks='';

    var warelist = self.data.warelist;
    for (var i = 0; i < warelist.length; i++) {
      warenumbers = warenumbers + warelist[i].warenumber + ',';
      rentdates = rentdates + warelist[i].rent_date + ',';
    }
    warenumbers = warenumbers != '' ? warenumbers.substring(0, warenumbers.length - 1) : '';
    rentdates = rentdates != '' ? rentdates.substring(0, rentdates.length - 1) : '';
    if (self.data.isPoint == 1) {
      point = self.data.userPoint;
    }
    remarks = self.data.remarks;
    console.log('warenumbers:' + warenumbers + ';rentdates:' + rentdates + ';point:' + point + ';remarks:' + remarks);

    var postData = {
      token: app.globalData.token,
      warenumbers: warenumbers,
      rentdates: rentdates,
      point: point,
      remarks: remarks
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mxuzhuordersub.htm',
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

  showMsg: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    });
  }
})