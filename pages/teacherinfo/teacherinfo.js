//index.js
//获取应用实例
var util = require('/../../utils/util.js');
var app = getApp();
Page({
  data: {
    imgUrls: [
      '../../images/slider-1.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',

    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    showLoading: false,
    hotLineArr: new Array()
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    var scene = decodeURIComponent(options.scene);
    if (options.scene != undefined && options.scene != '') {
      this.setData({
        id: scene.toString().split("=")[1]
      })
    }
    var that = this;
    that.setData({
      confrimBgColot: app.curBgColor,
      confrimFtColot: app.curFtColor
    })

    if (wx.setNavigationBarColor) {
      wx.setNavigationBarColor({
        frontColor: app.curFtColor,
        backgroundColor: app.curBgColor
      })
    } else {
    }
    wx.request({
      url: app.globalData.extConfig.host + '/template/get_brand_conf.php',
      data: {
        org_id: app.globalData.extConfig.org_id,
        appid: app.globalData.extConfig.appid,
        template_id: app.globalData.extConfig.template_id,
        brand_id: app.globalData.extConfig.brand_id
      },
      method: 'POST',
      success: function (request) {
        if (request.data.errcode == 0) {
          if (request.data.data.hot_line2 != '' && request.data.data.hot_line3 != '') {
            that.data.hotLineArr = [];
            that.data.hotLineArr.push(request.data.data.hot_line);
            that.data.hotLineArr.push(request.data.data.hot_line2);
            that.data.hotLineArr.push(request.data.data.hot_line3);
          }
          if (request.data.data.hot_line2 != '' && request.data.data.hot_line3 == '') {
            that.data.hotLineArr = [];
            that.data.hotLineArr.push(request.data.data.hot_line);
            that.data.hotLineArr.push(request.data.data.hot_line2);
          }
          if (request.data.data.hot_line3 != '' && request.data.data.hot_line2 == '') {
            that.data.hotLineArr = [];
            that.data.hotLineArr.push(request.data.data.hot_line);
            that.data.hotLineArr.push(request.data.data.hot_line3);
          }
          that.setData({
            brandConfig: request.data.data
          })
          if (request.data.data.base_color['bgcolor'] != app.curBgColor) {
            if (wx.setNavigationBarColor) {
              wx.setNavigationBarColor({
                frontColor: request.data.data.base_color['fcolor'],
                backgroundColor: request.data.data.base_color['bgcolor']
              })
            } else {
            }
          }

        }
      },
      fail: function (request) {
      },
      complete: function (request) {

      }
    })
    wx.request({
      url: app.globalData.extConfig.host + '/template/get_teacher.php',
      data: {
        org_id: app.globalData.extConfig.org_id,
        appid: app.globalData.extConfig.appid,
        template_id: app.globalData.extConfig.template_id,
        org_teacher_id: this.data.id,
        brand_id: app.globalData.extConfig.brand_id,
        teacher_id: that.data.id
      },
      method: 'POST',
      success: function (request) {
        // wx.hideToast();
        setTimeout(function () {
          that.setData({
            showLoading: true
          })
        }, 500)
        if (request.data.errcode == 0) {
          
          request.data.data.rewards_desc = request.data.data.rewards_desc.replace(/(\r\n)|(\n)/g, '<br>').split("<br>");
          for (var i = 0; i < request.data.data.rewards_desc.length;i++){
            request.data.data.rewards_desc[i] = request.data.data.rewards_desc[i].replace(/\s+/g, "");
          }

          that.setData({
            teacher: request.data.data
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: request.data.errmsg,
            confirmText: '确定',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail: function (request) {
      },
      complete: function (request) {

      }
    })
  },
  makePhoneCall: function () {
    var that = this;
    if (that.data.hotLineArr.length > 1) {
      wx.showActionSheet({
        itemList: that.data.hotLineArr,
        itemColor: '#1685ff',
        success: function (res) {
          wx.makePhoneCall({
            phoneNumber: that.data.hotLineArr[res.tapIndex]
          })
        }
      })
    }
    else {
      wx.makePhoneCall({
        phoneNumber: this.data.brandConfig.hot_line
      })
    }
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.extConfig.host + '/template/get_title_list.php',
      data: {
        org_id: app.globalData.extConfig.org_id,
        appid: app.globalData.extConfig.appid,
        template_id: app.globalData.extConfig.template_id,
        brand_id: app.globalData.extConfig.brand_id
      },
      method: 'POST',
      success: function (request) {
        if (request.data.errcode == 0) {
          that.setData({
            titleArr: request.data.list
          })
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    var curVersion = this.data.sdkVersion;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.teacher.name,
      path: 'pages/teacherinfo/teacherinfo?id='+that.data.teacher.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  showimage: function (e) {
    var piclist = this.data.teacher.banner;
    var currentpic = piclist[e.currentTarget.dataset.itemkey];
    wx.previewImage({
      current: currentpic,
      urls: piclist
    })
  },
  bindAppoint: function () {
    wx.navigateTo({
      url: '../appointment/appointment'
    });
  },
  bindShowMoreCampus: function () {
    wx.navigateTo({
      url: '../campus/campus'
    });
  },
})
