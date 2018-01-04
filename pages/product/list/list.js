//index.js
//获取应用实例 
var app = getApp();

Page({
  data: {
    'imageRootPath': '',
    'warelist': [],
    'waretypelist': [],
    'page':1,
    'loading': true,
    'noData': false,
    'isFirst': true,
    'waretypeid': 0,
    'hide': 'hide',
    'type':2  //获取产品的类型：1我要买2租赁产品,默认租赁产品
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    this.setData({
      'warelist': [],
      'waretypelist': [],
      'page': 1,
      'loading': true,
      'noData': false,
      'isFirst': true,
      'waretypeid': 0,
      'hide': 'hide'
    });
    var self=this;
    if (!app.globalData.token) {
      app.getToken(function () {
        self.getIndexData();
      });
    } else {
      self.getIndexData();
    }
  },

  onShow: function() {
  },

  getIndexData: function() {
    var self = this;
    var postData = {
      waretypeid: self.data.waretypeid,
      type: self.data.type,
      page: self.data.page
    };

    self.data.loading = false;
    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + '/mwarelist.html',
      data: postData,
      method: 'GET',
      successCallback: function(res) {
        var list = [];

        if (res.code != 0 || res.data == null || res.data.warelablelist == 0) {
          self.setData({
            noData: true,  //显示已经没有数据
            loading: false  //滚动不用再触发
          });
          return false;
        }

        if (self.data.isFirst && res.data.waretypelist && res.data.waretypelist.length > 0 ) {
          self.setData({
            waretypelist: res.data.waretypelist
          });
          self.data.isFirst == false;
        } 

        if (self.data.page == 1 && res.data.warelablelist.length == 0) {
          self.setData({
            hide: 'show',
            loading: false  //隐藏加载
          })
          return false;
        }
        var alist = res.data.warelablelist;
        list = self.data.warelist.concat(alist);

        self.setData({
          imageRootPath: res.data.imageRootPath,
          warelist: list,
          hide: 'hide',
          loading: true  //隐藏加载
        });

        if (self.data.page == 1 && res.data.warelablelist.length < 10) {
          self.setData({
            loading: false  //隐藏加载
          });
        }
      },
      failCallback: function(res) {
        console.log(res);
      }
    });
  },

  //滚动分页
  bindDownLoad: function () {
    //可以分页
    if (this.data.loading) {
      var page = this.data.page + 1;
      this.setData({
        page: page,
        loading: true
      });
      this.getIndexData();
    }
  },

  //商品详情
  productInfo: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/info/info?id=' + id
    })
  },

  //跳转到搜索
  gotoSearch: function () {
    wx.navigateTo({
      url: '/pages/product/search/search?source=list'
    })
  },

  //获取分类数据
  getCategoryInfo: function(event) {
    var id = event.currentTarget.dataset.id;
    var self = this;
    self.setData({
      page: 1,
      loading: true,
      noData: false,
      warelist: [],
      waretypeid: id,
      hide: 'hide'
    });

    self.getIndexData();
  },

  //购买类型切换
  buyTypeChange: function (event) {
    var buytype = event.currentTarget.dataset.type;
    var self = this;
    self.setData({
      page: 1,
      loading: true,
      noData: false,
      warelist: [],
      waretypeid: 0,
      isFirst: true,
      hide: 'hide',
      type: buytype
    });

    self.getIndexData();
  },

  //分享
  onShareAppMessage: function () {
    return {
      title: '母婴',
      desc: '母婴描述!',
      path: '/pages/product/list/list'
    }
  }

})