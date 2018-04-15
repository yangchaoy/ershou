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
            // 加载更多判断
            if (that.data.limitNum == request.data.length) {
              that.setData({
                hasLoadMore: true,
                showNoneInfo: true
              })
              that.data.lastId = request.data[request.data.length - 1].id
            }
            else {
              that.setData({
                hasLoadMore: false,
                showLoadingStatus: true,
                showNoneInfo: false
              })
            }

            that.data.itemListArr = that.data.itemListArr.concat(request.data);
            if (that.data.itemListArr.length < 5) {
              that.setData({
                showNoneInfo: true
              })
            }
            that.setData({
              noneData: true,
              itemList: that.data.itemListArr
            })
          }
          else {
            that.data.itemListArr = [];
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
    console.log(111);
    wx.navigateTo({
      url: '../gopublish/gopublish'
    })
  },
  onPullDownRefresh: function (e) {
    wx.showNavigationBarLoading();
    this.setData({
      hasLoadMore: true,
      showLoadingStatus: true
    })
    this.data.lastId = 0;
    this.data.itemListArr = [];
    this.onShow();

  },
  onReachBottom: function (e) {
    var that = this;
    if (that.data.hasLoadMore) {
      that.setData({
        hasLoadMore: false,
        showLoadingStatus: false
      })
      that.onShow();
    }
  },
  bindDelete: function(e){
    var itemid = e.currentTarget.dataset.id;
    wx.showModal({
      title: '温馨提示',
      content: '确认下架当前商品?',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          util.diyrequest(
            config.configUrl + 'item',
            {
              id: itemid
            },
            "DELETE",
            function (request) {
              if (request.data.code == undefined) {
                if (request.data.length > 0) {
                }
                else {
                 
                }
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