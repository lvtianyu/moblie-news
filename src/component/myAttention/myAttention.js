// import $ from 'jquery'
import "../../utils/main750"
import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import "./myAttention.css"
import "../../utils/dateHandle.js"  
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazNoting}  from "../../utils/loading"
import {baseUrl, host, version} from '../../utils/host'




var controller = (function ($, window, document) {
        //  首次加载初始化
       
        function init(list) {
             let data ={
                    userId:userData.userId
                }
               $.ajax({
                    type: "post",
                    url: baseUrl + '/attention/myclick',
                    data:data,
                    beforeSend: function (XMLHttpRequest) {
                        loadShow()
                    },
                    success: function (json) {
                        if (json.status == "0") {
                            let list = json.data.attention
                            addHtmlToListFn(list) 
                            
                        } else {

                        noticeSetTimeoutPublick(json.msg)
                        loadHide()    
                        }

                    },
                    complete: function (XMLHttpRequest) {

                    },
                    error: function () {
                        loadHide()
                        noticeSetTimeoutPublick('网络不畅，请多关照');
                    }
                });
            }

        



        // 
        function addHtmlToListFn(list) {
            let len = list.length
            let _html = "";
            let liClass;
            let spanClass;
            let pHtml;
            let divClass;
            let spanhtml;
            let dataList;
            let title;
            if (len>0) {
                for (let i=0; i<len; i++) {
                    dataList = list[i]
                    title = dataList['title']?dataList['title']:''
                    _html +=  `<li class="">
                                    <ul >
                                        <li>
                                            <a href='attentionMessage.html?userId=${dataList["userId"]}&v=${version}'>
                                            <img src="${dataList['headImage']}" >
                                            </a>
                                        </li>
                                        <li>
                                            
                                            <div class="">
                        <span>${dataList['nikeName']}</span>
                        <span class="last-span" >${dataList['creatTime']}</span>
                                                
                                            </div>
                                            <a class="gotopage-A" >${title}</a>
                                        </li>
                                    </ul>
                    
                                
                            </li>`
                }
            }else {
                _html = '<li class="Noting">你还没有关注，快去关注你感兴趣的人吧！</li>'
            }
            $("#bodyList").html(_html);
            loadHide()
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

