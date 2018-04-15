var config = require('/../utils/configurl.js');

var reloadNumber = 0;

function formatNumber(n) {
  if (n == 0) {
    return '00';
  }
  else {
    n = n.toString();
    return n < 10 ? '0' + n : n;
  }
}

//  数组去重
function uniqueArr(re) {
  var res = [];
  var json = {};
  for (var i = 0; i < re.length; i++) {
    if (!json[re[i]]) {
      res.push(re[i]);
      json[re[i]] = 1;
    }
  }
  return res;
}

// 移除指定值值
function removeArr(arr, val) {
  var index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

// 对象关联 key保持不同
function objConcat(obj1, obj2) {

  if (obj1 == obj2) {
    return;
  }
  for (var key in obj2) {

    if (!obj1[key]) {
      obj1[key] = obj2[key];
    } else {
      objConcat(obj1[key], obj2[key]);
    }
  }
}
//字段截取
function ellipsis(str, max) {
  var len = str.length,
    list = str.split(''),
    i, t = 0;
  for (i = 0; i < len; i++) {
    t++;
    if (/[^\x00-\x80]/g.test(list[i])) {
      t++;
    }
    if (t >= max) {
      return str.slice(0, i) + '..';
    }
  }
  return str;
}

function comrequest(url, postData, postType, doSuccess) {
  let cookie = wx.getStorageSync('cookie');
  let header = {};
  if (cookie) {
    let parts = [];
    let stoken = '';

    var storeCookie = [];
    for (var i in cookie) {

      storeCookie.push(i + "=" + cookie[i]);
    }

    header = { Cookie: storeCookie.join('; ') }
    if (cookie._xsrf) {
      header['X-Xsrftoken'] = cookie._xsrf
    }
  }
  wx.request({
    url: url,
    data: postData,
    method: postType,
    header: header,
    success: function (res) {
      if (typeof doSuccess == "function") {
        let newCookie = res.header['Set-Cookie']
        if (newCookie) {
          let parts = newCookie.split('; ')
          var cookie = wx.getStorageSync('cookie') || {}
          for (let part of parts) {
            let item = part.replace(/((HttpOnly|Secure),?)|(Path=.+,|Path=.+)/g, '')
            if (item && !item.startsWith('expires=') && !item.startsWith('Domain=')) {
              let pos = item.indexOf('=')
              if (pos !== -1) {
                cookie[item.substring(0, pos).trim()] = item.substring(pos + 1)
              }
            }
          }
          wx.setStorageSync('cookie', cookie);

        }

        doSuccess(res);
      }
    },
    fail: function (res) {
      console.log(res)
    }
  });
}
//

function refreshsessionandrun(wx) {

  wx.login({
    success: function (res) {
      if (res.code) {
        comrequest(
          config.configUrl + 'login',
          res,
          "POST",
          function (request) {
            console.log(request)
            if (request.data.code) {
              wx.removeStorageSync('history_records');
              checkSettingStatus();
            } else {
              wx.hideToast();
              if (!request.data.nickname) {
                wx.getUserInfo({
                  success: function (res) {
                    var userInfo = res;
                    comrequest(
                      config.configUrl + 'user',
                      userInfo,
                      "PUT",
                      function (request) {

                        if (request.data.code == undefined) {
                          wx.setStorageSync('user_info_config_data', request.data);
                        }
                        else {

                        }
                      }
                    )

                  },
                  fail: function (res) {
                    console.log("拒绝")
                    checkSettingStatus();
                  }
                })
              }
              else {
                wx.setStorageSync('user_info_config_data', request.data);
              }
            }
          }
        )
      } else {
      }
    }
  })
}

function checkSettingStatus(cb) {
  var that = this;
  wx.getSetting({
    success: function success(res) {
      var authSetting = res.authSetting;

      if (!res.authSetting['scope.userInfo']) {
        wx.showModal({
          title: '微信授权失败',
          content: '请允许"运势计算器"算使用您的信息',
          showCancel: false,
          confirmText: '允许',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: function success(res) {
                  console.log(res)
                  if (res.authSetting['scope.userInfo'] === false || res.authSetting == '') {
                    checkSettingStatus();
                  } else {
                    console.log("重新保存")
                    refreshsessionandrun(wx);
                  }
                }
              });
            }
          }
        })
      }

    }
  });
}

var refreshtokentime = 0
function diyrequest(url, data, curtype, success, fail, complete = function () { }) {
  comrequest(
    url,
    data,
    curtype,
    function (request) {
      if (request.data.code == 2001) {
        if (refreshtokentime >= 2) {
          fail(request)
        } else {
          refreshtokentime++
          refreshsessionanddiyrequest(url, data, curtype, success, fail)
        }
      } else {
        success(request);
      }
    }
  )
}

function refreshsessionanddiyrequest(url, data, curtype, success, fail) {

  wx.login({
    success: function (res) {
      if (res.code) {
        comrequest(
          config.configUrl + 'login',
          res,
          "POST",
          function (request) {
            console.log(111);
            console.log(request)
            if (request.data.code) {
              fail(request);
            } else {
              wx.hideToast();
              console.log(request.data.nickname)
              if (!request.data.nickname) {
                wx.getUserInfo({
                  success: function (res) {
                    var userInfo = res;
                    console.log(userInfo)
                    comrequest(
                      config.configUrl + 'user',
                      userInfo,
                      "PUT",
                      function (request) {
                        console.log(request)
                        if (request.data.code == undefined) {
                          wx.setStorageSync('user_info_config_data', request.data);
                          diyrequest(url, data, curtype, success, fail)
                        }
                        else {
                          console.log(2222)
                        }
                      }
                    )

                  },
                  fail: function (res) {
                    checkSettingStatus();
                  }
                })
              }
              else {
                diyrequest(url, data, curtype, success, fail)
              }
            }
          }
        )
      } else {
      }
    }
  })
}


module.exports = {
  uniqueArr: uniqueArr,
  removeArr: removeArr,
  ellipsis: ellipsis,
  comrequest: comrequest,
  diyrequest: diyrequest,
  checkSettingStatus: checkSettingStatus
};
