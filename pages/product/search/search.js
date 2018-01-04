//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    'imageRootPath': '',
    'warelist': [],
    'hotsKey':[],
    'source':'',   //入口来源
    'name':'',
    'searchStatus': false,    //是否进行搜索
    'hide': 'hide'
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    this.setData({
      source: options.source
    });

    this.getHotsKey();//获取关键字列表
  },

  //获取关键字列表
  getHotsKey:function(){
    var self = this;
    var postData = {};

    app.ajax({
      url: app.globalData.serviceUrl + '/msearchindex.html',
      data: postData,
      method: 'POST',
      successCallback: function (res) {
        if (res.data) {
          self.setData({
            hotsKey: res.data.hotkeywords
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //关键字触发
  productInfoByKey:function(e){
    var name = e.currentTarget.dataset.name;
    this.setData({
      name: name
    });
    if (name != '') {
      this.setData({
        searchStatus: true
      });
    }

    this.searchProduct();
  },

  bindinputFun: function(e){
    var name = e.detail.value;
    var searchStatus = false;
    if (name) {
      searchStatus = true;
    } else {
      searchStatus = false;
    }
    this.setData({
      name: name,
      searchStatus: searchStatus
    });
  },

  //搜索商品
  searchProduct: function () {
    var self = this;
    var postData = {
      warename: self.data.name
    };
  
    app.ajax({
      url: app.globalData.serviceUrl + '/mwaresearch.html',
      data: postData,
      method: 'POST',
      successCallback: function (res) {
        if (res.data) {
          var isShow = res.data.warelist.length > 0 ? 'hide' : 'show';
          self.setData({
            imageRootPath: res.data.imageRootPath,
            warelist: res.data.warelist,
            hide: isShow
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //取消搜索
  cancelSearch:function(){
    var source = this.data.source;
    if (source =='index'){
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else if (source == 'list') {
      wx.switchTab({
        url: '/pages/product/list/list'
      })
    }
  },

  //跳转到产品详情
  productInfo: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/info/info?id=' + id
    })
  }

})