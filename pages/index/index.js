var config = require('/../../utils/configurl.js');
var util = require('/../../utils/util.js');
Page({
  data: {
    noneData: true
  },
  onShow: function () {
    var that = this;
    wx.showToast({
      title: '加载中,请稍候..',
      icon: 'loading',
      mask: true,
      duration: 300000
    });

    util.diyrequest(
      config.configUrl + 'order/list',
      {},
      "GET",
      function (request) {
        wx.hideToast();
        if (request.data.code == undefined) {
          that.setData({
            orderList: request.data
          })
          if (request.data.length > 0) {
            that.setData({
              noneData: true
            })
          }
          else {
            that.setData({
              noneData: false
            })
          }
        }
      },
      function (request) { }
    )
  }
})