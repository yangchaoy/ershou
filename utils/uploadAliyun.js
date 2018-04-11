// const maxSize = 20 * 1024 * 1024; //动态设置上传图片
var config = require('/../utils/configurl.js');
const maxSize = wx.getStorageSync('upload_maxsize');
function random_string(str, len) {
  len = len || 32;
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = str.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
const uploadFile = function (params) {
  var sessionId = wx.getStorageSync('sessionId');
  var that = this;
  var orgId = wx.getStorageSync('init_org_id');

  //上传图片判断一次
  const filename = params.filePath.replace('wxfile://', '');
  const fileType = filename.replace(/^.+\./, '');
  const aliyunServerURL = '';
  const accessid = '';
  const signature = '';
  console.log(fileType)
  console.log(/(png|jpg|jpeg)/g.test(fileType))
  if (wx.getStorageSync('upload_accessid') != '' && params.uploadtype == 1) {
    const aliyunFileKey = wx.getStorageSync('upload_dir') + "org_" + orgId + random_string(filename, 36) + "." + fileType;
    wx.uploadFile({
      url: wx.getStorageSync('upload_host'),
      filePath: params.filePath,
      name: 'file',
      formData: {
        // 'dir': dir,
        'key': aliyunFileKey,
        'policy': wx.getStorageSync('upload_policyBase64'),
        'OSSAccessKeyId': wx.getStorageSync('upload_accessid'),
        'signature': wx.getStorageSync('upload_signature'),
        'success_action_status': '200',
      },
      success: function (res) {
        if (res.statusCode != 200) {
          if (params.fail) {
            params.fail(res)
          }
          return;
        }
        if (params.success) {
          params.success(aliyunFileKey);
        }
      },
      fail: function (err) {
        err.wxaddinfo = aliyunServerURL;
        if (params.fail) {
          params.fail(err)
        }
      },
    })
  }
  else {
    if (!/(png|jpg|jpeg|mp4)/.test(fileType)) {
      wx.showModal({
        title: '温馨提示',
        content: '请上传正确格式的图片视频(png、jpg、jpeg图片，mp4格式视频)',
        confirmText: '确定',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.hideToast();
          }
        }
      })
    }
    else {
      
      wx.request({
        url: config.configUrl + '/api/get_aliyun_oss_policy_json.php',
        data: { 'session_id': sessionId, 'filetype': params.uploadtype },
        header: {},
        method: 'GET',
        success: function (res) {
          if (res.data.code == 0) {
            var data = JSON.parse(res.data.data);
            params.dir = data.dir;
            const aliyunFileKey = params.dir + "org_" + orgId + random_string(filename, 36) + "." + fileType;
            const aliyunServerURL = data.host;
            const accessid = data.accessid;
            const policyBase64 = data.policy;
            const signature = data.signature;
            const dir = data.dir;
            wx.setStorageSync('upload_host', aliyunServerURL);
            wx.setStorageSync('upload_accessid', accessid);
            wx.setStorageSync('upload_policyBase64', policyBase64);
            wx.setStorageSync('upload_signature', signature);
            wx.setStorageSync('upload_dir', dir);
            
            wx.uploadFile({
              url: aliyunServerURL,
              filePath: params.filePath,
              name: 'file',
              formData: {
                // 'dir': dir,
                'key': aliyunFileKey,
                'policy': policyBase64,
                'OSSAccessKeyId': accessid,
                'signature': signature,
                'success_action_status': '200',
              },
              success: function (res) {
                if (res.statusCode != 200) {
                  if (params.fail) {
                    params.fail(res)
                  }
                  return;
                }
                if (params.success) {
                  params.success(aliyunFileKey);
                }
              },
              fail: function (err) {
                err.wxaddinfo = aliyunServerURL;
                if (params.fail) {
                  params.fail(err)
                }
              },
            })

          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  }

}

module.exports = uploadFile;