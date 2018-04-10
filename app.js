//app.js
App({

  orgLogo: '',
  curBgColor: '',
  curFtColor: '',
  videoUrl: '',
  appointImg: '',
  videoPoster: '',
  fontSize: 20,
  onLaunch: function () {
      var extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
      console.log(wx.getExtConfigSync());
      this.globalData.extConfig = extConfig
  },

  globalData:{
      extConfig:null,
      phone:"",
      org_info:null
  }
})