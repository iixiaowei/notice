var app = getApp()

Page({
    data: {
        imageObject: {},
        arrayPics: {}
    },
    onLoad: function (options) {
        /*this.setData({
            title: options.title
        })*/
        var that = this

        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.getUserInfo({
                        success: function (res) {
                            var objz = {};
                            objz.avatarUrl = res.userInfo.avatarUrl;
                            objz.nickName = res.userInfo.nickName;
                            //console.log(objz);
                            wx.setStorageSync('userInfo', objz);//存储userInfo
                        }
                    });
                    var appid = 'wxab32083b8acc5b8f'; //填写微信小程序appid
                    var secret = '66e2e87f32516d988b5db1e28ef8a1e8'; //填写微信小程序secret
                    var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code';
                    wx.request({
                        url: "https://api.nndeal.com/index.php?c=weixin&a=getOpenId",
                        data: {js_code: res.code},
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        // header: {}, // 设置请求的 header
                        success: function (res) {
                            wx.setStorageSync('openid', res.data.openid);//存储openid
                            console.log(wx.getStorageSync('openid'));
                        }
                    });
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });





    }
});