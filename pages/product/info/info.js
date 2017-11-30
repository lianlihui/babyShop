var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalSpecShow:false,
    id: 0, //产品id
    warebean: null, //产品详情
    suggestwarelist:[], //猜您喜欢商品 
    imageRootPath:'',
    waresizelist:[],  //规格
    imgUrls:[],
    modalSpecIndex:0,
    specKucun:0,
    specPrice:0,
    specRentCost:0,
    waresizes: '',   //购买规格id
    numbers:1,   //购买数量
    rentdates:1,    //租用月数
    isCart:0,   //加入购物车弹框
    cartNums:0,
    hotList: [],
    newList: [],
    list: [],
    curComment: 'hot'
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
  },

  onShow: function() {
    if (!app.globalData.token) {
      app.getToken();
    } 
    this.getInfoData();
    this.getCartNums();
  },

  //获取原来购物车数据
  getCartNums:function(){
    var self = this;
    var postData = {
      token: app.globalData.token
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mrentlist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          if (res.data.mrentlist != null && res.data.mrentlist.length > 0) {
            self.setData({
              cartNums: res.data.mrentlist.length
            });
          }
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //获取产品详情信息
  getInfoData: function() {
    var self = this;
    var postData = {
      id: self.data.id
    };   
    app.ajax({
      url: app.globalData.serviceUrl + 'mWareDetail.html',
      data: postData,
      method: 'GET',
      successCallback: function(res) {
        if(res.code==0&&res.data!=null){
          self.setData({
            imageRootPath: res.data.imageRootPath,
            warebean: res.data.warebean,
            waresizelist: res.data.waresizelist,
            suggestwarelist:res.data.suggestwarelist,
            specPrice: res.data.warebean.price,
            specRentCost: res.data.warebean.rent_cost,
            hotList: res.data.warepingjiazr,
            newList: res.data.warepingjiazx,
            list: res.data.warepingjiazr
          });
          //设置第一个规格库存显示
          if (res.data.waresizelist!=null){
            self.setData({
              specKucun: res.data.waresizelist[0].kuncun,
              waresizes: res.data.waresizelist[0].id
            });
          }
          //详情文本处理
          var descript = res.data.warebean.descript;
          WxParse.wxParse('descript', 'html', descript, self, 5);

          var pro=res.data.warebean;
          var picItem={};
          var picList=[];
          if (pro.pic1 != null && pro.pic1!=''){
            picItem.url = pro.pic1;
            picList.push(picItem);
            picItem = {};
          } 
          if (pro.pic2 != null && pro.pic2 != '') {
            picItem.url = pro.pic2;
            picList.push(picItem);
            picItem = {};
          } 
          if (pro.pic3 != null && pro.pic3 != '') {
            picItem.url = pro.pic3;
            picList.push(picItem);
            picItem = {};
          } 
          if (pro.pic4 != null && pro.pic4 != '') {
            picItem.url = pro.pic4;
            picList.push(picItem);
            picItem = {};
          } 
          if (pro.pic5 != null && pro.pic5 != '') {
            picItem.url = pro.pic5;
            picList.push(picItem);
          }
          self.setData({
            imgUrls:picList
          });
        }
      },
      failCallback: function(res) {
        console.log(res);
      }
    });
  },

  //弹框选择规格
  openModal: function () {
    this.setData({
      modalSpecShow: true,
      isCart: 0
    });
  },

  //关闭弹框
  closeModal: function () {
    console.log('oo');
    this.setData({
      modalSpecShow: false,
      isCart: 0
    });
  },

  //租用月数输入
  bindRentdatesChange: function (e) {
    this.setData({
      rentdates: e.detail.value
    });
  },

  //评价切换
  commentFun: function (e) {
    var self = this;
    var curComment = e.currentTarget.dataset.status;
    var list = self.data.hotList;

    if (curComment == 'new') {
      list = self.data.newList;
    }

    this.setData({
      curComment: curComment,
      list: list
    });
  },

  //添加租用月数
  addRentdates:function(){
    var self=this;
    var rentdates = self.data.rentdates;
    if (/^[0-9]+$/.test(rentdates)) {
      rentdates = Number(rentdates);
      rentdates = rentdates+1;
      self.setData({
        rentdates: rentdates
      });
    } else {
      self.showMsg('请输入正确的租用月数');
      return false;
    }
  },
  //减少租用月数
  reduceRentdates: function () {
    var self = this;
    var rentdates = self.data.rentdates;
    if (/^[0-9]+$/.test(rentdates)) {
      rentdates = Number(rentdates);
      rentdates = rentdates>1?rentdates - 1:1;
      self.setData({
        rentdates: rentdates
      });
    } else {
      self.showMsg('请输入正确的租用月数');
      return false;
    }
  },

  //数量输入
  bindNumberChange: function (e) {
    this.setData({
      numbers: e.detail.value
    });
  },
  //添加数量
  addNumber: function () {
    var self = this;
    var numbers = self.data.numbers;
    var specKucun = self.data.specKucun;
    if (/^[0-9]+$/.test(numbers)) {
      numbers = Number(numbers);
      specKucun = Number(specKucun);
      if (numbers + 1 < specKucun){
        numbers = numbers + 1;
      }else{
        numbers = specKucun;
      }
      self.setData({
        numbers: numbers
      });
    } else {
      self.showMsg('请输入正确的数量');
      return false;
    }
  },
  //减少数量
  reduceNumber: function () {
    var self = this;
    var numbers = self.data.numbers;
    if (/^[0-9]+$/.test(numbers)) {
      numbers = Number(numbers);
      numbers = numbers > 1 ? numbers - 1 : 1;
      self.setData({
        numbers: numbers
      });
    } else {
      self.showMsg('请输入正确的数量');
      return false;
    }
  },

  //加入购物车弹框
  addCartModal:function(){
    this.setData({
      modalSpecShow: true,
      isCart: 1
    });
  },

  //提交订单
  confirmModal: function (e, modalName) {
    var self=this;
    //租用月数
    var rentdates = self.data.rentdates;  
    if (/^[0-9]+$/.test(rentdates) && rentdates != 0) {
      rentdates = Number(rentdates)
    } else {
      self.showMsg('请输入正确的租用月数');
      return false;
    }

    //租赁数量
    var numbers = self.data.numbers;
    if (/^[0-9]+$/.test(numbers) && numbers != 0) {
      numbers = Number(numbers)
    } else {
      self.showMsg('请输入正确的数量');
      return false;
    }
    var specKucun = self.data.specKucun;
    if (numbers > specKucun){
      self.showMsg('数量不能大于库存');
      return false;
    }

    var wareids = self.data.id;  //商品id
    var waresizes = self.data.waresizes;  //规格id
    self.setData({
      modalSpecShow: false
    });

    if (self.data.isCart==1){
      //加入购物车
      var postData = {
        token: app.globalData.token,
        wareid: wareids,
        rent_date: rentdates,
        sizeid: waresizes,
        number: numbers
      };
      app.ajax({
        url: app.globalData.serviceUrl + 'mrentadd.htm',
        data: postData,
        method: 'GET',
        successCallback: function (res) {
          console.log(res);
          if (res.code == 0) {
            // console.log('res:'+res);
            // wx.switchTab({
            //   url: '/pages/cart/cart'
            // })
            var cartNums = self.data.cartNums+1;
            self.setData({
              cartNums: cartNums
            });
          }
        }
      })
    }else{
      //跳转到订单提交页面
      wx.redirectTo({
        url: '/pages/order/confirm/confirm?wareids=' + wareids + '&numbers=' + numbers + '&waresizes=' + waresizes + '&rentdates=' + rentdates
      })
    }
  },

  //跳转到购物车
  gotoCart:function(e){
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },

  //选择规则
  selectSpec: function (e) {
    var data = e.target.dataset;
    this.setData({
      modalSpecIndex: data.index,
      specKucun: data.kuncun,
      waresizes: data.id
    });
  },

  //商品详情
  productInfo: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/product/info/info?id=' + id
    })
  },

  showMsg: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  //分享
  onShareAppMessage: function () {
    var id = this.data.id;
    return {
      title: '母婴',
      desc: '母婴描述!',
      path: '/pages/product/info/info?id=' + id
    }
  }
})