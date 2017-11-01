var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allStatus:true,  //全部
    dzfStatus:false,  //待支付
    dfhStatus:false,  //待发货
    dshStatus:false,  //待收货
    syzStatus:false,  //使用中
    yqzStatus:false,   //逾期中
    allCls:'span-item-active',
    dzfCls: 'span-item',
    dfhCls: 'span-item',
    dshCls: 'span-item',
    syzCls: 'span-item',
    yqzCls: 'span-item'
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {

  },

  /**菜单跳转*/
  menuClick: function (e) {
    var self=this;
    var idx = parseInt(e.currentTarget.dataset.idx);
    console.log('idx:' + idx);
    if(idx==1){
      self.setData({
        allStatus: true,  //全部
        dzfStatus: false,  //待支付
        dfhStatus: false,  //待发货
        dshStatus: false,  //待收货
        syzStatus: false,  //使用中
        yqzStatus: false,   //逾期中
        allCls: 'span-item-active',
        dzfCls: 'span-item',
        dfhCls: 'span-item',
        dshCls: 'span-item',
        syzCls: 'span-item',
        yqzCls: 'span-item'
      });
    } else if (idx == 2) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: true,  //待支付
        dfhStatus: false,  //待发货
        dshStatus: false,  //待收货
        syzStatus: false,  //使用中
        yqzStatus: false,   //逾期中
        allCls: 'span-item',
        dzfCls: 'span-item-active',
        dfhCls: 'span-item',
        dshCls: 'span-item',
        syzCls: 'span-item',
        yqzCls: 'span-item'
      });
    } else if (idx == 3) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dfhStatus: true,  //待发货
        dshStatus: false,  //待收货
        syzStatus: false,  //使用中
        yqzStatus: false,   //逾期中
        allCls: 'span-item',
        dzfCls: 'span-item',
        dfhCls: 'span-item-active',
        dshCls: 'span-item',
        syzCls: 'span-item',
        yqzCls: 'span-item'
      });
    } else if (idx == 4) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dfhStatus: false,  //待发货
        dshStatus: true,  //待收货
        syzStatus: false,  //使用中
        yqzStatus: false,   //逾期中
        allCls: 'span-item',
        dzfCls: 'span-item',
        dfhCls: 'span-item',
        dshCls: 'span-item-active',
        syzCls: 'span-item',
        yqzCls: 'span-item'
      });
    } else if (idx == 5) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dfhStatus: false,  //待发货
        dshStatus: false,  //待收货
        syzStatus: true,  //使用中
        yqzStatus: false,   //逾期中
        allCls: 'span-item',
        dzfCls: 'span-item',
        dfhCls: 'span-item',
        dshCls: 'span-item',
        syzCls: 'span-item-active',
        yqzCls: 'span-item'
      });
    } else if (idx == 6) {
      self.setData({
        allStatus: false,  //全部
        dzfStatus: false,  //待支付
        dfhStatus: false,  //待发货
        dshStatus: false,  //待收货
        syzStatus: false,  //使用中
        yqzStatus: true,   //逾期中
        allCls: 'span-item',
        dzfCls: 'span-item',
        dfhCls: 'span-item',
        dshCls: 'span-item',
        syzCls: 'span-item',
        yqzCls: 'span-item-active'
      });
    }
  }
})