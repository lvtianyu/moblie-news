import "../../utils/main750"
import {baseUrl,version} from '../../utils/host'
import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import"./myself.css"
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"



var controller = (function ($, window, document) {
    	var baseDate = JSON.parse(localStorage.getItem('baseDate'))
        var userId = userData.userId
        function init() {
            let data = {userId:userId}
               $.ajax({
                            type: "post",
                            url: baseUrl + '/appuser/personalcenter',
                            data: data,
                            beforeSend: function (XMLHttpRequest) {
                                loadShow()
                            },
                            success: function (json) {
                              
                                if (json.status == "0") {
                                    initHtml(json) 
                                
                                } else {

                                noticeSetTimeoutPublick(json.msg)

                                    
                                }

                            },
                            complete: function (XMLHttpRequest) {
                                loadHide()
                            },
                            error: function () {
                                noticeSetTimeoutPublick("网络不畅，敬请原谅！")
                            }
                });
         
        }

        function initHtml(json){
             var data = json.data.user
              let hrefH = `userId=${userId}&restMoney=${data.restMoney}&v=${version}`
              hrefH = escape(hrefH)
               var _html = `
                <li>
                    <a href="alterMessage.html?v=1">
                    <img src="${data.headImage}" alt="">
                    </a>
                 </li>
                <li>
                    ${data.nikeName}
                 </li>
                <li>
                    <a href='myWallet.html?${hrefH}'>
                    <img src="./cash-back.png" alt="">零钱：${data.restMoney}元
                    </a>
                </li>
            `
            $("#myselfHeader").html(_html);
            $("#readHistory").html(data.readHistory)
            $('#collectPage').html(data.collectionArticleCount)
            
            if (data.replyStatus==1){
                
                $("#replyStatus").show()
            }
        }

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