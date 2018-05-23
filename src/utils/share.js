
//---------------------------
var urlContent={};
function  shareUrl(Content){

            urlContent = Content;
    
}

//－－－－－－－－－－－－调取后台接口，为分享做准备－－－－－－－

function initWxJSSDK(host,$) {
    var ua=navigator.userAgent.toLowerCase();
    //－－－－－－－－－－－微信环境用微信登录－－－－－－－－－－
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
    var thisPageUrl = location.href;
        $.ajax({
            type: "get",
            url: host+"/appuser/thirdlogin/wx/share",
            data: {
                pageUrl: thisPageUrl
            },
            beforeSend: function () {
            },
            success: function (json) {
                var signJson = JSON.parse(json);
                // if (json.result == "ok") {
                    var 
                        appid = signJson.appId,
                        timestamp = signJson.timestamp,
                        noncestr = signJson.noncestr,
                        signature = signJson.signature;
                        // url = signJson.url;
                        
                    //初始化微信sdk
                    wx.config({
                        debug: false,
                        appId: appid,
                        timestamp: timestamp,
                        nonceStr: noncestr,
                        signature: signature,
                        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "chooseWXPay", "checkJsApi", "chooseImage", "previewImage", ]
                    });
                    // console.log(json.data)
                // } else {
                //     alert(json.errormsg);
                // }
            },
            error: function () {
            },
            complete: function () {
            }
        });
    }
}

if(wx != undefined){
    wx.ready(function () {
        // console.log(urlContent);

        //判断当前客户端版本是否支持指定JS接口
        wx.checkJsApi({
            jsApiList: [
                "onMenuShareTimeline",
                 "onMenuShareAppMessage", 
                 "chooseWXPay", 
                 "checkJsApi", 
                 "chooseImage",
                 "previewImage",
            ],
            success: function () {
                // console.log(res);
                // console.log(urlContent);
            }
        });

        //朋友圈
        wx.onMenuShareTimeline({
            title: urlContent.data.share_content, // 分享标题
            link: urlContent.method, // 分享链接
            imgUrl: urlContent.data.share_icon, // 分享图标
            dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
            trigger: function () {
                //shareLog()
                //alert('用户点击分享到朋友圈');
            },
            success: function () {

                //shareLog()
            },
            cancel: function () {
                //alert('已取消');
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });

        //分享给朋友
        wx.onMenuShareAppMessage({
            title: urlContent.data.share_title, // 分享标题
            desc: urlContent.data.share_content, // 分享描述
            link: urlContent.method, // 分享链接
            imgUrl: urlContent.data.share_icon, // 分享图标
            type: "link", // 分享类型,music、video或link，不填默认为link
            dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                //alert("成功")
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });

    });
}

function hideOptionMenu(){
    wx.hideOptionMenu();  //隐藏微信的分享按钮
    
}
wx.hideMenuItems({
    menuList: [] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
});

export { shareUrl,initWxJSSDK,hideOptionMenu };