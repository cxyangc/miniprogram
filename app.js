//app.js
import { clientInterface } from "/public/clientInterface.js";
import { dellUrl } from "/public/requestUrl.js";

App({
    // clientUrl: 'https://www.aikucun.xyz/chainalliance/',  // 链接地址
     // clientUrl: 'http://10.1.1.15:3000/chainalliance/',  // 链接地址
     //clientUrl: 'http://192.168.30.92:3000/chainalliance/',  //勇哥ip 链接地址
    //  clientUrl: 'http://127.0.0.1:3000/chainalliance/',  // 本地链接地址
    //  clientUrl: 'http://192.168.40.180:3000/chainalliance/',  // 本地ip 链接地址
    // clientUrl: 'http://www2.aikucun.xyz/chainalliance/',
     clientUrl: 'https://mini.sansancloud.com/chainalliance/',

    /**
     *   切换项目的开关 ↓↓↓↓↓
     */
    clientNo: 'jianzhan',   //自定义的项目的名称。
    clientName: '',
    more_scene: '', //扫码进入场景   用来分销
    shareParam: null,//分享页面参数

    miniIndexPage: '',
    setting: null,  // 全局设置
    loginUser: null, //登陆返回的个人信息
    cookie: null,
    shopOpen: null, // 店铺营业时间-开关

    cart_offline: [],
    //addr:null,

    payItem: null, //下单的时候传过去的
    userSign: null, //账号密码
    EditAddr: null,//传值的
    richTextHtml: '',
    productParam: null,//传值的
    //  customPageJson:null,//page的动态组件json
    header: {
        'content-type': 'application/json' // 默认值
    },
    headerPost: {
        'content-type': 'application/x-www-form-urlencoded'
    },

    successOnlaunch: false,
    /* 页面影藏 */
    appHide: false,
    onHide: function (e) {
        console.log('hide')
        console.log(e)

    },
    onShow: function (e) {
        let that=this
        console.log('show')
        console.log("=======eeeee======",e)
        if (e.scene === "1011" || e.scene === "1012" || e.scene === "1013" || e.scene === "1047") {
          this.appHide = true
          this.clientNo = e.query.platformNo;
        }
        /* let pagePath = e.path
        if(this.appHide){
          this.appHide = false
        } */ 
    },
    onLaunchOptions: {},
    /* 第一次加载 */
    onLaunch: function (options) {
        this.onLaunchOptions = options
        let that = this

        console.log('------onlauch------')
        console.log(options)
        /* 第三方配置加载 clientNo */
        /*
        wx.getExtConfig({
          success: function (res) {
            console.log('第三方配置')
            console.log(res)
            if (res.extConfig && res.extConfig.clientNo) {
              console.log(res.extConfig)
              that.clientNo = res.extConfig.clientNo
            }
            that.clientNo = 'xianhua'
          },
          complete: function (res) {

          }
        })*/

      
        this.getSdkVersion()
        let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
        if (extConfig.clientNo) {
            that.clientNo = extConfig.clientNo
        }
        console.log('===' + this.clientNo + '====')
        console.log("options", this.onLaunchOptions)
        let inputPlatformNo = this.onLaunchOptions.query.platformNo;
        if (!!inputPlatformNo) {
            this.clientNo = inputPlatformNo
        }
        let more_scene = decodeURIComponent(this.onLaunchOptions.scene)

        if (more_scene) {
            this.more_scene = more_scene
        }
        console.log("clinetNo:" + this.clientNo+"  more_scene:"+more_scene)
        that.loadFirstEnter(more_scene)
    },

    timer: 0,
    // 确保onLaunch事件完成后再开始调用其他函数
    promiseonLaunch: function (self) {
        let that = this
        console.log('promiseonLaunch')
        if (!!this.setting) {
            self.onLoad()
        }
        else {
            that.timer = setTimeout(function () {
                that.promiseonLaunch(self);
            }, 500);
        }
    },

    //第一次登录加载的函数
    loadFirstEnter: function (more_scene) {
        this.getSetting()
        this.wxLogin(more_scene)
    },
    loadScene: function (inputPlatformNo) {
        this.clientNo = inputPlatformNo
    },
    globalData: {
        userInfo: null,
        sansanUser: null,
        sysWidth: wx.getSystemInfoSync().windowWidth, //图片宽度
        sysHeight: wx.getSystemInfoSync().windowHeight,
    },
    toIndex: function () {
        console.log('首页叫做：' + this.miniIndexPage)

        //这个需要注意  switchTab  和  redirectTo

        if (this.miniIndexPage) {
            wx.switchTab({
                url: '/pageTab/' + this.miniIndexPage + '/index',
            })
        } else {
            wx.switchTab({
                url: '/pageTab/custom_page_index/index',
            })
        }


    },

    echoErr: function (errMessage) {
        wx.showToast({
            title: errMessage,
            image: '/images/icons/tip.png',
            duration: 2000
        })
    },
    //加载失败处理
    loadFail: function () {
        let that = this
        /*
        wx.showModal({
          title: '提示',
          content: '加载失败，重新加载',
          success: function (res) {

            if (res.confirm) {
              that.toIndex()
            } else if (res.cancel) {

            }
          }
        })*/
        wx.showToast({
            title: "加载失败",
            image: '/images/icons/tip.png',
            duration: 2000
        })
    },
    loadLogin: function (e) {
        wx.showModal({
            title: '提示',
            content: '用户未登录',
            success: function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/login_wx/index'
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    //检查是否已经登录
    checkIfLogin: function () {

        if (this.loginUser) {
            console.log('已经登录了')
            return true
        } else {
            console.log('未登录')

            wx.showModal({
                title: '提示',
                content: '用户未登录',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/login_wx/index'
                        })
                    } else if (res.cancel) {

                    }
                }
            })
            return false
        }

    },
    //检查商家开店？
    checkShopOpenTime: function () {
        let that = this
        let shopBean = this.setting.platformSetting.defaultShopBean
        let nowTime = {
            hour: '',
            minutes: ''
        }
        let myDate = new Date();
        nowTime.hour = myDate.getHours()
        nowTime.minutes = myDate.getMinutes()
        let myTime = ''
        if (nowTime.minutes < 10) {
            myTime = Number(nowTime.hour + '.0' + nowTime.minutes)
        } else {
            myTime = Number(nowTime.hour + '.' + nowTime.minutes)
        }
        if (myTime < Number(shopBean.serviceStartTime) || myTime > Number(shopBean.serviceEndTime)) {
            wx.showModal({
                title: '不是营业时间',
                content: '营业时间为' + shopBean.serviceStartTime + '-' + shopBean.serviceEndTime,
                success: function (res) {
                    if (res.confirm) {
                        that.toIndex()
                    } else if (res.cancel) {

                    }
                }
            })
            return false
        } else {
            return true
        }
    },
    /* 处理url的函数，放到app里吧 */
    AddClientUrl: function (url, params, method, random, noToken) {
        let loginToken = ''

        if (noToken || (!this.loginUser || !this.loginUser.platformUser || !this.loginUser.platformUser.loginToken)) {
            loginToken = ''
        } else {
            loginToken = this.loginUser.platformUser.loginToken
        }
        var returnUrl = dellUrl(url, params, method, random, loginToken)
        returnUrl.url = this.clientUrl + this.clientNo + returnUrl.url
        return returnUrl;
    },
    /* 解析LinkUrl */
    getUrlParams: function (url) {
        console.log('------getUrlParams--------')
        console.log(url)

        let theResult = {
            url: '',
            param: ''
        }
        if (url.indexOf('?') != -1) {
            let str2 = url.substr(0, url.indexOf('?') - 5);
            let str3 = url.substr(url.indexOf('?'));
            theResult.url = str2
            theResult.param = str3
        }
        if (url.indexOf('?') == -1) {
            let str2 = url.substr(0, url.indexOf('.'))
            let str3 = ''
            theResult.url = str2
            theResult.param = str3
        }
        return theResult
    },
    getSpaceStr: function (str, p) {
        let theResult = {
            str1: '',
            str2: ''
        }
        if (str.indexOf(p) != -1) {
            let str2 = str.substr(0, str.indexOf(p));
            let str3 = str.substr(str.indexOf(p) + 1);
            theResult.str1 = str2
            theResult.str2 = str3
        }
        return theResult
    },
    /* 转换成str 带？*/
    jsonToStr: function (json) {
        var returnParam = "?"
        var str = [];
        for (var p in json) {
            str.push(p + "=" + json[p]);
            //str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
        }
        returnParam += str.join("&")
        console.log(returnParam)
        return returnParam
    },
    // 不带问号 过滤loginTocken
    jsonToStr2: function (json) {
        var returnParam = ""
        var str = [];
        for (var p in json) {
            if (p != 'loginToken') {
                str.push(p + "=" + json[p]);
            }
        }
        returnParam += str.join("&")
        console.log(returnParam)
        return returnParam
    },


    //link事件   绑定导向对应的控件上
    linkEvent: function (linkUrl) {
        if (!linkUrl) {
            return
        }
        let urlData = this.getUrlParams(linkUrl)
        let If_Order_url = urlData.url.substr(0, 10)
        console.log('-----toGridLinkUrl---------')
        console.log(urlData)
        console.log(If_Order_url)

        if (linkUrl.substr(0, 3) == 'tel') {
            wx.navigateTo({
                url: '/pages/custom_page_contact/index',
            })
        }
        else if (linkUrl.substr(0, 12) == 'custom_page_') {
            var resultUrl = linkUrl.substring(12, linkUrl.length - 5)
            if (urlData.param == '') {
                urlData.param = '?'
            }
            wx.navigateTo({
                url: '/pages/custom_page/index' + urlData.param + '&Cpage=' + resultUrl,
            })
        }
        else if (If_Order_url == 'order_list') {
            wx.navigateTo({
                url: '/pages/' + 'order_list_tab' + '/index' + urlData.param,
            })
        }
        else if (linkUrl.substr(0, 15) == 'product_detail_') {
            let productId = linkUrl.replace(/[^0-9]/ig, "");
            wx.navigateTo({
                url: '/pages/productDetail/index?id=' + productId + "&addShopId=236",
            })
        }
        else if (urlData.url == 'shop_map') {
            this.openLocation()
        }
        else {
            wx.navigateTo({
                url: "/pages/" + urlData.url + "/index" + urlData.param,
            })
        }
    },
    checkLogin: function () {
        //let that = this
        if (!this.loginUser) {
            this.wxLogin()
        }
    },
    /* 检查是否过期 */
    checkSession: function () {
        let that = this
        wx.checkSession({
            success: function () {

                console.log('session 未过期，并且在本生命周期一直有效')
                wx.getStorage({
                    //拿cookie
                    key: 'cookie',
                    success: function (res) {
                        that.cookie = res.data
                        that.header = {
                            'content-type': 'application/json', // 默认值
                            'Cookie': res.data
                        }
                        that.headerPost = {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Cookie': res.data
                        }
                    }
                })
                wx.getStorage({
                    key: 'loginUser',
                    success: function (res) {
                        that.loginUser = res.data
                    }
                })
            },
            fail: function () {
                //登录态过期
                console.log('登录态过期')

                that.wxLogin()
            }
        })
    },
    /* 设置cookie */
    setCookie: function (cookie) {
        this.cookie = cookie
        this.header = {
            'content-type': 'application/json', // 默认值
            'Cookie': cookie
        }
        this.headerPost = {
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
        }
    },
    //存用户信息
    setloginUser: function (loginUser, cookie) {
        //console.log('--------setloginUser----------')
        //console.log(loginUser)
        //console.log(cookie)

        if (loginUser) {
            wx.setStorage({
                key: "loginUser",
                data: loginUser
            })
        }
        if (cookie) {
            wx.setStorage({
                key: "cookie",
                data: cookie
            })
        }


    },


    //获取已经登录了的用户信息和login时一样
    get_session_userinfo: function () {
        let customIndex = this.AddClientUrl("/get_session_userinfo.html", {}, 'post')
        let that = this
        wx.request({
            url: customIndex.url, //仅为示例，并非真实的接口地址
            data: customIndex.params,
            header: that.headerPost,
            success: function (res) {
                console.log('===========get_session_userinfo============')
                if (res.data.errcode == 0) {
                    console.log(res.data.relateObj)
                    that.loginUser = res.data.relateObj
                    that.setloginUser(res.data.relateObj)
                }

            },
            fail: function (res) {

            }
        })
    },

    //sentWxUserInfo 第一次登录给他设置头像
    sentWxUserInfo: function (loginJson) {
      console.warn("========sentWxUserInfo:loginJson=======", loginJson)
        let that = this
        let userInfo = this.globalData.userInfo
        wx.getUserInfo({
            success: function (res) {
                console.warn('--获取用户信息--')
                console.log(res.userInfo)
                userInfo = res.userInfo
                let infoParam = {
                    headimg: '',
                    nickname: '',
                    sex: ''
                }
                if (loginJson && loginJson.platformUser.telNo) {
                    console.error(loginJson.platformUser.telNo)
                    infoParam.telno = loginJson.platformUser.telNo
                } else {
                    infoParam.telno = ''
                }

                infoParam.headimg = userInfo.avatarUrl
                infoParam.nickname = userInfo.nickName
                infoParam.sex = userInfo.gender
                let customIndex = that.AddClientUrl("/change_user_info.html", infoParam, 'post')
                wx.request({
                    url: customIndex.url,
                    data: customIndex.params,
                    header: that.headerPost,
                    method: 'POST',
                    success: function (res) {
                        console.log('---change_user_info----- success-')
                        console.log(res.data)
                        if (res.data.errcode == 0) {
                            that.loginUser.nickName = userInfo.nickName;
                            that.loginUser.sex = userInfo.sex;
                            that.loginUser.userIcon = userInfo.avatarUrl;
                            console.log('-----第一次登录   传头像成功 --------')
                        } else {
                            console.log('-----第一次登录   传头像失败 --------')

                        }
                        that.get_session_userinfo()
                    },
                    fail: function (res) {
                        console.log('-----第一次登录   传头像失败 回调fail--------')
                        console.log()
                    },
                    complete: function (res) {

                    },
                })
            },
            fail: function (e) {
                console.log(e)
                wx.showModal({
                    title: '授权提示',
                    content: '取消用户授权可能导致部分功能不可用，请确认授权！',
                    cancelText: '拒绝',
                    confirmText: '去授权',
                    success: function (res) {
                        if (res.confirm) {
                            wx.openSetting({
                                success: (res) => {
                                    res.authSetting = {
                                        "scope.userInfo": true,
                                    }
                                    that.sentWxUserInfo(loginJson)
                                }
                            })
                        } else if (res.cancel) {

                        }
                    }
                })
            }
        })





    },
    getCaption: function (str1) {
        var str2 = (str1.match(/MINI_PLATFORM_USER_ID_(\S*)/))[1];
        return str2;
    },
    hasNoScope: false,
    changeUserBelong: function (more_scene) {
        let that = this
        console.error(more_scene)

        let parentPlatformUserId = this.getCaption(more_scene)
        console.error(parentPlatformUserId)
        let param_post = {}
        param_post.parentPlatformUserId = parentPlatformUserId
        var customIndex = that.AddClientUrl("/change_fx_user.html", param_post, 'post')

        wx.request({
            url: customIndex.url,
            data: customIndex.params,
            header: that.headerPost,
            method: 'POST',
            success: function (res) {
                console.warn('修改分销 -- 返回')
                console.log(res.data)
                if (res.data.errcode == 0) {
                    let loginUser = that.loginUser
                    loginUser.platformUser.mendian = res.data.relateObj.mendian
                }
            },
            fail: function (res) {
                that.loadFail()
            }
        })
    },
    /* 微信登录测试 */
    wxLogin: function (more_scene) {
      console.warn("===wxLogin===", more_scene)
        if (!more_scene || more_scene == 'undefined') {
            more_scene = '0'
        }
        console.log('--------------微信登录--------------')
        wx.showLoading({
            title: '登录中',
            mask: true
        })
        var that = this
        wx.login({//微信登入接口
            success: function (res) {
                console.log("=======wxCode======",res.code)
                if (res.code && res.code.indexOf('mock') == -1) {
                    //发起网络请求
                    let loginParam = {}
                    loginParam.code = res.code
                    loginParam.scene = more_scene
                    let customIndex = that.AddClientUrl("/wx_mini_code_login.html", loginParam, 'post')
                    wx.request({
                        url: customIndex.url,
                        data: customIndex.params,
                        header: that.headerPost,
                        method: 'POST',
                        success: function (e) {
                            if (e.data.errcode == 0) {
                              console.warn("===========e.data.errcode=============", e)
                                let header = e.header
                                let cookie = null
                                if (!!header['Set-Cookie']) {
                                    cookie = header['Set-Cookie']
                                }
                                if (!!header['set-cookie']) {
                                    cookie = header['set-cookie']
                                }
                                let loginJson = e.data.relateObj

                                that.setCookie(cookie)
                                that.setloginUser(e.data.relateObj, cookie)
                                console.log('登陆成功')
                                that.loginUser = e.data.relateObj
                                that.globalData.sansanUser = e.data.relateObj

                                wx.hideLoading()
                                wx.getSetting({//检查用户是否授权了
                                    success(res) {
                                      console.warn("======getSetting:res========",res)
                                        if (!res.authSetting['scope.userInfo']) {
                                            console.error('没有授权')
                                            that.hasNoScope = res.authSetting['scope.userInfo']
                                            that.sentWxUserInfo(loginJson)
                                            // wx.authorize({
                                            //   scope: 'scope.record',
                                            //   success() {
                                            //     // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                                            //     console.info('已授权')
                                            //     wx.startRecord()
                                            //   }
                                            // })
                                        }
                                    }
                                })
                                //that.get_session_userinfo()

                                if (!loginJson.platformUser.nickname) {
                                    // console.error('没有昵称调用上传接口')
                                    that.sentWxUserInfo(loginJson)
                                }
                                //console.error(loginJson.platformUser.mendian)
                                //  console.error('more_scene', more_scene)
                                if (!loginJson.platformUser.mendian && more_scene.indexOf("PLATFORM_USER_ID") > 0) {
                                    //console.error('more_scene',more_scene)
                                    that.changeUserBelong(more_scene)
                                }
                                // that.toIndex()
                            } else {
                                wx.hideLoading()

                                wx.showToast({
                                    title: '登录失败',
                                    image: '/images/icons/tip.png',
                                    duration: 2000
                                })
                            }
                        },
                        fail: function (e) {
                            console.log('----fail------')
                            console.log(e)

                            wx.showToast({
                                title: '登录失败',
                                image: '/images/icons/tip.png',
                                duration: 2000
                            })
                        }
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            },
            fail: function (res) {
                console.log('---------111111  fail----------')
                console.log(res)
            },
            complete: function (res) {
                console.log('---------111111  complete----------')
                console.log(res)
                wx.hideLoading()
            },
        });
    },
    //获取setting
    getSetting: function (self) {
        if (!self) {
            self = 0
        }
        console.log('**************************************', self)
        var settUrl = this.AddClientUrl("/get_platform_setting.html", {}, 'get', 1, 1)
        var that = this
        console.warn("======settUrl.url======", settUrl.url)
        //拿setting
        wx.request({
            url: settUrl.url, //仅为示例，并非真实的接口地址
            header: that.header,
            success: function (res) {
              console.log("====res====",res.data)
                if (res.data.platformSetting) {
                    that.clientName = res.data.platformSetting.platformName
                    if (res.data.platformSetting.categories) {//产品类别
                        let categories = res.data.platformSetting.categories
                        let allType = {}
                        allType.id = 'all'
                        allType.name = '全部'
                        allType.active = true
                        for (let i = 0; i < categories.length; i++) {
                            categories[i].active = false
                        }
                        categories.unshift(allType)
                    }
                }

                that.setting = res.data
                if (res.data.platformSetting.miniIndexPage) {
                    let miniIndexPage = that.getSpaceStr(res.data.platformSetting.miniIndexPage, '.')
                    that.miniIndexPage = miniIndexPage.str1
                } else {
                    that.miniIndexPage = 'custom_page_index'
                }

                if (!self) {

                } else {
                    self.setData({ setting: res.data })
                    self.setNavBar()
                }
                wx.hideLoading()//隐藏 loading 提示框
                return
                let ShopBean = res.data.platformSetting.defaultShopBean
                if (ShopBean.serviceStartTime) {

                }

                // 完成初次加载
                that.successOnlaunch = true

            },
            fail: function (res) {
                wx.hideLoading()//隐藏 loading 提示框
                that.loadFail()//获取失败
            }
        })
    },
    //微信内部地图
    openLocation: function () {
        console.log('---------打开地图-------')
        let markers = this.setting.platformSetting.defaultShopBean
        let lat = Number(markers.latitude)
        let lng = Number(markers.longitude)
        let name = markers.shopName
        let address = ''
        wx.getLocation({
            type: 'wgs84', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                console.log('11111')
                wx.openLocation({
                    latitude: Number(markers.latitude),
                    longitude: Number(markers.longitude),
                    scale: 28,
                    name: name,
                    address: address,
                    success: function (res) {
                        console.log(res)
                    },
                    fail: function (res) {
                        console.log(res)
                    }
                })
            }, fail: function (res) {
                console.log('22222')
                console.log(res)
            }
        })
    },

    //带参转发
    shareForFx: function (pageName, pageTitle, pageCode) {
        let that = this
        let AllCode = ''
        let fxCode = ''  //userId
        if (this.loginUser) {
            fxCode = 'scene=MINI_PLATFORM_USER_ID_' + this.loginUser.platformUser.id
        } else {
            fxCode = 'scene=MINI_PLATFORM_USER_ID_' + this.more_scene
        }
        if (!pageName) {
            pageName = 'index'
        }
        if (!pageTitle) {
            pageTitle = that.clientName
        }
        if (!pageCode) {
            pageCode = ''
            AllCode = fxCode
        } else {
            AllCode = fxCode + '&' + pageCode
        }
        return {
            title: pageTitle,
            path: '/pages/' + pageName + '/index?' + AllCode,
            success: function (res) {
            },
            fail: function (res) {
            }
        }
    },

    shareForFx2: function (pageName, pageTitle, pageCode, imageUrl) {
        //组合参数，交给custompage_index 解析
        // 组合参数所带

        let that = this


        let AllCode = ''
        let fxCode = ''  //userId
        if (this.loginUser) {
            fxCode = 'scene=MINI_PLATFORM_USER_ID_' + this.loginUser.platformUser.id
        }
        if (!pageName && !this.miniIndexPage) {
            if (!this.miniIndexPage) {
                pageName = 'custom_page_index'
            } else {
                pageName = this.miniIndexPage
            }
        }
        if (!pageTitle) {
            pageTitle = that.clientName
        }
        if (!pageCode) {
            pageCode = {}
        }
        pageCode.scene = 'MINI_PLATFORM_USER_ID_' + this.loginUser.platformUser.id
        pageCode.pageName = pageName

        AllCode = that.jsonToStr2(pageCode)

        console.log('转发出去的参数集合：   ' + AllCode)
        return {
            title: pageTitle,
            path: '/pageTab/index/index?' + AllCode,
            imageUrl: imageUrl,
            success: function (res) {
            },
            fail: function (res) {
            }
        }
    },
    toFix: function (money) {
        money = money.toFixed(2)
        return money
    },
    lookBigImage: function (url, urls) {
        if (!url) {
            return
        }
        if (!urls) {
            urls = []
            urls.push(url)
        }
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    SDKVersion: '',
    getSdkVersion: function () {
        //获取版本信息
        let that = this
        wx.getSystemInfo({
            success: function (res) {
              console.log("=======getSystemInfo=========",res.SDKVersion)
                that.SDKVersion = res.SDKVersion
            }
        })
    },
    compareVersion: function (v1, v2) {
        //判断版本大小
        v1 = v1.split('.')
        v2 = v2.split('.')
        var len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i])
            var num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }

        return 0
    }
})
