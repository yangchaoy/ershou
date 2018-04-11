var util = require('utils/util.js');
App({
  commonPageNum: 80,
  userInfo: '',

  allTitleObj: {'regsiterTitle': '用户登录注册'},

  onLaunch: function () {
   
  },

  getUserInfo:function(cb){
    var that = this
    if (this.userInfo) {
      typeof cb == "function" && cb(this.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.userInfo = res.userInfo
              typeof cb == "function" && cb(that.userInfo)
            }
          })
        }
      })

    }
  }
  
});