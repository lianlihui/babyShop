var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picA: [],
    uploadImgA: [],
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
    var warenumbers = options.warenumbers;
    self.setData({
      warenumbers: warenumbers
    });
    var self = this;
    var postData = {
      token: app.globalData.token,
      warenumbers: warenumbers
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'tuihuoorderaffirm.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0 && res.data.warelist != null) {
          self.setData({
            imageRootPath: res.data.imageRootPath,
            warelist: res.data.warelist,
            wareid: orderwarelist[0].wareid,
            waresizeid: orderwarelist[0].wareid,
            warenumber: orderwarelist[0].wnnumbers
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
        self.setData({
          picA: res.tempFilePaths
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
    var postData = {
      token: app.globalData.token,
      name2: 'wximage',
      filePath2: file
    };
    var currentA = self.data.uploadImgA;
    app.ajax({
      url: app.globalData.serviceUrl + 'wxupload.htm',
      data: postData,
      method: 'POST',
      successCallback: function(res) {
        index = index + 1;

        self.setData({
          index: index
        });

        if (res.code == 0 && res.data) {
          currentA.push(res.data.msg);
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
      failCallback: function(res) {
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
        console.log('评论成功');
        wx.hideLoading();
      },
      failCallback: function(res) {
        wx.hideLoading();
      }
    });
  },

  publishCommentClick: function(event) {
    var self = this;

    console.log(self.data.commentContent);
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
    console.log('失去');
  },
  bindTextInput: function(event) {
     this.setData({
      commentContent: event.detail.value
    });
    console.log('输入');
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