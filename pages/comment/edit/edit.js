var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picA: [],
    uploadImgA: [],
    imageRootPath:'',
    havewaredetail:null,
    commentContent: '',
    wareid: '',
    waresizeid: '',
    warenumber: '',
    index: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) { 
    var self = this;
    var id = options.id;
    self.setData({
      id: id
    });
    var self = this;
    var postData = {
      token: app.globalData.token,
      id: id
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mhavewaredetail.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          self.setData({
            imageRootPath: res.data.imageRootPath,
            havewaredetail: res.data.havewaredetail,
            wareid: res.data.havewaredetail.wareid,
            waresizeid: res.data.havewaredetail.waresizeid,
            warenumber: res.data.havewaredetail.warenumber
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  uploadImgClick: function() {
    var self = this;

    if (self.data.picA.length >= 3) {
      self.showMsg('最多上传3张相片哦');
      return false;
    }

    wx.chooseImage({
      count: 3 - self.data.picA.length,
      sizeType: ['compressed'],
      success: function(res) {
        var tempFilePaths = self.data.picA.concat(res.tempFilePaths);
        self.setData({
          picA: tempFilePaths
        });
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  uploadImg: function(file) {
    var self = this;
    var index = self.data.index;
    var currentA = self.data.uploadImgA;

    console.log('accll');
    wx.uploadFile({
      url: app.globalData.serviceUrl + 'wxupload.htm' + '?name2=wximage&filePath2=' + file + '&token=' + app.globalData.token,
      filePath: file,
      name: 'wximage',
      formData: {'token': app.globalData.token },
      success: function(res) {

        console.log(res);

        index = index + 1;

        self.setData({
          index: index
        });

        var obj = JSON.parse(res.data);

        if (obj) {
          currentA.push(obj.msg);
          self.setData({
            uploadImgA: currentA
          });
        }

        if (index > self.data.picA.length - 1) {
          self.publishComment();
        } else {
          self.uploadImg(self.data.picA[index]);
        }
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  deteleImg: function(event) {
    var index = event.currentTarget.dataset.index;
    var self = this;
    var picACopy = self.data.picA;

    picACopy.splice(index, 1);

    self.setData({
      picA: picACopy
    });

  },

  publishComment: function() {
    var self = this;
    var postData = {
      wareid: self.data.wareid,
      waresizeid: self.data.waresizeid,
      warenumber: self.data.warenumber,
      content: self.data.commentContent,
      pica: self.data.uploadImgA[0] || '',
      picb: self.data.uploadImgA[1] || '',
      picc: self.data.uploadImgA[2] || '',
      token: app.globalData.token
    };

    app.ajax({
      url: app.globalData.serviceUrl + 'mpingjaiadd.htm',
      data: postData,
      method: 'POST',
      successCallback: function(res) {
        wx.hideLoading();
        //跳转到续租提交页面 
        if (res.code == 0) {
          wx.redirectTo({
            url: '/pages/comment/list/list'
          })
        } else {
          self.showMsg('评论失败')
        }
      },
      failCallback: function(res) {
        wx.hideLoading();
      }
    });
  },

  publishCommentClick: function(event) {
    var self = this;

    if (!self.data.commentContent) {
      self.showMsg('请输入评价内容');
      return false;
    }

    self.setData({
      index: 0
    });

    wx.showLoading({title: '正在提交中...请稍后！'});

    if (self.data.picA.length > 0) {
      self.uploadImg(self.data.picA[self.data.index]);
    } else {
      self.publishComment();
    }

  },

  bindTextBlur: function(event) {
    this.setData({
      commentContent: event.detail.value
    });
  },
  bindTextInput: function(event) {
     this.setData({
      commentContent: event.detail.value
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