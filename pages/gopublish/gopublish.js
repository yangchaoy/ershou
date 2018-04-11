Page({
  data: {
    courseName: '',
    courseNameTip: true,
    nametip: '',
    studentNumberTip: true,
    selectnothingstatus: true,
    selectpicstatus: false,
    selectPicArr: [],
    uploadedpicnum: 0,
    uploadedmediadata: [],
    itemName: '',
    itemValue: '',
    itemPrice: ''
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
      count: 3 - that.data.selectPicArr.length, // 默认9
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
    uploadImage(
      {
        filePath: that.data.selectPicArr[that.data.uploadedpicnum],
        // dir:'',
        uploadtype: 1,
        success: function (res) {
          var gethost = wx.getStorageSync('upload_host');
          gethost = 'https://img.meiyuol.com';
          that.data.uploadedmediadata.push(gethost + "/" + res);

          that.data.uploadedpicnum++;
          console.log(that.data.uploadedpicnum == that.data.selectPicArr.length);
          console.log(that.data.selectPicArr.length)
          if (that.data.uploadedpicnum == that.data.selectPicArr.length) {
            that.data.selectPicArr = [];
            that.formBindsubmitClass();
          }
          else {
            that.uploadpic();
          }
        },
        fail: function (res) {
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

          that.data.uploadedpicnum = 0
        }
      })
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
  }
});