// pages/brandintro/brandintro.js
var app = getApp();
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winH: Number(res.windowHeight - 58)+'px'
        })
      }
    })

    var curOrgInfoData = app.globalData.org_info;
    curOrgInfoData.rewards_des = curOrgInfoData.rewards_des.replace(/(\r\n)|(\n)/g, '<br>').split("<br>");
    curOrgInfoData.brand_desc = curOrgInfoData.brand_desc.replace(/(\r\n)|(\n)/g, '<br>').split("<br>");
    for (var i = 0; i < curOrgInfoData.brand_desc.length; i++) {
      curOrgInfoData.brand_desc[i] = curOrgInfoData.brand_desc[i].replace(/\s+/g, "");
    }

    for (var j = 0; j < curOrgInfoData.rewards_des.length; j++) {
      curOrgInfoData.rewards_des[j] = curOrgInfoData.rewards_des[j].replace(/\s+/g, "");
    }
    // curOrgInfoData.feature_desc = curOrgInfoData.feature_desc.replace(/(\r\n)|(\n)/g, '<br>').split("<br>");
    // for (var j = 0; j < curOrgInfoData.feature_desc.length; j++) {
    //   curOrgInfoData.feature_desc[j] = curOrgInfoData.feature_desc[j].replace(/\s+/g, "");
    // }

    this.setData({
      org_info: curOrgInfoData
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  makePhoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone
    })
  },
  onShow: function () {

  },
  bindAppoint: function () {
    wx.navigateTo({
      url: '../appointment/appointment'
    });
  }
})