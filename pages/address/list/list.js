var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    if (!app.globalData.token) {
      //wx.redirectTo({ url: "/pages/login/login" });
      console.log("no login");
      return false;
    }
  },

  onShow: function () {
    this.getListInfo();
  },

  //获取数据
  getListInfo:function(){
    var self = this;
    var postData = {
      token: app.globalData.token
    };

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'maddresslist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          var retList = res.data.addresslist;
          var setList = [];
          if (retList != null && retList.length > 0) {
            for (var i = 0; i < retList.length; i++) {
              var item = retList[i];
              item.mobile = item.mobile.substring(0, 3) + '*****'
                + item.mobile.substring(8);
              setList.push(item);
            }
          }
          self.setData({
            addressList: setList
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //编辑地址信息
  editAddress: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../edit/edit?id=' + id + (this.data.isSelect ? '&select=1' : '')
    })
  },

  //添加地址信息
  addAddress: function (event) {
    wx.redirectTo({
      url: '/pages/address/edit/edit?id=-1'
    })
  }
})