//index.js
//获取应用实例
var app = getApp()
var util = require('/../../utils/util.js');
Page({
  data: {
    imgUrls: [
      '../../images/slider-1.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',

    ],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 500,
    showLoading: false,
    circular: true,
    posterImg: '',
    showMaxNum: 3,
    indexbgcolor: '#f2f3f7',
    showOne: false,
    showDown: true,
    showVideoStatus: false,
    showvideoUrl: '',

    hotLineArr: new Array()
  },
  onLoad: function () {
    var that = this;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winW: res.windowWidth
        })
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sdkVersion: res.SDKVersion
        })
      }
    })
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
          that.setData({
            brandConfig: request.data.data
          })
          wx.setNavigationBarColor({
            frontColor: request.data.data.base_color['fcolor'],
            backgroundColor: request.data.data.base_color['bgcolor'],
            fail: function(e){
            },
            success: function(e){
            }
          })
          wx.setNavigationBarTitle({
            title: request.data.data.brand_name
          })
        }
      },
      fail: function (request) {
      },
      complete: function (request) {

      }
    })
  },
  makePhoneCall: function (e) {
    var that = this;
    if (that.data.hotLineArr.length > 1){
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
        phoneNumber: app.globalData.phone
      })
    }

   
  },
  onShow: function () {
    var that = this;
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
        wx.hideToast();
        wx.stopPullDownRefresh();
        setTimeout(function () {
          that.setData({
            showLoading: true
          })
        }, 500)


        // request.data.data.brand_info.env = ['https://img.meiyuol.com/3729345c4e54986de619bc1f3ee8e565'];
        if (request.data.errcode == 0) {
          var brandInfoData = request.data.data.brand_info;
          if (wx.setNavigationBarColor) {
            wx.setNavigationBarColor({
              frontColor: request.data.data.brand_info.base_color['fcolor'],
              backgroundColor: request.data.data.brand_info.base_color['bgcolor'],
              fail: function (e) {
              },
              success: function (e) {
              }
            })
          } else {

          }
          wx.setNavigationBarTitle({
            title: request.data.data.brand_info.name
          })
          app.curBgColor = request.data.data.brand_info.base_color['bgcolor'];
          app.curFtColor = request.data.data.brand_info.base_color['fcolor'];
          app.videoUrl = request.data.data.brand_info.video_url;
          app.videoPoster = request.data.data.brand_info.video_cover;
          app.appointImg = request.data.data.brand_info.apply_img;
          that.setData({
            confrimBgColot: app.curBgColor,
            confrimFtColot: app.curFtColor
          })
          if (request.data.data.brand_info.video_cover != '') {
            that.setData({
              posterImg: request.data.data.brand_info.video_cover
            })
          }
          else {
            that.setData({
              posterImg: '../../images/play-cover.jpg'
            })
          }
          that.setData({
            defaultDesc: request.data.data.brand_info.brand_desc
          })
          request.data.data.brand_info.brand_desc = request.data.data.brand_info.brand_desc.replace(/(\r\n)|(\n)/g, '<br>').split("<br>");
          for (var j = 0; j < request.data.data.brand_info.brand_desc.length; j++) {
            request.data.data.brand_info.brand_desc[j] = request.data.data.brand_info.brand_desc[j].replace(/\s+/g, "");
          }

          for (var i = 0; i < request.data.data.course_list.length; i++) {
            request.data.data.course_list[i].name = util.ellipsis(request.data.data.course_list[i].name, app.fontSize);
          }
          for (var i = 0; i < request.data.data.teacher_list.length; i++) {
            request.data.data.teacher_list[i].name = util.ellipsis(request.data.data.teacher_list[i].name, 12);
          }

          if (brandInfoData.hot_line2 != '' && brandInfoData.hot_line3 != ''){
            that.data.hotLineArr = [];
            that.data.hotLineArr.push(brandInfoData.hot_line);
            that.data.hotLineArr.push(brandInfoData.hot_line2);
            that.data.hotLineArr.push(brandInfoData.hot_line3);
          }
          if (brandInfoData.hot_line2 != '' && brandInfoData.hot_line3 == '') {
            that.data.hotLineArr = [];
            that.data.hotLineArr.push(brandInfoData.hot_line);
            that.data.hotLineArr.push(brandInfoData.hot_line2);
          }
          if (brandInfoData.hot_line3 != '' && brandInfoData.hot_line2 == '') {
            that.data.hotLineArr = [];
            that.data.hotLineArr.push(brandInfoData.hot_line);
            that.data.hotLineArr.push(brandInfoData.hot_line3);
          }
          console.log(that.data.hotLineArr)
          that.setData({
            brand_info: request.data.data.brand_info,
            teacher_list: request.data.data.teacher_list,
            teacher_count: request.data.data.teacher_list.length,
            course_list: request.data.data.course_list,
            course_count: request.data.data.course_list.length,
            brandescInfo: request.data.data.brand_info.brand_desc
          })
          if (that.data.defaultDesc.length > 60) {
            var infoDesc = that.data.defaultDesc;
            if (that.data.winW < 350) {
              var showBranddesc = util.ellipsis(infoDesc, 110) + "...";
            }
            if (that.data.winW > 400) {
              var showBranddesc = util.ellipsis(infoDesc, 140) + "...";
            }
            else {
              var showBranddesc = util.ellipsis(infoDesc, 122) + "...";
            }
            that.setData({
              showBranddesc: showBranddesc,
              showOne: true,
              showDown: false
            })
          }
          // substring 

          app.orgLogo = that.data.brand_info.logo;
          app.globalData.phone = that.data.brand_info.hot_line;
          app.globalData.brand_info = that.data.brand_info;
        } else {
          wx.showModal({
            title: '温馨提示',
            content: request.data.errmsg,
            confirmText: '确定',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              } else if (res.cancel) {
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
        console.log(request)
        if(request.data.errcode == 0) {
          that.setData({
            titleArr: request.data.list
          })
          console.log(that.data.titleArr.index_1)
        }
      }
    })
  },
  showAllInfo: function () {
    this.setData({
      showOne: false
    })
  },
  showOneInfo: function () {
    this.setData({
      showOne: true
    })
  },
  bindAppoint: function () {
    wx.navigateTo({
      url: '../appointment/appointment?org_logo=' + this.data.brand_info.logo
    });
  },
  bindShowAllCourses: function () {
    wx.navigateTo({
      url: '../courselist/courselist'
    });
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createVideoContext('showVideoControl')
  },
  bindShowvideo: function () {
    if (this.data.showvideoUrl == '') {
      this.setData({
        showVideoStatus: true,
        showvideoUrl: this.data.brand_info.video_url
      })
    }
    else {
      this.setData({
        showVideoStatus: true
      })
      this.bindplay();
    }

  },
  bindHideVideo: function () {
    this.setData({
      showVideoStatus: false,
    })
  },
  bindplay: function () {
    this.audioCtx.play()
  },
 
  bindpause: function () {
    //this.audioCtx.pause()
  },
  bindended: function () {
    this.setData({
      showVideoStatus: false
    })
  },
  bindShowAllTeachers: function () {
    wx.navigateTo({
      url: '../teacherlist/teacherlist'
    });
  },
  bindShowAllPic: function (e) {
    var len = e.currentTarget.dataset.len;
    if (len > 3) {
      this.setData({
        showMaxNum: Number(len + 1)
      })
    }
  },
  bindShowCourseInfo: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../courseinfo/courseinfo?id=' + id
    });
  },
  bindShowTeacherInfo: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../teacherinfo/teacherinfo?id=' + id
    });
  },
  bindShowInfo: function () {
    wx.navigateTo({
      url: '../brandintro/brandintro'
    });
  },
  openLocation: function (e) {
    var address = this.data.brand_info.poi_wx;
    wx.openLocation({
      longitude: Number(address.location.lng),
      latitude: Number(address.location.lat),
      name: address.titile,
      address: this.data.brand_info.address,
      scale: 20
    })

  },
  onShareAppMessage: function (res) {
    var that = this;
    var curVersion = this.data.sdkVersion;
    if (res.from === 'button') {
    }
    return {
      title: that.data.brand_info.name,
      path: 'pages/index/index?share=2',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  bindShowMoreCampus: function () {
    wx.navigateTo({
      url: '../campus/campus'
    });
  },
  onPullDownRefresh: function () {
    this.onShow();
  },
  showimage: function (e) {
    var piclist = this.data.brand_info.env;
    var currentpic = piclist[e.currentTarget.dataset.itemkey];
    wx.previewImage({
      current: currentpic,
      urls: piclist
    })
  }
})
