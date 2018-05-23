import "../../utils/main750";
import "../../styles/base.css";
import "../../styles/mobile.css";
import "./invitationFriend.css";
import "../../styles/Picture.scss"

import { baseUrl,oGetVars } from "../../utils/host";
import { loadingHide,lazOpen,lazNoting }  from "../../utils/loading";
import {shareUrl,initWxJSSDK} from '../../utils/share'


var controller = (function ($, window, document) {
    var isAndroid = window.SuperStudent ? true:false,//根据安卓的方法来判断是否是安卓
        isIOS = window.WebViewJavascriptBridge!=undefined? true: false;
    var shareLayouter$=$('#share-layouter')
        
        //－－－－－－－－－－－判断三方－－－－－－－－－－－－－－－
         function userIdJudageFn(){
             if (isIOS){
                    // setupWebViewJavascriptBridge()
                    // var i = 0
                    // // 做个轮训，知道iOS返回登录状态时才停止
                    // var timeLoop =setInterval(function(){
                    //     i++
                    //     // alert(IOSmsg)
                    //     if (IOSmsg==1){
                    //         // alert('未登录')
                    //         timeLoop = null
                    //         userId = 0
                    //     }else{
                    //         // alert(IOSmsg)
                    //         userId = IOSmsg
                    //         timeLoop = null
                    //         readRcordAjax()
                    //     }
                    //     if(i==20){
                    //         timeLoop = null
                    //     }
                    // },100)
                    
                } else if (isAndroid){
                    userId = oGetVars.userId//登录人的userid
                } else {
                    userData = localStorage.getItem('userData')?JSON.parse(localStorage.getItem('userData')):{userId:0}
                    userId = userData.userId//web版的只能用本地存储来判断人不能用连接上的id
                    
                    let picUrl = sharePicUrlFn()
                    shareUrl(picUrl)
                    initWxJSSDK(host,$)
                }
        }

        //－－－－－－－－－－－－－－－－分享参数初始化－－－－－－－－－
        function sharePicUrlFn(){
            var picUrl = $(' img').attr('src')||`${host}/logo.png`
    
            var urlContent={
                method:'http://wap.zx.dxt.cn/invitationRegister.html',
                data:{
                    url:'http://wap.zx.dxt.cn/invitationRegister.html',
                    share_title:'有趣的新闻就在趣赚资讯，点我！',
                    share_content:'碎片时间读趣闻，有趣好玩，长见闻，赚零花',
                    share_icon: picUrl
                }
            };
            return urlContent
        }
        //－－－－－－－－－－－－－吊起分享层－－－－－－－－－－－－－

        window.shareLayoterFn = function () {
			if (isAndroid){
				window.SuperStudent.shareFnAn()
			}else if (isIOS){

			}else{

				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					shareLayouter$.attr('class', 'share-weixin');
					shareLayouter$.show();
				} else {
					shareLayouter$.attr('class', 'share-llq');
					shareLayouter$.show();
				}
			}
        }
        //－－－－－－－－－－－－分享层的控制－－－－－－－－－－－－－
        shareLayouter$.on('click',function(){
                $(this).hide()
        })
        // －－－－－－－－统一释放的方法－－－－－－－－－－－
        var doInit = function () {
            loadingHide()
        };
        return {
            doInit: doInit
        }
        
})($, window, document);

$(function () {
    controller.doInit();
});