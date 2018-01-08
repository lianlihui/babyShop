var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    provinces: [],
    cities: [],
    counties: [],
    province: 0,
    city: 0,
    county: 0,
    selAreaVal: '',   //区域选中的值
    address: '请点击选择送货区域',
    bcShow: true,   //显示保存按钮
    ddShow: false,   //显示删除按钮
    isShow: false, // 显示区域选择框
    showDistrict: true, // 默认为省市区三级区域选择
    ordername: '',  //收货人姓名
    mobile: '',  //手机号码
    detailaddress: '', //详细地址
    isdefault: 0,  //是否默认

    areaArray: [[], [], []],  //地址信息，三维数据，省，市，区
    areaIndex: [0, 0, 0],
    readySelArea:0,

    source:'',   //跳转来源，有可能是订单提交页面跳转而来
    wareids:'',
    waresizes:'',
    rentdates:0,
    numbers:0,
    warenumbers:'',
    colors: '',
    rtype: 1
  },
  //选择地址确定事件
  bindMultiPickerChange: function (e) {
    var self = this;
    var current_value = e.detail.value;
    console.log(current_value);
    //地址选中确定，拼装地址信息显示
    var address = self.data.areaArray[0][current_value[0]].name
      + (self.data.areaArray[1].length > 0 ? '/' +self.data.areaArray[1][current_value[1]].name:'')
      + (self.data.areaArray[2].length > 0 ? '/' +self.data.areaArray[2][current_value[2]].name:'');
    self.setData({
      areaIndex: current_value,
      address: address,
      readySelArea:1
    });
  },

  //选择地址切换事件，比如选择省重新加载地市，选择地市重新加载区域
  bindMultiPickerColumnChange: function (e) {
    var self = this;

    var col = e.detail.column;
    var val = e.detail.value;
    //重新加载地市
    if (col == 0) {
      var code = self.data.areaArray[0][val].code;
      self.getCityByProvinceCode(code);
    }
    //重新加载区域
    if (col == 1) {
      var code = self.data.areaArray[1][val].code;
      self.getCountiesByCityCode(code);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.token) {
     // wx.redirectTo({ url: "/pages/login/login" });
      return false;
    }

    var self = this;
    var ddShow = true;

    //页面加载先获取省份信息
    self.getProvince();
    if (options.id == -1) {
      ddShow = false;
    }

    if (options.source=='confirm'){
      //判断是否为订单提交页面过来，地址不允许删除 
      ddShow = false; 
      self.setData({
        source:options.source,
        wareids: options.wareids,
        numbers: options.numbers,
        waresizes: options.waresizes,
        rentdates: options.rentdates,
        colors: options.colors,
        rtype: options.rtype
      });
    } else if (options.source == 'exchange' || options.source == 'return') {
      //判断是否为换货提交页面过来，地址不允许删除 
      ddShow = false;
      self.setData({
        source: options.source,
        warenumbers: options.warenumbers
      });
    }

    self.setData({
      id: options.id,
      ddShow: ddShow,
      isSelect: !!options.select
    });

    if (options.id != -1) {
      var id = options.id;
      //获取地址数据
      var postData = {
        token: app.globalData.token,
        id: id
      };
      app.ajax({
        url: app.globalData.serviceUrl + 'maddressdetail.htm',
        data: postData,
        method: 'GET',
        successCallback: function (res) {
          if (res.code == 0) {
            var obj = res.data.addressbean;
            var address = obj.province +
              (obj.city == '' ? '' : '/' +obj.city)+
              (obj.area == '' ? '' : '/' +obj.area);

            self.getAreaByName(obj.province, obj.city, obj.area);

            self.setData({
              ordername: obj.ordername,
              mobile: obj.mobile,
              detailaddress: obj.detailaddress,
              isdefault: obj.isdefault,
              address: address,
              readySelArea:1
            });
          }
        },
        failCallback: function (res) {
          console.log(res);
        }
      });
    }
  },

  //获取省份
  getProvince: function () {
    var provinces = new Array();
    var thisPage = this;
    wx.request({
      url: app.globalData.serviceUrl + 'getProvince.html',
      data: {},
      method: 'GET',
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          provinces = data.data.provincelist;

          var areaArray = thisPage.data.areaArray;
          areaArray[0] = provinces;
          thisPage.setData({
            areaArray: areaArray
          });

          //根据第一个省份获取地市
          if (thisPage.data.id == -1) {
            thisPage.getCityByProvinceCode(provinces[0].code);
          }
        }

      },
      fail: function () {
        console.log('init district information failed');
      }
    })
  },
  //获取地市
  getCityByProvinceCode: function (code) {
    var thisPage = this;
    var cities = new Array();
    wx.request({
      url: app.globalData.serviceUrl + 'getArea.html',
      data: { 'code': code },
      method: 'GET',
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          cities = data.data.list;
          var areaArray = thisPage.data.areaArray;
          areaArray[1] = cities;
          if (cities.length>0){
              //根据第一个地市获取区
              thisPage.getCountiesByCityCode(cities[0].code);
          }else{
            areaArray[2] = [];
          }
          thisPage.setData({
            areaArray: areaArray
          });
        }
      },
      fail: function () {
        console.log('init district information failed');
      }
    })
  },
  //获取区
  getCountiesByCityCode: function (code) {
    var thisPage = this;
    var counties = new Array();
    wx.request({
      url: app.globalData.serviceUrl + 'getArea.html',
      data: { 'code': code },
      method: 'GET',
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          counties = data.data.list;
          var areaArray = thisPage.data.areaArray;
          areaArray[2] = counties;
          thisPage.setData({
            areaArray: areaArray
          });
        }
      },
      fail: function () {
        console.log('init district information failed');
      }
    })
  },

  //默认地址切换
  defaultChange: function () {
    if (this.data.isdefault == 0) {
      this.setData({
        isdefault: 1
      });
    } else {
      this.setData({
        isdefault: 0
      });
    }
  },

  //表单提交
  formSubmit: function (e) {
    var self = this;
    var formData = e.detail.value;

    if (!formData.ordername) {
      self.showMsg('请输入收货人');
      return false;
    }

    if (!/^1[34578]\d{9}$/.test(formData.mobile)) {
      self.showMsg('请输入正确的手机号码');
      return false;
    }
    if (self.data.readySelArea==0){
      self.showMsg('请点击选择送货区域');
      return false;
    } 
    if (!formData.detailaddress) {
      self.showMsg('请输入详细地址');
      return false;
    }
    if (formData.detailaddress.length < 5 || formData.detailaddress.length>120) {
      self.showMsg('详细地址长度只能为5-120个');
      return false;
    }

    formData.isdefault = self.data.isdefault;
    var cv = self.data.areaIndex;

    formData.province = '';
    var arr0 = self.data.areaArray[0];
    if (arr0.length != 0) {
      formData.province = arr0[cv[0]].name;
    }

    formData.city = '';
    var arr1 = self.data.areaArray[1];
    if (arr1.length != 0) {
      formData.city = arr1[cv[1]].name;
    }

    formData.area = '';
    var arr2 = self.data.areaArray[2];
    if (arr2.length != 0) {
      formData.area = arr2[cv[2]].name;
    }
    self.saveOrUpdate(formData);
  },

  saveOrUpdate: function (postData) {
    var self = this;
    postData.token = app.globalData.token;
    var url = app.globalData.serviceUrl + 'maddressadd.htm';
    if (this.data.id != -1) {
      url = app.globalData.serviceUrl + 'maddressupdate.htm';
      postData.id = this.data.id;
    }
    //添加地址   
    app.ajax({
      url: url,
      data: postData,
      method: 'POST',
      successCallback: function (res) {
        if (res.code == 0) {
          var addressId = res.data.id;
          //跳回订单提交页面
          if (self.data.source == 'confirm') {  
            wx.redirectTo({
              url: '/pages/order/confirm/confirm?wareids=' + self.data.wareids + '&numbers=' + self.data.numbers + '&waresizes=' + self.data.waresizes + '&rentdates=' + self.data.rentdates + '&colors=' + self.data.colors
               + '&rtype=' + self.data.rtype  + '&raddressId=' + addressId
            })
          } else if (self.data.source == 'exchange') {
            wx.redirectTo({
              url: '/pages/order/exchange/exchange?warenumbers=' + self.data.warenumbers + '&raddressId=' + addressId
            })
          } else if (self.data.source == 'return') {
            wx.redirectTo({
              url: '/pages/order/return/return?warenumbers=' + self.data.warenumbers + '&raddressId=' + addressId
            })
          }else {
            wx.redirectTo({
              url: '../list/list' + (self.data.isSelect ? '?select=1' : '')
            })
          }
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //删除地址
  deleteAddress: function () {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确定删除该地址？',
      success: function (res) {
        if (res.confirm) {
          var id = self.data.id;
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
                wx.redirectTo({
                  url: '../list/list'
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

  //弹框提示
  showMsg: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '关闭'
    })
  },

  //修改时初始化地址信息
  getAreaByName: function (provinceName, cityName, countyName) {
    var thisPage = this;
    var areaIndex = thisPage.data.areaIndex;
    wx.request({
      url: app.globalData.serviceUrl + 'getProvince.html',
      data: {},
      method: 'GET',
      success: function (res) {
        var data = res.data;
        var provinces = data.data.provincelist;
        for (var i = 0; i < provinces.length; i++) {
          if (provinceName == provinces[i].name) {
            areaIndex[0] = i;
            break;
          }
        }

        if (cityName!=''){
          wx.request({
            url: app.globalData.serviceUrl + 'getArea.html',
            data: { 'code': provinces[areaIndex[0]].code },
            method: 'GET',
            success: function (res) {
              var data = res.data;
              var cities = data.data.list;
              for (var ii = 0; ii < cities.length; ii++) {
                if (cityName == cities[ii].name) {
                  areaIndex[1] = ii;
                  break;
                }
              }
              //设置地市信息
              var areaArray = thisPage.data.areaArray;
              areaArray[1] = cities;
              thisPage.setData({
                areaArray: areaArray
              });
              if (countyName != '') {
                wx.request({
                  url: app.globalData.serviceUrl + 'getArea.html',
                  data: { 'code': cities[areaIndex[1]].code },
                  method: 'GET',
                  success: function (res) {
                    var data = res.data;
                    var counties = data.data.list;
                    for (var iii = 0; iii < counties.length; iii++) {
                      if (countyName == counties[iii].name) {
                        areaIndex[2] = iii;
                        break;
                      }
                    }
                    //设置区域信息
                    var areaArray = thisPage.data.areaArray;
                    areaArray[2] = counties;
                    thisPage.setData({
                      areaArray: areaArray
                    });
                  }
                });
              }
            }
          });
        }

        thisPage.setData({
          areaIndex: areaIndex
        });
      },
      fail: function () {
        console.log('init district information failed');
      }
    })
  },
})