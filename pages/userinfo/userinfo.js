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
      duration: 1000
    });

    util.diyrequest(
      config.configUrl + 'user',
      {},
      "GET",
      function (request) {
        wx.hideToast();
        console.log(request)
        if (request.data.code == undefined) {
          that.setData({
            userInfo: request.data
          })
          console.log(that.data.userInfo)
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