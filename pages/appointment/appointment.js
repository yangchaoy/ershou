// pages/appointment/appointment.js
var app = getApp();
var util = require('/../../utils/util.js');
Page({
  data: {
    loading: false,
    selectStore: '请选择校区',
    selectCourse: '请选择课程',
    courseindex: 0,
    index: 0,
    courseOneindex: 0,
    selectOneCourse: '请选择课程',
    namecolor: '#767676',
    phonecolor: '#767676',
    storecolor: '#767676',
    coursecolor: '#767676',
    name: '请输入预约姓名',
    phone: '请输入您的手机号',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    selectNoCourse: '暂无课程',
    selectNoStore: '暂无校区',
    selectCourseStatus: 0,
    selectOneCourseStatus: 0,
    selectStoreStatus: 0
  },
  bindnameinput: function (e) {
    var curVal = e.detail.value.trim();
    this.setData({
      name: e.detail.value.trim()
    })
    if (curVal.length == 0) {
      this.setData({
        namecolor: '#767676'
      })
    }
    else {
      this.setData({
        namecolor: '#767676'
      })
    }
  },
  bindnamefocus: function () {
    if (this.data.name == '请输入预约姓名') {
      this.setData({
        name: ''
      })
    }
  },
  bindnameblur: function () {
    if (this.data.name == '') {
      this.setData({
        name: '请输入预约姓名'
      })
    }
  },
  bindphoneinput: function (e) {
    var curVal = e.detail.value.trim();
    this.setData({
      phone: e.detail.value.trim()
    })
    if (curVal.length == 0) {
      this.setData({
        phonecolor: '#767676'
      })
    }
    else {
      this.setData({
        phonecolor: '#767676'
      })
    }
  },
  bindphonefocus: function () {
    if (this.data.phone == '请输入您的手机号') {
      this.setData({
        phone: ''
      })
    }
  },
  bindphoneblur: function () {
    if (this.data.phone == '') {
      this.setData({
        phone: '请输入您的手机号'
      })
    }
  },
  onLoad: function (options) {
    this.setData({
      brand_info: app.globalData.brand_info
    })
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
        if (request.data.errcode == 0) {
          var courseList = request.data.data.course_list,
            courseListArr = new Array(),
            storeList = request.data.data.store_list,
            storeListArr = new Array();
          var imgUrlArr = [];
          for (var i = 0; i < courseList.length; i++) {
            courseListArr.push(courseList[i].name);
            if (courseList[i].display_status == 0) {
              imgUrlArr.push(courseList[i].logo)
            }
          }
          for (var j = 0; j < storeList.length; j++) {
            storeListArr.push(storeList[j].name);
          }
          if (imgUrlArr.length == 0) {
            imgUrlArr.push('https://img.meiyuol.com/19/pc_19BwzSXY6KsW.jpg');
          }
          that.setData({
            imgUrls: imgUrlArr.slice(0, 6),
            courseListData: courseList,
            storeListData: storeList,
            course_list: courseListArr,
            store_list: storeListArr,
            courseOnelist: courseListArr
          })
          if (storeListArr.length == 1) {
            var storeListDataOne = storeList[0].course_list;
            var newCourseListArr = [];
            for (var j = 0; j < storeListDataOne.length; j++) {
              newCourseListArr.push(storeListDataOne[j].name);
            }
            that.setData({
              storeid: storeList[0].id,
              selectStore: storeList[0].name,
              selectStoreStatus: 1,
              courseOnelist: newCourseListArr
            })
            if (storeList[0].course_list.length == 1) {
              that.setData({
                courseid: storeList[0].course_list[0].id,
                selectOneCourse: storeList[0].course_list[0].name,
                selectCourse: storeList[0].course_list[0].name,
                selectCourseStatus: 0,
                selectOneCourseStatus: 0
              })
            }
          }

          if (wx.setNavigationBarColor) {
            wx.setNavigationBarColor({
              frontColor: request.data.data.brand_info.base_color['fcolor'],
              backgroundColor: request.data.data.brand_info.base_color['bgcolor']
            })
          } else {

          }
          app.curBgColor = request.data.data.brand_info.base_color['bgcolor'];
          app.curFtColor = request.data.data.brand_info.base_color['fcolor'];
          app.appointImg = request.data.data.brand_info.apply_img;
          that.setData({
            confrimBgColot: app.curBgColor,
            confrimFtColot: app.curFtColor,
            appointImg: app.appointImg
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
              if (request.data.errcode == 0) {
                that.setData({
                  titleArr: request.data.list
                })
                if (that.data.selectOneCourse.indexOf("请选择") > -1) {
                  that.setData({
                    selectOneCourse: '请选择' + request.data.list.index_tab_4,
                    selectNoCourse: '暂无' + request.data.list.index_tab_4,
                    selectOneCourseStatus: 0
                  })
                }
                if (that.data.selectCourse.indexOf("请选择") > -1) {
                  that.setData({
                    selectCourse: '请选择' + request.data.list.index_tab_4,
                    selectNoCourse: '暂无' + request.data.list.index_tab_4,
                    selectCourseStatus: 0
                  })
                }
                if (that.data.selectStore.indexOf("请选择") > -1){
                  that.setData({
                    selectStore: '请选择' + request.data.list.index_tab_2,
                    selectNoStore: '暂无' + request.data.list.index_tab_2,
                    selectStoreStatus: 0
                  })
                }
                wx.setNavigationBarTitle({
                  title: request.data.list.index_tab_4
                })
              }
            }
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

  bindCancel: function () {
    wx.navigateBack()
  },
  bindPickerChange: function (e) {
    var that = this;
    this.setData({
      index: e.detail.value,
      selectStore: util.ellipsis(that.data.store_list[e.detail.value], 30),
      storeid: that.data.storeListData[e.detail.value].id,
      courseListData: that.data.storeListData[e.detail.value].course_list,
      selectCourse: '请选择' + that.data.titleArr.index_tab_4,
      selectStoreStatus: 1
    })
    var courseList = that.data.storeListData[e.detail.value].course_list,
      courseListArr = new Array();
    for (var i = 0; i < courseList.length; i++) {
      courseListArr.push(courseList[i].name);
    }
    that.setData({
      course_list: courseListArr
    })
    if (courseList.length == 1) {
      that.setData({
        courseid: courseList[0].id,
        selectCourse: courseList[0].name
      })
    }

  },
  bindPickerCourseChange: function (e) {
    var that = this;
    this.setData({
      courseindex: e.detail.value,
      selectCourse: util.ellipsis(that.data.course_list[e.detail.value], 30),
      courseid: that.data.courseListData[e.detail.value].id,
      selectCourseStatus: 1
    })
  },
  bindPickerCourseOneChange: function (e) {
    var that = this;
    this.setData({
      courseOneindex: e.detail.value,
      selectOneCourse: util.ellipsis(that.data.courseOnelist[e.detail.value], 30),
      selectCourse: util.ellipsis(that.data.courseOnelist[e.detail.value], 30),
      courseid: that.data.courseListData[e.detail.value].id,
      selectOneCourseStatus: 1
    })
  },
  selectTip: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        nametip: ''
      });
    }, 2000)
    this.setData({
      nametip: '提示：请先选择' + that.data.titleArr.index_tab_2+"!"
    });

  },
  formBindsubmit: function (e) {
    var that = this;
    setTimeout(function () {
      that.setData({
        nametip: ''
      });
    }, 2000)
    if (e.detail.value.name.trim().length == 0) {
      this.setData({
        nametip: '提示：学员名称不能为空！'
      });
      return false;
    }
    if (e.detail.value.phone.trim().length == 0) {
      this.setData({
        nametip: '提示：请输入手机号！'
      });
      return false;
    }
    if (e.detail.value.phone.trim().length > 0 && !/^1[3|4|5|7|8][0-9]\d{8}$/.test(e.detail.value.phone)) {
      this.setData({
        nametip: '提示：请输入正确的手机号！'
      });
      return false;
    }
    if (that.data.selectStore.indexOf("请选择") > -1) {
      this.setData({
        nametip: '提示：请先选择' + that.data.titleArr.index_tab_2 + "!"
      });
      return false;
    }
    if (that.data.selectCourse.indexOf("请选择") > -1 || that.data.selectCourse.indexOf("暂无") > -1) {
      this.setData({
        nametip: '提示：请先选择' + that.data.titleArr.index_tab_4 + "!"
      });
      return false;
    }
    // wx.showToast({
    //   title: '提交中,请稍后...',
    //   icon: 'loading',
    //   mask: true,
    //   duration: 0
    // });

    if (that.data.loading) {
      return false;
    }
    that.setData({
      loading: true
    })

    wx.request({
      url: app.globalData.extConfig.host + '/template/apply_audition.php',
      data: {
        org_id: app.globalData.extConfig.org_id,
        appid: app.globalData.extConfig.appid,
        template_id: app.globalData.extConfig.template_id,
        name: e.detail.value.name.trim(),
        phone: e.detail.value.phone.trim(),
        store_id: that.data.storeid,
        course_id: that.data.courseid,
        age: e.detail.value.age.trim()
      },
      method: 'POST',
      success: function (request) {
        if (request.data.errcode == 0) {
          // wx.navigateBack()
          wx.showModal({
            title: '温馨提示',
            content: that.data.titleArr.index_tab_4 + '成功',
            confirmText: '确定',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack();

              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        else {
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
        that.setData({
          loading: false
        })
      },
      complete: function (request) {
        wx.hideToast();
      }
    });
  }
})