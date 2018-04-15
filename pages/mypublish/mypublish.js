var config = require('/../../utils/configurl.js');
var util = require('/../../utils/util.js');
Page({
  data: {
    noneData: true,
    hasLoadMore: true,
    itemListArr: [],
    showLoadingStatus: true,
    searchLoadingStatus: true,
    lastId: 0,
    limitNum: 50,
    showNoneInfo: true
  },
  onShow: function () {
    var that = this;
    if (that.data.lastId == 0) {
      wx.showToast({
        title: '加载中,请稍候..',
        icon: 'loading',
        mask: true,
        duration: 1000
      });
    }

    util.diyrequest(
      config.configUrl + 'item',
      {
        lastid: that.data.lastId,
        limit: that.data.limitNum
      },
      "GET",
      function (request) {
        wx.hideToast();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();

        if (request.data.code == undefined) {
          if (request.data.length > 0) {
            that.setData({
              noneData: true,
              itemList: request.data
            })
          }
          else {
            that.setData({
              itemList: [],
              noneData: false,
              showNoneInfo: true
            })
          }
        }
        else {

        }
      },
      function (request) { }
    )
  },
  bindPublish: function () {
    wx.navigateTo({
      url: '../gopublish/gopublish'
    })
  },
  // onPullDownRefresh: function (e) {
  //   wx.showNavigationBarLoading();
  //   this.setData({
  //     hasLoadMore: true,
  //     showLoadingStatus: true
  //   })
  //   this.data.lastId = 0;
  //   this.data.itemListArr = [];
  //   this.onShow();

  // },
  // onReachBottom: function (e) {
  //   var that = this;
  //   if (that.data.hasLoadMore) {
  //     that.setData({
  //       hasLoadMore: false,
  //       showLoadingStatus: false
  //     })
  //     that.onShow();
  //   }
  // },
  bindDelete: function(e){
    var itemid = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认下架当前商品?',
      confirmText: '下架',
      success: function (res) {
        if (res.confirm) {
          util.diyrequest(
            config.configUrl + 'item/' + itemid,
            {},
            "DELETE",
            function (request) {
              if (request.data.code == undefined) {
               that.onShow();
              }
              else {

              }
            },
            function (request) { }
          )
        }
      }
    })
  }
})