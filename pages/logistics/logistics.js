// index.js
//获取应用实例
var app = getApp();

Page({
  data: { 
    phone:-1,
    traces:[],
    traceNo:'',
    imageRootPath: '',
    order: null
  },

  onLoad: function (options) {
    if (!app.globalData.token) {
      app.getToken();
    }
    var orderId = options.orderId;
    this.getOrderDetail(orderId);

    var num = options.num;
    this.getLogisticsData(num);
  },

  //获取商品信息
  getOrderDetail:function(orderId){
    var self = this;
    var postData = {
      token: app.globalData.token,
      id: orderId
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'morderdetail.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0 && res.data.orderbean != null) {
          self.setData({
            order: res.data.orderbean,
            imageRootPath: res.data.imageRootPath
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //获取物流信息
  getLogisticsData: function (num) {
    var self = this;
    var postData = {
      token: app.globalData.token,
      num: num
    };
    
    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'mwuliu.html',
      data: postData,
      method: 'GET',
      successCallback: function(res) {
        if (res.Success){
          var retList = res.Traces;
          var rphone='';
          if (retList != null && retList.length>0){
            for (var i = 0; i < retList.length;i++){
              var day = retList[i].AcceptTime.substring(5,10);
              var time = retList[i].AcceptTime.substring(11, 16);
              retList[i].day = day;
              retList[i].time = time;
            }
          }
          self.setData({
            traces: retList,
            traceNo: res.LogisticCode
          })
        }
        console.log(res);
      },
      failCallback: function(res) {
        console.log(res);
      }
    });
  }
  
})