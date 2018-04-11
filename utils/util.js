var config = require('/../utils/configurl.js');

var reloadNumber = 0;

function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
  if (n == 0) {
    return '00';
  }
  else {
    n = n.toString();
    return n < 10 ? '0' + n : n;
  }
}

function addMonth(sDate, num) {
  var aYmd = sDate.split('-');
  var dt = new Date(aYmd[0], aYmd[1], aYmd[2]);

  dt.setMonth(dt.getMonth() + num);

  var y = dt.getFullYear();
  var m = dt.getMonth();
  var d = dt.getDate();
  if (m == 0) { m = 12; y = y - 1; }

  if (m < 10) m = '0' + m;
  if (d < 10) d = '0' + d;
  return y + '-' + m + '-' + d;
}
function getmonthlastday(time) {

  var myDate = new Date(time);
  return myDate.getDate()

}
function getmonthfirstday(time) {
  var date = new Date(time);
  var year = date.getFullYear() + '年';
  var month = formatNumber((date.getMonth() + 1)) + '月';
  return year + month;
}
function getLastDay(year, month) {
  var new_year = year;
  var new_month = month++;
  if (month > 12) {
    new_month -= 12;
    new_year++;
  }
  var new_date = new Date(new_year, new_month, 1);
  return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
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

function yearMonth(time) {
  var curDate = time.split("-");
  return curDate[0] + "-" + curDate[1];

}
function monthDay(time) {
  var curDate = time.split("-");
  return curDate[1] + "-" + curDate[2];

}

function yearmonthday(time) {
  var curDate = time.split("-");
  return curDate[0] + "年" + curDate[1] + "月" + curDate[2] + "日";
}
function yeartwomonthday(time) {
  var curDate = time.split("-");
  return curDate[0].substring(2, 4) + "年" + curDate[1] + "月" + curDate[2] + "日";
}
//返回以周一为一周开始的某天的星期位置
function getDayBeginWithMonday(date) {
  var date = new Date(date);
  var day = date.getDay() - 1;
  if (day == -1) {
    day = 6;
  }
  return day;
}

function cacheLocalArray(key, value) {
  value = value.trim();

  if (value.length == 0) {
    return;
  }

  var values = wx.getStorageSync(key);
  if (values == undefined || values.length == 0) {
    values = new Array();
    values.push(value);
  } else {

    var index = values.indexOf(value);
    if (index > -1) {
      return;
    }

    values.unshift(value);

    if (values.length > 3) {
      values.pop();
    }
  }

  wx.setStorageSync(key, values);
}


function getDateYMD(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return [year, month, day].map(formatNumber).join('-');
}

function getCacheLocalArray(key) {
  return wx.getStorageSync(key);
}

function removeCacheLocalArray(key) {
  wx.removeStorageSync(key);
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
//时间计算
function addMinute(houreMinute, addMin) {
  var temp = houreMinute.split(":");
  var hour = parseInt(addMin / 60);
  var min = addMin % 60;
  hour = Number(temp[0]) + hour;
  min = Number(temp[1]) + min;
  if (min >= 60) {
    hour = hour + parseInt(min / 60);
    min = min % 60;
  }
  if (min == 0) {
    return formatNumber(hour) + ":00";
  }
  else {
    return formatNumber(hour) + ":" + formatNumber(min);
  }
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
    fail: function () {

    }
  });
}
//

function refreshsessionandrun(wx) {
 
  wx.login({
    success: function (res) {
      if (res.code) {
        comrequest(
          config.configUrl + 'auth/login',
          res,
          "POST",
          function (request) {
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
                      config.configUrl + 'user/save',
                      userInfo,
                      "POST",
                      function (request) {
                        
                        if (request.data.code == undefined) {
                          wx.setStorageSync('user_info_config_data', request.data);
                          wx.setStorageSync('has_get_userinfo', 1);
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
                wx.setStorageSync('has_get_userinfo', 1);
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
          content: '请允许番茄拼课使用您的信息',
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
        console.log(111);
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
          config.configUrl + 'auth/login',
          res,
          "POST",
          function (request) {
            if (request.data.code) {
              fail(request);
            } else {
              wx.hideToast();
              if (!request.data.nickname) {
                wx.getUserInfo({
                  success: function (res) {
                    var userInfo = res;
                    comrequest(
                      config.configUrl + 'user/save',
                      userInfo,
                      "POST",
                      function (request) {
                        if (request.data.code == undefined) {
                          wx.setStorageSync('user_info_config_data', request.data);
                          wx.setStorageSync('has_get_userinfo', 1);
                          diyrequest(url, data, curtype, success, fail)
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
                wx.setStorageSync('has_get_userinfo', 1);
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
  formatTime: formatTime,
  formatNumber: formatNumber,
  refreshsessionandrun: refreshsessionandrun,
  getDayBeginWithMonday: getDayBeginWithMonday,
  uniqueArr: uniqueArr,
  removeArr: removeArr,
  addMonth: addMonth,
  getmonthfirstday: getmonthfirstday,
  getmonthlastday: getmonthlastday,
  yearMonth: yearMonth,
  cacheLocalArray: cacheLocalArray,
  getCacheLocalArray: getCacheLocalArray,
  removeCacheLocalArray: removeCacheLocalArray,
  getLastDay: getLastDay,
  getDateYMD: getDateYMD,
  monthDay: monthDay,
  objConcat: objConcat,
  ellipsis: ellipsis,
  addMinute: addMinute,
  yearmonthday: yearmonthday,
  comrequest: comrequest,
  yeartwomonthday: yeartwomonthday,
  diyrequest: diyrequest,
  checkSettingStatus: checkSettingStatus
};
