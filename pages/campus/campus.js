var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,

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
    var that = this;

    that.setData({
      logo: app.orgLogo
    })
   
    wx.request({
      url: app.globalData.extConfig.host + '/template/get_brand.php',
      data: {
        org_id: app.globalData.extConfig.org_id,
        appid: app.globalData.extConfig.appid,
        template_id: app.globalData.extConfig.template_id,
        brand_id: app.globalData.extConfig.brand_id
      },
      method: 'POST',
      success: function (request) {
        wx.stopPullDownRefresh();
        setTimeout(function () {
          that.setData({
            showLoading: true
          })
        }, 500)
        if (request.data.errcode == 0) {
          if (wx.setNavigationBarColor) {
            wx.setNavigationBarColor({
              frontColor: request.data.data.brand_info.base_color['fcolor'],
              backgroundColor: request.data.data.brand_info.base_color['bgcolor']
            })
          } else {

          }
          app.curBgColor = request.data.data.brand_info.base_color['bgcolor'];
            app.curFtColor = request.data.data.brand_info.base_color['fcolor'];
            that.setData({
              confrimBgColot: app.curBgColor,
              confrimFtColot: app.curFtColor,
              storeListData: request.data.data.store_list,
              xiaoNum: request.data.data.store_list.length
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
  bindShowMap: function (e) {
    var curIndex = e.currentTarget.dataset.index;
    var address = this.data.storeListData[curIndex].poi_wx,
      curList = this.data.storeListData[curIndex];
    wx.openLocation({
      longitude: Number(address.location.lng),
      latitude: Number(address.location.lat),
      name: curList.name,
      address: curList.address,
      scale: 20
    })
  },
  bindMakePhone: function (e) {
    var curPhone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: curPhone
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
    this.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})