var config = require('/../../utils/configurl.js');
var app = getApp()

Page({
  data: {
  },
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      console.log(that.data.userInfo)
    })
    
  },
  onShow: function () {

  },
})