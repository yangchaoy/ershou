var util = require('/../../utils/util.js');
var app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    // wx.showToast({
    //   title: 'loading',
    //   icon: 'loading',
    //   mask: true,
    //   duration: 300000
    // });

  },
  bindShowCourseInfo: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../courseinfo/courseinfo?id=' + id
    });
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
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
        console.log(request)
        if (request.data.errcode == 0) {
          if (request.data.data.base_color['bgcolor'] != app.curBgColor){
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
      url: app.globalData.extConfig.host + '/template/get_course_list.php',
      data: {
        org_id: app.globalData.extConfig.org_id,
        appid: app.globalData.extConfig.appid,
        template_id: app.globalData.extConfig.template_id,
        brand_id: app.globalData.extConfig.brand_id
      },
      method: 'POST',
      success: function (request) {
        setTimeout(function () {
          that.setData({
            showLoading: true
          })
        }, 500)
        if (request.data.errcode == 0) {

          for (var i = 0; i < request.data.data.length; i++) {
            request.data.data[i].name = util.ellipsis(request.data.data[i].name, app.fontSize);
          }
          that.setData({
            course_list: request.data.data,
            course_count: request.data.data.length
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
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})