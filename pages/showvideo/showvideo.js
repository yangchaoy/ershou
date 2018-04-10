var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posterImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      video_url: app.videoUrl
    })
    
    if (app.videoPoster != ''){
      this.setData({
        posterImg: app.videoPoster
      })
    }
    else {
      this.setData({
        posterImg: 'https://img.meiyuol.com/29eba802c8076800aa6cbdae615b4272'
      })
    }
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})