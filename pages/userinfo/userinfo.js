var config = require('/../../utils/configurl.js');
var util = require('/../../utils/util.js');
var app = getApp()

Page({
  data: {
  },
  onLoad: function (options) {
    var that = this;
    wx.showToast({
      title: '加载中,请稍候..',
      icon: 'loading',
      mask: true,
      duration: 10000
    });

    util.diyrequest(
      config.configUrl + 'user',
      {},
      "GET",
      function (request) {
        if (request.data.code == undefined) {
          that.setData({
            userInfo: request.data
          })
          that.getAccount();
        }
        else {
        }
      },
      function (request) { }
    )
   

  },
  getAccount: function(){
    var that = this;
    util.comrequest(
      config.configUrl + 'item/count',
      {},
      "GET",
      function (request) {
        wx.hideToast();
        if (request.data.code == undefined) {
          that.setData({
            count: request.data.count
          })
        }
        else {
        }
      },
      function (request) { }
    )
  },
  onShow: function () {

  },
  bindMypublish: function(){
    wx.navigateTo({
      url: '../mypublish/mypublish',
    })
  }
})