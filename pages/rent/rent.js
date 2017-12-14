var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageRootPath: '',
    rentlist: [],
    selectAllStatus:false,
    modalSpecShow: false,
    modalOperShow: false,
    updRentdates:1,  //续租月数

    operIdx:1  //操作类型
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var self = this;
    self.getRent();
  },

  getRent: function () {
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
        if (res.data.mrentlist != null && res.data.mrentlist.length > 0) {
          for (var i = 0; i < res.data.mrentlist.length; i++) {
            var singleObj = res.data.mrentlist[i];
            if (singleObj.status==1){
              singleObj.selected = false;
            }
            retList.push(singleObj);
          }
        }
        self.setData({
          imageRootPath: res.data.imageRootPath,
          rentlist: retList
        });
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //单选事件
  selectList:function(e){
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
      if (rentlist[i].status==1&&!rentlist[i].selected) {
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
      if (rentlist[i].status==1){
        rentlist[i].selected = selectAllStatus;            // 改变所有商品状态
      }
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      rentlist: rentlist
    });
  },

  //选择操作类型
  operClick: function (event){
    var self = this;
    var idx = event.currentTarget.dataset.idx;
    self.setData({
      operIdx: idx
    });
  },

  //确定操作
  operClickImpl:function(){
    var self = this;
    var operIdx = self.data.operIdx;
    if (operIdx==1){
      //租转买
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
  czClick:function(){
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
      operIdx:1,
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
  xzClick:function(e){
    //获取勾选项
    var self = this;
    var rentlist = self.data.rentlist;
    var selNums = 0;
    for (var i = 0; i < rentlist.length; i++) {
      if (rentlist[i].status==1&&rentlist[i].selected) {
        selNums = selNums + 1;
      }
    }
    if (selNums == 0) {
      self.showMsg('至少选择一个续租');
      return false;
    }
    self.setData({
      modalSpecShow: true,
      updRentdates:1
    });
  },

  //续租确定事件
  xzClickImp:function(e){
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
        updRentdateStr = updRentdateStr+updRentdates+',';
      }
    }
    selIds = selIds.substring(0, selIds.length-1);
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
    var selIds='';
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

  showMsg: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    });
  }
})