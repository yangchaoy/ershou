function comTip(con) {
  wx.showToast({
    title: con,
    duration: 2000,
    icon: 'none',
    mask: true
  })
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
    uploadedmediadata: [],
    allSelect: true,
    brandnew: 1,
    headerImgfiles: [],
    groupmemberlimit: 0,
    uploadedpicnum: 0,
  },
  selectpic: function () {
    var that = this;
    wx.setStorageSync('upload_maxsize', 5 * 1024 * 1024);
    if (this.data.selectPicArr.length >= 6) {
      wx.showToast({
        title: '最多选择6张图片',
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
   
    util.comrequest(
      config.configUrl + 'qcloud/postobj',
      {},
      "GET",
      function (res) {
        wx.hideToast();
        if (res.data.code == undefined) {
          console.log(res)
          var resData = res;
          wx.uploadFile({
            url: res.data.url,
            filePath: that.data.selectPicArr[that.data.uploadedpicnum],
            name: 'file',
            formData: {
              'Content-Type': 'image/jpeg',
              key: res.data.key,
              Signature: res.data.sign
            },
            success: function (res) {
              that.data.uploadedmediadata.push(resData.data.url + resData.data.key);
              that.data.uploadedpicnum++;
              if (that.data.uploadedpicnum == that.data.selectPicArr.length) {
                that.formBindsubmit();
              } else {
                that.uploadpic();
              }
            },
            fail: function () {
              wx.hideToast();
              wx.showModal({
                title: '温馨提示',
                content: '图片上传失败,请重试~',
                confirmText: '确定',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                  }
                }
              })
            }
          })
        }
        else {
        }
      },
      function (request) { }
    )
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
    var that = this;
    util.diyrequest(
      config.configUrl + 'user',
      {},
      "GET",
      function (request) {
      },
      function (request) { }
    )
  },
  onShow: function () {
    var that = this;
    var curAddress = wx.getStorageSync('address');
    if (wx.getStorageSync('has_loaction') == 1){
      var poData = {
        address: curAddress.address,
        name: curAddress.formatted_addresses.recommend,
        latitude: curAddress.location.lat,
        longitude: curAddress.location.lng
      }
      that.setData({
        selectLessonAddress: poData
      })
      console.log(that.data.selectLessonAddress)
    }
   
  },
  bindSelectMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        wx.setStorageSync('get_position', '1');
        wx.setStorageSync('has_loaction', '0')
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
    wx.showToast({
      title: '提交中,请稍候...',
      icon: 'loading',
      mask: true,
      duration: 300000
    });

    if (that.data.uploadedpicnum == 0) {
      if (e.detail.value.title.trim().length == 0) {
        comTip('提示：宝贝名称不能为空');
        return false;
      }
      if (util.utf8_strlen(e.detail.value.title.trim()) > 60) {
        comTip('提示：宝贝名称超长(中文30)！');
        return false;
      }

      if (that.data.selectPicArr.length == 0) {
        comTip('提示：请上传宣传头图！');
        return false;
      }
      if (e.detail.value.descr.trim().length == 0) {
        comTip('提示：请输入宝贝介绍！');
        return false;
      }
      that.setData({
        postname: e.detail.value.title.trim(),
        wxaformid: e.detail.formId,
        descr: e.detail.value.descr.trim()
      })
    }
    if (that.data.uploadedpicnum == that.data.selectPicArr.length) {
      var submitData = {
        "title": that.data.postname,
        "descr": that.data.descr,
        "brandnew": that.data.brandnew,
        "place": that.data.selectLessonAddress.name,
        "address": that.data.selectLessonAddress.address,
        "longitude": that.data.selectLessonAddress.longitude,
        "latitude": that.data.selectLessonAddress.latitude,
        "wxa_formid": that.data.wxaformid,
        "imgs": that.data.uploadedmediadata
      }
      wx.showToast({
        title: '提交中,请稍候...',
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
          if (request.data.code == undefined) {
            wx.navigateBack();
          }
          else {
          }
        },
        function (request) { }
      )
    }
    else {
      that.uploadpic();
    }

  }

});