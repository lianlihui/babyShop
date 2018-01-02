var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    isSelect: false,
    className: '', // 是否出现选框
    curid: 0, // 当前选中的id
    source: '',   //跳转来源，有可能是订单提交页面跳转而来
    wareids: '',
    waresizes: '',
    rentdates: 0,
    numbers: 0,
    colors:'',
    rtype:1,
    warenumbers:''
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
    console.log(options);
    if (options.source == 'confirm') {
      //判断是否为订单提交页面过来
      this.setData({
        source: options.source,
        wareids: options.wareids,
        numbers: options.numbers,
        waresizes: options.waresizes,
        rentdates: options.rentdates,
        colors: options.colors,
        rtype: options.rtype,

        isSelect: options.select,
        className: options.select ? 'show' : '',
        curid: options.curid || 0
      });
    } else if (options.source == 'exchange' || options.source == 'return'){
      //判断是否为我的出租换货提交页面过来
      this.setData({
        source: options.source,
        warenumbers: options.warenumbers,

        isSelect: options.select,
        className: options.select ? 'show' : '',
        curid: options.curid || 0
      });
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
          var yList=[];
          var setList = [];
          if (retList != null && retList.length > 0) {
            for (var i = 0; i < retList.length; i++) {
              var item = retList[i];
              item.xmobile = item.mobile.substring(0, 3) + '*****'
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
    var self = this;
    if (self.data.source == 'confirm') {
      var params = 'wareids=' + self.data.wareids + '&numbers=' + self.data.numbers
        + '&waresizes=' + self.data.waresizes + '&rentdates=' + self.data.rentdates 
        + '&colors=' + self.data.colors + '&rtype=' + self.data.rtype 
        + '&source=confirm';
      wx.redirectTo({
        url: '/pages/address/edit/edit?id='+id+'&' + params
      })
    } else if (self.data.source == 'exchange' || self.data.source == 'return') {
      var params = 'warenumbers=' + self.data.warenumbers + '&source=' + self.data.source;
      wx.redirectTo({
        url: '/pages/address/edit/edit?id=' + id + '&' + params
      })
    } else {
      wx.redirectTo({
        url: '../edit/edit?id=' + id
      })
    }
  },

  //设置为默认
  setAddress: function (event){
    var self = this;
    var obj = event.currentTarget.dataset.obj;
    delete obj.xmobile;
    var postData=obj;
    postData.token = app.globalData.token;
    var url = app.globalData.serviceUrl + 'maddressupdate.htm';
    postData.isdefault = obj.isdefault==0?1:0;
    //添加地址   
    app.ajax({
      url: url,
      data: postData,
      method: 'POST',
      successCallback: function (res) {
        if (res.code == 0) {
          self.getListInfo();
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //添加地址信息
  addAddress: function (event) {
    var self = this;
    if (self.data.source == 'confirm') {
      var params = 'wareids=' + self.data.wareids + '&numbers=' + self.data.numbers
        + '&waresizes=' + self.data.waresizes + '&rentdates=' + self.data.rentdates 
        + '&colors=' + self.data.colors + '&rtype=' + self.data.rtype 
        + '&source=confirm';
      wx.redirectTo({
        url: '/pages/address/edit/edit?id=-1&' + params
      })
    } else if (self.data.source == 'exchange' || self.data.source == 'return') {
      var params = 'warenumbers=' + self.data.warenumbers + '&source=' + self.data.source;
      wx.redirectTo({
        url: '/pages/address/edit/edit?id=-1&' + params
      })
    }else{
      wx.redirectTo({
        url: '/pages/address/edit/edit?id=-1'
      })
    }
  },

  // 选择收货地址
  selectAddr: function (event) {
    var self = this;
    console.log(self.data.isSelect);
    console.log(self.data.source);
    if (self.data.isSelect) {
      var id = event.currentTarget.dataset.id;
      if (self.data.source == 'confirm') {
        wx.redirectTo({
          url: '/pages/order/confirm/confirm?wareids=' + self.data.wareids + '&numbers=' + self.data.numbers + '&waresizes=' + self.data.waresizes + '&rentdates=' + self.data.rentdates + '&colors=' + self.data.colors + '&rtype=' + self.data.rtype + '&raddressId=' + id
        })
      } else if (self.data.source == 'exchange') {
        wx.redirectTo({
          url: '/pages/order/exchange/exchange?warenumbers=' + self.data.warenumbers + '&raddressId=' + id
        })
      } else if (self.data.source == 'return') {
        wx.redirectTo({
          url: '/pages/order/return/return?warenumbers=' + self.data.warenumbers + '&raddressId=' + id
        })
      }
    }
  },

  //删除地址
  deleteAddress: function (event) {
    var self = this;
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    
    wx.showModal({
      title: '提示',
      content: '确定删除该地址？',
      success: function (res) {
        if (res.confirm) {
          var postData = {
            token: app.globalData.token,
            id: id
          };
          app.ajax({
            url: app.globalData.serviceUrl + 'maddressdel.htm',
            data: postData,
            method: 'POST',
            successCallback: function (res) {
              if (res.code == 0) {
                var addresslistCopy = self.data.addressList;
                addresslistCopy.splice(index, 1);
                self.setData({
                  addressList: addresslistCopy
                });
                // wx.redirectTo({
                //   url: '../list/list'
                // });
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
})