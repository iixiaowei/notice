var app = getApp()
var sourceType = [['camera'], ['album'], ['camera', 'album']]
Page({
    data: {
        imageObject: {},
        arrayPics: {},
        imageids: '',
        uploadImages: '',
        imageUrl: '',
        defaultSize: 'default',
        primarySize: 'default',
        warnSize: 'default',
        disabled: false,
        plain: false,
        loading: false,
        qiniuToken: '',
        motto: '测试小程序',
        array: ['美国', '中国', '巴西', '日本'],
        objectArray: [
            {
                id: 0,
                name: '美国'
            },
            {
                id: 1,
                name: '中国'
            },
            {
                id: 2,
                name: '巴西'
            },
            {
                id: 3,
                name: '日本'
            }
        ]

    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        console.log(e.detail);

        this.setData({
            index: e.detail.value,
            source_id: e.detail.value
        })
    },
    formBindsubmit: function (e) {
        console.log(e.detail);
        var that = this;
        if (e.detail.value.source_id == '') {
            wx.showToast({
                title: '发送给不能为空',
                icon: 'loading',
                width: '100%',
                duration: 1500
            })

            setTimeout(function () {

                wx.hideToast()

            }, 2000)
            return false;
        } else if (e.detail.value.title == '') {
            wx.showToast({
                title: '标题不能为空',
                icon: 'loading',
                width: '100%',
                duration: 1000
            })

            setTimeout(function () {

                wx.hideToast()

            }, 1500)
            return false;
        } else if (e.detail.value.content == '') {
            wx.showToast({
                title: '内容不能为空',
                icon: 'loading',
                width: '100%',
                duration: 1000
            })

            setTimeout(function () {

                wx.hideToast()

            }, 1500)
            return false;
        }


        wx.request({
            url: 'https://api.nndeal.com/index.php?c=weixin&a=donotify',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
                title: e.detail.value.title,
                content: e.detail.value.content,
                source_id: e.detail.value.source_id,
                imageids: e.detail.value.imageids,
                myopenid: wx.getStorageSync('openid')
            },
            success: function (res) {

                console.log(res);


                if (res.data.status == 0) {

                    console.log(that + "--");

                    that.setData({
                        title: '',
                        content: '',
                        source_id: '',
                        imageids: '',
                        arrayPics: {},
                        imageUrl: '',
                        index: '',
                    })
                    wx.setStorageSync('notify_pics', '');
                    wx.setStorageSync('notify_pics_ids', '');

                    wx.showToast({
                        title: res.data.info,
                        icon: 'success',
                        duration: 1500
                    })


                } else {
                    wx.showToast({
                        title: res.data.info,
                        icon: 'error',
                        duration: 1000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '服务器网络错误',
                    icon: 'loading',
                    duration: 1500
                })
            }
        })


    },
    onLoad: function () {
        var that = this;
        wx.setStorageSync('notify_pics', '');
        wx.setStorageSync('notify_pics_ids', '');
        //wx.setStorageSync('openid','');
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


        wx.request({
            url: "https://api.nndeal.com/index.php?c=weixin&a=getClassInfo",
            data: {openid: wx.getStorageSync('openid')},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {

                that.setData({
                    array: res.data.dataName,
                    objectArray: res.data.data
                })
                console.log(res.data);

            }
        });


        wx.setNavigationBarTitle({
            title: '新建通知'
        })


        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#545454',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        })

        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            console.log(userInfo);
            //更新数据
            that.setData({
                userInfo: userInfo
            })

        })

    },
    didPressChooesImage: function () {
        var that = this;

        wx.chooseImage({
            sourceType: ['album', 'camera'],
            count: 1,
            success: function (res) {


                wx.request({
                    url: 'https://api.nndeal.com/index.php?c=weixin&a=getQiniuToken',
                    data: {
                        x: '',
                        y: ''
                    },
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function (res) {


                        console.log(res.data.token);
                        that.setData({
                            qiniuToken: res.data.token
                        })

                        wx.setStorageSync('qiniuToken', res.data.token)

                    }
                })

                console.log('token:' + wx.getStorageSync('qiniuToken'));

                var filePath = res.tempFilePaths[0];
                var fileName = 'wx' + Math.random().toString(36).substr(2);


                wx.uploadFile({
                    url: 'http://up-z0.qiniu.com',
                    filePath: filePath,
                    name: 'file',
                    formData: {
                        'token': wx.getStorageSync('qiniuToken'),
                        key: fileName
                    },
                    success: function (res) {
                        console.log(res.data);


                        wx.showToast({
                            title: "图片上传成功",
                            icon: 'success',
                            duration: 700
                        })

                        var dataString = res.data;
                        var dataObject = JSON.parse(dataString);
                        //do something
                        var imageUrl = 'http://oud28na46.bkt.clouddn.com/' + dataObject.key
                        dataObject.imageURL = imageUrl;


                        var jsonStr = [];
                        jsonStr = wx.getStorageSync('notify_pics');
                        if (jsonStr == '') {
                            jsonStr = [];
                        }

                        jsonStr.push({imageUrl: imageUrl});

                        wx.setStorageSync('notify_pics', jsonStr);
                        var  pics = wx.getStorageSync('notify_pics');
                        console.log("pics::::" + pics);

                        var imageidsStr = '';
                        imageidsStr = wx.getStorageSync('notify_pics_ids');
                        if (imageidsStr == '') {
                            imageidsStr = dataObject.key;
                        } else {
                            imageidsStr += "," + dataObject.key;
                        }
                        wx.setStorageSync('notify_pics_ids', imageidsStr);

                        that.setData({
                            arrayPics: jsonStr,
                            imageUrl: imageUrl,
                            imageids: imageidsStr
                        })

                        console.log(dataObject);
                    },
                    fail: function (error) {
                        console.error(error);
                    }
                })


            }
        });


    }


});