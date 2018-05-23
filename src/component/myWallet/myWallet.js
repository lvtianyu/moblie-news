// import $ from "jquery"
import "../../utils/main750"
import "../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import "../../styles/Picture.scss"
import"./myWallet.css"
import {baseUrl,oGetVars,host} from '../../utils/host'
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"
import {shareUrl,initWxJSSDK} from '../../utils/share'



var controller = (function ($, window, document) {

    var _html ;
    var userId = oGetVars.userId;
    var restMoney = oGetVars.restMoney
    var shareLayouter$=$('#share-layouter')

    //  首次加载初始化
    function init(list,html) {
        // todo ajax
            let data = {
                userId:userId
            }
                $.ajax({
                                type: "post",
                                url: baseUrl + '/reward/mybalance',
                                data: data,
                                beforeSend: function (XMLHttpRequest) {
                                    
                                },
                                success: function (json) {
                                    if (json.status == "0") {
                                        addHtmlToTtileList(json.data) ;
                                        
                                    
                                    } else {

                                    noticeSetTimeoutPublick(json.msg)

                                        
                                    }

                                },
                                complete: function (XMLHttpRequest) {
                                   
                                },
                                error: function () {
                                   noticeSetTimeoutPublick("网络不畅，敬请原谅！")
                                }
                });


        
    }


    // 标题的循环
    function addHtmlToTtileList(list) {
         _html=`
            <ul class="header">
                    <li>
                        <span>
                            昨日零钱收入（元）
                        </span>
                        <strong>
                            ${list.yesterdayMoney}
                        </strong>
                    </li>
                    <li>
                        <span>
                            账户余额（元）
                        </span>
                        <strong>
                            ${restMoney}
                        </strong>
                    </li>
                </ul> 
        `
        if (list.balance) {
        let len = list.balance.length
        let dataList ;
        let type; 
        let word;
        
            let _active = "";
            _html+=`<ul class="body-list">`
            for (let i=0; i<len; i++) {
                dataList = list.balance[i]
                type = dataList['type'] ==1?'阅读有奖励':'分享得红包'
                word = dataList['type'] ==1?'阅读文章赠送现金红包':'分享内容获得的红包奖励'
                _html+=`
                <li>
                                <div>
                                    <span >
                                    ${type}                                </span>
                                    <span class='active'>  
                                    +${dataList['rewardMoney']}元                                     </span>
                                </div>
                                        
                                <div>
                                    <span>
                                    ${word} </span><span>${dataList['insertTime']}</span>

                                </div>

                        </li>
                
                `

            }
            _html+=`</ul>`
            $('#headerBody').html(_html);
            var withdraw = `withdraw.html${window.location.search}`
            $('#withdraw').attr('href',withdraw)
            sharePicUrlFn(restMoney)
        }
 
    }
    //－－－－－－－－－－－－－－－－分享参数初始化－－－－－－－－－
      function sharePicUrlFn(money){
        var content =`想知道我在趣赚资讯赚了多少元钱吗？,快点开看看啊`
        var picUrl = `http://wap.zx.dxt.cn/logo.png`
        var url = `http://wap.zx.dxt.cn/advertiseWallet.html?money=${money}`
        var urlContent={
            method:url,
            data:{
                url:url,
                share_title:'趣赚资讯邀你一起看新闻',
                share_content:content,
                share_icon: picUrl
            }
        };
        shareUrl(urlContent)
        initWxJSSDK(host,$)
    }
    

    //－－－－－－－－－－－－－吊起分享层－－－－－－－－－－－－－

        window.shareLayoterFn = function () {
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                shareLayouter$.attr('class','share-weixin')
                shareLayouter$.show()
            }else {
                shareLayouter$.attr('class','share-llq')
                shareLayouter$.show()

            }
    }
    //－－－－－－－－－－－－分享层的控制－－－－－－－－－－－－－
    shareLayouter$.on('click',function(){
            $(this).hide()
    })

   // －－－－－－－－统一释放的方法－－－－－－－－－－－
        var doInit = function () {
            loadingHide()
            init();//初始化页面变量
        };
        return {
            doInit: doInit
        }
        
})($, window, document);

$(function(){
         controller.doInit();

         
})