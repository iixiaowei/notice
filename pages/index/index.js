//index.js
//获取应用实例
var app = getApp()
 
Page({
  data: {
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    motto: '测试小程序',
    setDisabled: function(e) {
    this.setData({
      disabled: !this.data.disabled
    })
  },
  setPlain: function(e) {
    this.setData({
      plain: !this.data.plain
    })
  },
  bindData:function(e){
    this.setData({ 
      school: ''
    })
    },
  getOpenId:function(e){
      
      wx.login({    
        success: function(res){   
            if(res.code) {  
                wx.getUserInfo({  
                    success: function (res) {  
                        var objz={};  
                        objz.avatarUrl=res.userInfo.avatarUrl;  
                        objz.nickName=res.userInfo.nickName;  
                        //console.log(objz);  
                        wx.setStorageSync('userInfo', objz);//存储userInfo  
                    }  
                });  
                var appid = 'wxab32083b8acc5b8f'; //填写微信小程序appid  
                var secret = '66e2e87f32516d988b5db1e28ef8a1e8'; //填写微信小程序secret  
                var l='https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&js_code='+res.code+'&grant_type=authorization_code';    
                wx.request({    
                    url: "https://api.nndeal.com/index.php?c=weixin&a=getOpenId",    
                    data: {js_code:res.code},    
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
                    // header: {}, // 设置请求的 header    
                    success: function(res){
                        wx.setStorageSync('openid', res.data.openid);//存储openid
                        console.log( wx.getStorageSync('openid') );
                        //return res.data.openid;
                    }    
                });  
            }else {  
                console.log('获取用户登录态失败！' + res.errMsg)  
            }            
        }    
      });   
     
      
      
  },
  setLoading: function(e) {
    this.setData({
      loading: !this.data.loading
    })
  },
    userInfo: {
        'nickName':'kevin'
      },
    iconSize: [20, 30, 40, 50, 60, 70],
    iconColor: [
      'red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple'
    ],
    iconType: [
      'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
    ]
  },
  newClass:function(e){
    //console.log( 'newClass' )
  },
  newTeam:function(e){
    wx.redirectTo({
      url: '/pages/team/team'
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  formBindsubmit:function(e){
      var that = this;
     if( e.detail.value.school=='' ){
        wx.showToast({
          title: '学校不能为空',
          icon: 'loading',
          width:'100%',
          duration: 1500
        })

        setTimeout(function(){
  
            wx.hideToast()
  
          },2000)
        return false;
     }else if( e.detail.value.grade==''){
       wx.showToast({
          title: '年级不能为空',
          icon: 'loading',
          width:'100%',
          duration: 1500
        })

        setTimeout(function(){
  
            wx.hideToast()
  
          },2000)
        return false;
     }
     openid = wx.getStorageSync('openid');
     if(openid==""){
      that.getOpenId();
     }
      
      console.log( openid+"save" );
      
     wx.request({  
            url: 'https://api.nndeal.com/index.php?c=weixin&a=doclass',  
            header: {
                    "Content-Type": "application/x-www-form-urlencoded"  
                },
            method: "POST",
            data:{
                school:e.detail.value.school,
                grade:e.detail.value.grade,
                classes:e.detail.value.classes,
                username:e.detail.value.username,
                teacher:e.detail.value.teacher,
                myopenid: openid    
              },
            success: function(res) {
              
              console.log(  res  );
               
                
               
              if(res.data.status == 0){
                
                  console.log( that+"--" );
                  
                  that.setData({
                    school:'',
                    grade:'',
                    classes:'',
                    username:'',
                    teacher:0
                    
                  })
                  
                            
                  wx.showToast({
                    title: res.data.info,
                    icon: 'success',
                    duration: 1500
                  })
                  
                  
                  
              }else{
                  wx.showToast({
                    title: res.data.info,
                    icon: 'error',
                    duration: 1000
                  })
              }
            },
          fail:function(){
                        wx.showToast({
                          title: '服务器网络错误',    
                          icon: 'loading',
                          duration: 1500
                        })
           }   
        })
  },
  onLoad: function () {
    
     
     
     wx.login({    
        success: function(res){   
            if(res.code) {  
                wx.getUserInfo({  
                    success: function (res) {  
                        var objz={};  
                        objz.avatarUrl=res.userInfo.avatarUrl;  
                        objz.nickName=res.userInfo.nickName;  
                        //console.log(objz);  
                        wx.setStorageSync('userInfo', objz);//存储userInfo  
                    }  
                });  
                var appid = 'wxab32083b8acc5b8f'; //填写微信小程序appid  
                var secret = '66e2e87f32516d988b5db1e28ef8a1e8'; //填写微信小程序secret  
                var l='https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&js_code='+res.code+'&grant_type=authorization_code';    
                wx.request({    
                    url: "https://api.nndeal.com/index.php?c=weixin&a=getOpenId",    
                    data: {js_code:res.code},    
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
                    // header: {}, // 设置请求的 header    
                    success: function(res){
                        wx.setStorageSync('openid', res.data.openid);//存储openid
                        console.log( wx.getStorageSync('openid') );
                    }    
                });  
            }else {  
                console.log('获取用户登录态失败！' + res.errMsg)  
            }            
        }    
      });   
    
    
    
   wx.setNavigationBarTitle({
     title: '新建班级'
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
    app.getUserInfo(function(userInfo){
      console.log(  userInfo );
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      
    })

    
    
    
    
          var testData = '';
           wx.request({
                url: 'https://api.nndeal.com/index.php?c=weixin&a=test',
                data: {
                   x: '' ,
                   y: ''
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                 console.log( res.data.test )
                 testData = res.data.test 
                 
                 
                 that.setData({
                      testInfo:res.data
                  })
                 
                 
                 
                }
           })
    
    
    
  }
})
