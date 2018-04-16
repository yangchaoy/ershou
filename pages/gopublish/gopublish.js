var mapApi = {
  qqMapApi: 'http://apis.map.qq.com/ws/geocoder/v1/',
  qqUserkey: 'LGCBZ - VNNKJ - ZL4FA - KIW42 - QKIEO - 6HB6X'
}
var config = require('/../../utils/configurl.js');
var util = require('/../../utils/util.js');
Page({
  data: {
    nametip: '',
    studentNumberTip: true,
    selectnothingstatus: true,
    selectpicstatus: false,
    selectPicArr: [],
    uploadedpicnum: 0,
    uploadedmediadata: [],
    itemName: '',
    itemValue: '',
    itemPrice: '',
    allSelect: true,
    brandnew: 1
  },
  selectpic: function () {
    var that = this;
    wx.setStorageSync('upload_maxsize', 5 * 1024 * 1024);
    if (this.data.selectPicArr.length >= 3) {
      wx.showToast({
        title: '最多选择3张图片',
        icon: 'success',
        duration: 2000,
        mask: true
      })
      return false;
    }
    wx.chooseImage({
      count: 6 - that.data.selectPicArr.length, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var curArr = that.data.selectPicArr;
        var tempFile = res.tempFiles;

        for (var key = 0; key < tempFilePaths.length; key++) {
          if (tempFile[key].size > Number(1024 * 1024 * 5)) {
            wx.showModal({
              title: '温馨提示',
              content: '图片上传过大,请重新选择',
              confirmText: '确定',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {

                }
              }
            })
          }
          else {
            curArr.push(tempFilePaths[key]);
            wx.setStorageSync('has_loaction', '0');
          }
        }
        if (that.data.selectPicArr.length == 0) {
          that.setData({
            selectnothingstatus: true,
            selectpicstatus: false,
          })
        }
        else {
          that.setData({
            selectPicArr: curArr,
            selectnothingstatus: false,
            selectpicstatus: true
          })
        }

      },
      fail: function (res) {
      }
    })
  },
  uploadpic: function () {
    var that = this;
    wx.request({
      url: 'https://xapi.youcai.xin/idle/qcloud/postobj',
      success: function (res) {
        console.log(res.data.url + res.data.key)
        wx.uploadFile({
          url: res.data.url,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'Content-Type': 'image/jpeg',
            key: res.data.key,
            Signature: res.data.sign
          },
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
    // wx.chooseImage({
    //   success: function (res) {
    //     console.log(res.data)
    //     var tempFilePaths = res.tempFilePaths
    //     wx.request({
    //       url: 'https://xapi.youcai.xin/idle/qcloud/postobj',
    //       success: function (res) {
    //         console.log(res.data.url + res.data.key)
    //         wx.uploadFile({
    //           url: res.data.url,
    //           filePath: tempFilePaths[0],
    //           name: 'file',
    //           formData: {
    //             'Content-Type': 'image/jpeg',
    //             key: res.data.key,
    //             Signature: res.data.sign
    //           },
    //           success: function (res) {
    //             console.log(res)
    //           }
    //         })
    //       }
    //     })
    //   }
    // })
    // uploadImage(
    //   {
    //     filePath: that.data.selectPicArr[that.data.uploadedpicnum],
    //     // dir:'',
    //     uploadtype: 1,
    //     success: function (res) {
    //       var gethost = wx.getStorageSync('upload_host');
    //       gethost = 'https://img.meiyuol.com';
    //       that.data.uploadedmediadata.push(gethost + "/" + res);

    //       that.data.uploadedpicnum++;
    //       console.log(that.data.uploadedpicnum == that.data.selectPicArr.length);
    //       console.log(that.data.selectPicArr.length)
    //       if (that.data.uploadedpicnum == that.data.selectPicArr.length) {
    //         that.data.selectPicArr = [];
    //         that.formBindsubmitClass();
    //       }
    //       else {
    //         that.uploadpic();
    //       }
    //     },
    //     fail: function (res) {
    //       wx.hideToast();

    //       wx.showModal({
    //         title: '温馨提示',
    //         content: '图片上传失败,请重试~',
    //         confirmText: '确定',
    //         showCancel: false,
    //         success: function (res) {
    //           if (res.confirm) {

    //           }
    //         }
    //       })

    //       that.data.uploadedpicnum = 0
    //     }
    //   })
  },

  deletepic: function (e) {
    var curIndex = e.currentTarget.dataset.index;
    var deleteArr = [];
    deleteArr = this.data.selectPicArr;
    util.removeArr(deleteArr, curIndex);
    this.setData({
      selectPicArr: deleteArr
    })
  },
  onLoad: function (options) {
  },
  onShow: function () {
    var that = this;
    if (wx.getStorageSync('has_loaction') == 1) {
      var curAddress = wx.getStorageSync('address');
      var poData = {
        address: curAddress.address,
        name: curAddress.formatted_addresses.recommend,
        latitude: curAddress.location.lat,
        longitude: curAddress.location.lng
      }
      that.setData({
        selectLessonAddress: poData
      })
      wx.setStorageSync('has_loaction', '0');
    }

  },
  bindSelectMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        wx.setStorageSync('get_position', '1');
        wx.setStorageSync('has_loaction', '0');
        var addressInfo = {
          address: res.address,
          name: res.name,
          latitude: res.latitude,
          longitude: res.longitude,
        }
        that.setData({
          selectLessonAddress: res,
          poiwx: JSON.stringify(addressInfo)
        })
        console.log(that.data.selectLessonAddress)
      },
      fail: function (res) {
        if (res.errMsg == "chooseLocation:fail auth deny") {
          wx.showModal({
            title: '温馨提示',
            content: '您还没有授权"运势计算器"获取您的地理位置，是否开启授权',
            confirmText: '开启',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => { wx.setStorageSync('get_position', '1') }
                })
              }
            }
          })
        }
      }
    })
  },
  checkboxSelect: function () {
    var that = this;
    this.setData({
      allSelect: !that.data.allSelect
    })
    if (this.data.allSelect) {
      that.setData({
        brandnew: 1
      })
    }
    else {
      that.setData({
        brandnew: 0
      })
    }
  },
  formBindsubmit: function (e) {
    var that = this;
    console.log(e.detail.value)
    var submitData = {
      "title": e.detail.value.title.trim(),
      "descr": e.detail.value.descr.trim(),
      "imgs": ["http://p3.pstatp.com/origin/pgc-image/1523586871254a62e46d6b0", "http://p9.pstatp.com/origin/pgc-image/1523586871677fd749243ad"],
      "brandnew": that.data.brandnew,
      "place": that.data.selectLessonAddress.name,
      "address": that.data.selectLessonAddress.address,
      "longitude": that.data.selectLessonAddress.longitude,
      "latitude": that.data.selectLessonAddress.latitude
    }

    wx.showToast({
      title: '提交中,请稍候..',
      icon: 'loading',
      mask: true,
      duration: 300000
    });

    util.diyrequest(
      config.configUrl + 'item',
      submitData,
      "POST",
      function (request) {
        wx.hideToast();
        console.log(request)
        if (request.data.code == undefined) {
          wx.navigateBack();
        }
        else {
        }
      },
      function (request) { }
    )
  }

});