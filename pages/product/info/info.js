var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');

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
    specSmprice: 0,
    specPrice:0,
    specRentCost:0,
    waresizes: '',   //购买规格id
    numbers:1,   //购买数量
    rentdates:1,    //租用月数
    colors:'',  //购买颜色
    rtype:1,   //购买类型
    isCart:0,   //加入购物车弹框
    cartNums:0,
    hotList: [],
    newList: [],
    list: [],
    curComment: 'proInfo',

    modalTypeIndex: 1,  //类型：2、我要租 1:我要买
    modalColorIndex: 0, //颜色
    colorsArr:[],  //商品详情颜色列表

    zjList:[],  //折旧程度
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
        //初始化折旧程度
        var jzTxts=["全新","九成新","八成新","七成新"];
        var zjList=[];
        for (var i = 0; i < jzTxts.length;i++){
          var sobj={};
          sobj.name = jzTxts[i];
          sobj.cls='qc';
          sobj.obj=null;
          zjList.push(sobj);
        }

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
            list: res.data.warepingjiazx
          });
          //设置购买类型
          var modalTypeIndex = res.data.warebean.type == 3 ? 2 : res.data.warebean.type;
          console.log('modalTypeIndex------->' + modalTypeIndex);
          self.setData({
            modalTypeIndex: modalTypeIndex,
            rtype: modalTypeIndex
          })
          //设置第一个规格库存显示
          if (res.data.waresizelist!=null){
            self.setData({
              specSmprice: res.data.waresizelist[0].smprice,
              specKucun: res.data.waresizelist[0].kuncun,
              specPrice: res.data.waresizelist[0].price,
              specRentCost: res.data.waresizelist[0].rent_cost,
              waresizes: res.data.waresizelist[0].id
            });
            //处理折旧程度
            for (var i = 0; i < res.data.waresizelist.length;i++){
              for (var j = 0; j < zjList.length;j++){
                if (res.data.waresizelist[i].level == zjList[j].name) {
                  zjList[j].cls='jc';
                  zjList[j].obj = res.data.waresizelist[i];
                  break;
                }
              }
            }
            console.log(zjList);
            for (var i = 0; i < zjList.length;i++){
              if (zjList[i].cls=='jc'){
                zjList[i].cls = 'qx';
                break;
              }
            }
            
            self.setData({
              zjList: zjList
            });
          }
          
          var pro=res.data.warebean;
          //处理颜色
          var colorsArr=[];
          if (pro.color != '' && pro.color!=null){
            var cArr = pro.color.split(',');
            for (var i = 0; i < cArr.length;i++){
              if (cArr[i] != null && cArr[i] != '') {
                var colorsItem = {};
                colorsItem.id = i + 1;
                colorsItem.name = cArr[i];
                colorsArr.push(colorsItem);
              }
            }
          }
          console.log(colorsArr);
          self.setData({
            colors: colorsArr[0].name,  //默认选中第一个
            colorsArr: colorsArr
          })

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
          console.log(picList);
          self.setData({
            imgUrls:picList
          });
          /** 
            * WxParse.wxParse(bindName , type, data,target,imagePadding) 
            * 1.bindName绑定的数据名(必填) 
            * 2.type可以为html或者md(必填) 
            * 3.data为传入的具体数据(必填) 
            * 4.target为Page对象,一般为this(必填) 
            * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选) 
            */
          var descript = res.data.warebean.descript;
          WxParse.wxParse('descript', 'html', descript, self, 5);

          var editor_detail = res.data.warebean.editor_detail;
          WxParse.wxParse('editor_detail', 'html', editor_detail, self, 5);
        }
      },
      failCallback: function(res) {
        console.log(res);
      }
    });
  },

  //折旧切换
  zjFun: function (e) {
    var self = this;
    var obj = e.currentTarget.dataset.obj;
    if(obj!=null){
      console.log(obj);
      var zjList = self.data.zjList;
      for (var i = 0; i < zjList.length;i++){
        if (zjList[i].cls == 'qx'){
          zjList[i].cls = 'jc';
          continue;
        }
      }
      for (var i = 0; i < zjList.length; i++) {
        if (zjList[i].obj!=null&&obj.id == zjList[i].obj.id && zjList[i].cls == 'jc') {
          zjList[i].cls = 'qx';
          continue;
        }
      }
      self.setData({
        zjList: zjList
      }); 

      //更改颜色
      var colorsArr = [];
      if (obj.color != '' && obj.color != null) {
        var cArr = obj.color.split(',');
        for (var i = 0; i < cArr.length; i++) {
          if (cArr[i] != null && cArr[i]!=''){
            var colorsItem = {};
            colorsItem.id = i + 1;
            colorsItem.name = cArr[i];
            colorsArr.push(colorsItem);
          }
        }
      }
      console.log(colorsArr);
      self.setData({
        modalColorIndex: 0,
        colors: colorsArr[0].name,  //默认选中第一个
        colorsArr: colorsArr
      })

      //设置购买类型
      var modalTypeIndex = self.data.warebean.type == 3 ? 2 : self.data.warebean.type;
      self.setData({
        modalTypeIndex: modalTypeIndex,
        rtype: modalTypeIndex
      })

      //更改价格
      var warebean = self.data.warebean;
      warebean.smprice = obj.smprice;
      warebean.rent_cost = obj.rent_cost;
      warebean.price = obj.price;
      self.setData({
        warebean: warebean,
        specSmprice: obj.smprice,
        specKucun: obj.kuncun,
        specPrice: obj.price,
        specRentCost: obj.rent_cost,
        waresizes: obj.id
      })
    }
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

    this.setData({
      curComment: curComment
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
  
    var colors = self.data.colors;  //购买颜色
    var rtype = self.data.rtype;   //购买类型2、我要租 1:我要买
    if (rtype==1){
      rentdates=0;  //租赁月数为0
    }
    console.log('rtype=' + rtype);
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
        number: numbers,
        color: colors,
        rtype: rtype
      };
      app.ajax({
        url: app.globalData.serviceUrl + 'mrentadd.htm',
        data: postData,
        method: 'GET',
        successCallback: function (res) {
          console.log(res);
          if (res.code == 0) {
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
        url: '/pages/order/confirm/confirm?wareids=' + wareids + '&numbers=' + numbers + 
        '&waresizes=' + waresizes + '&rentdates=' + rentdates 
        + '&colors=' + colors + '&rtype=' + rtype
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
    console.log(data);
    this.setData({
      modalSpecIndex: data.index,
      specKucun: data.kuncun,
      specPrice: data.price,
      specRentCost: data.rent_cost,
      waresizes: data.id
    });
  },

  //选择购买类型
  selectType: function (e) {
    var data = e.target.dataset;
    console.log(data);
    this.setData({
      modalTypeIndex: data.index,
      rtype: data.index
    });
  },
  //选择购买颜色
  selectColor: function (e) {
    var data = e.target.dataset;
    console.log(data);
    this.setData({
      modalColorIndex: data.index,
      colors: data.name
    });
  },

  //商品详情
  productInfo: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
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
  },

  //折旧须知
  gotoDepreciation:function(){
    wx.navigateTo({
      url: '/pages/depreciation/depreciation'
    })
  },

  //收藏商品
  scProduct:function(){
    var self=this;
    var wareids = self.data.id;  //商品id
    var waresizes = self.data.waresizes;  //规格id
    var postData = {
      token: app.globalData.token,
      wareid: wareids,
      waresizeid: waresizes
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mcollectsub.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        self.showMsg(res.msg);
      }
    })
  }
})