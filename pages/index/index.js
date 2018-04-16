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
    limitNum: 5,
    showNoneInfo: true,
    showImgStatus: 1,
    initPageNum: 1
  },
  getLocation: function(){
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        that.itemList();
        var qqMapApi = config.qqMapApi + "?location=" + latitude + ',' +
          longitude + "&key=" + config.qqUserkey + "&get_poi=1";
        wx.request({
          url: qqMapApi,
          data: {},
          method: 'GET',
          success: (res) => {
            if (res.statusCode == 200 && res.data.status == 0) {
              console.log(res)
              wx.setStorageSync('address', res.data.result);
              that.setData({
                curAddress: res.data.result.address
              })
            }
          }
        })
      }
    })
  },
  onShow: function () {
    var that = this;
    if (that.data.initPageNum == 1 && that.data.showImgStatus == 1) {
      that.setData({
        hasLoadMore: true,
        showLoadingStatus: true
      })
      that.data.initPageNum = 1;
      that.data.itemListArr = [];
      wx.showToast({
        title: '加载中,请稍候..',
        icon: 'loading',
        mask: true,
        duration: 1000
      });
    }
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '免费二手需要获取您的地理位置，否则将无法查看您周边发布的商品列表',
            success: function (res) {
              if (res.cancel) {
                that.onShow();
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                    } else {
                      that.onShow();
                    }
                  }
                })
              }
            }
          })
        }
        else {
          that.getLocation();
        }
      }
    })


  },
  itemList: function () {
    var that = this;
    util.diyrequest(
      config.configUrl + 'item',
      {
        page: that.data.initPageNum,
        limit: that.data.limitNum,
        longitude: that.data.longitude,
        latitude: that.data.latitude
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
              itemListArr: that.data.itemListArr
            })
          }
          else {
            if (that.data.itemListArr.length > 0) {
              if (request.data.length == 0) {
                that.setData({
                  itemListArr: that.data.itemListArr,
                  noneData: true,
                  showNoneInfo: false,
                  showLoadingStatus: true
                })
              }
              else {
                that.setData({
                  itemListArr: that.data.itemListArr,
                  noneData: true,
                  showNoneInfo: false,
                  showLoadingStatus: true
                })
              }

            }
            else {
              that.data.itemListArr = [];
              that.setData({
                itemListArr: [],
                noneData: false,
                showNoneInfo: true,
                showLoadingStatus: true
              })
            }
          }
        }
        else {

        }
      },
      function (request) { }
    )
  },
  bindPublish: function () {
    wx.setStorageSync('has_loaction', '1');
    this.data.showImgStatus = 1;
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
    this.data.initPageNum = 1;
    this.data.showImgStatus = 0;
    this.data.itemListArr = [];
    this.itemList();

  },
  onReachBottom: function (e) {
    var that = this;
    if (that.data.hasLoadMore) {
      var curPage = Number(that.data.initPageNum);
      curPage++;
      that.setData({
        hasLoadMore: false,
        initPageNum: curPage++,
        showLoadingStatus: false
      })
      that.itemList();
    }
  },
  bindShowImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgIdx = e.currentTarget.dataset.img;
    this.data.showImgStatus = 0;
    var that = this;
    wx.previewImage({
      current: that.data.itemListArr[index].imgs[imgIdx],
      urls: that.data.itemListArr[index].imgs
    })
  }
})