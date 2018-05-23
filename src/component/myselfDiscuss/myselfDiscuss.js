// import $ from 'jquery'
import {baseUrl,oGetVars,host,version} from '../../utils/host'
import "../../utils/main750"

import"../../styles/base.css"
import "../../styles/mobile.css"

import"./myselfDiscuss.css";
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"





var controller = (function ($, window, document) {

        var isUpdata = true,
            mydiscussLayout$ = $("#mydiscussLayout"),
            replymeLayout$ = $("#replymeLayout"),
            mydiscuss$ = $("#mydiscuss"),
            replyme$ = $("#replyme"),
            userId = userData.userId,
            DiscussOrReply = true,//默认是我的评论
            isFirst= true ,
            ifNothingR = true,
            ifNothingD = true,
            replyCursor =0 ,//游标为回复的
            myCursor = 0,//游标为我的评论的
            count = 20;



 //点击头部切换内容

 

    mydiscuss$.on("click",function(){
        
        replyme$.removeClass("active")
        $(this).addClass("active")
        replymeLayout$.hide()
        mydiscussLayout$.show()
        // settings.$ContainerHeight =container.outerHeight();
        DiscussOrReply = true
    })
    replyme$.on("click",function(){
        
        mydiscuss$.removeClass("active")
        $(this).addClass("active")
        
        mydiscussLayout$.hide()
        //当切换内容时候将更改的htmlCentent传入
        replymeLayout$.show()
        if (isFirst) {        
            replyAjaxFn();
            isFirst = false
        }
        
       DiscussOrReply = false;
    })


 // 请求某人的评论

 function ajaxDiscussFn(list,len,htmlCentent) {
     var _htmlCentent = '';

     for (var i = 1; i<len; i++) {
         _htmlCentent += `
             <li class="name">
                ${dataList['name']}的评论:
             </li>
             <li> 
             ${dataList['content']}
                            
            </li>
         `
     }
     htmlCentent.append(_htmlCentent);
     settings.$ContainerHeight =container.outerHeight()
 }





 //  首次加载初始化
 function init() {
        myDiscussAjax() 
        setTimeout(function() {
            disappearRedPointAjax()
        }, 1000);
 }

//我的评论接口 
 function myDiscussAjax() {

       if (ifNothingD) {
        let data = {
                userId:userId,
                cursor:myCursor,
                count:count
            }
            lazOpen()
            $.ajax({
                    type: "post",
                    url: baseUrl + '/comment/mycomment',
                    data:data,
                    beforeSend: function (XMLHttpRequest) {
                        
                    },
                    success: function (json) {
                        // console.log(json)
                        if (json.status == "0") {
                            let list = json.data.comment
                           addHtmlMyDiscussFn(list) 
                            myCursor=json.data.minId
                        } else {

                        noticeSetTimeoutPublick(json.msg);
                            
                        }

                    },
                    complete: function (XMLHttpRequest) {

                    },
                    error: function () {
                        noticeSetTimeoutPublick("网络不畅，敬请谅解");

                    }
            });
        } else {
            return
        }
 }


 //－－－－－－－－－－－－－－－我的评论的数据处理－－－－－－－－－－－－－－－－－－

 function addHtmlMyDiscussFn(list) {
    let len = list.length
    let _htmlCentent = "";
    let dataList ;
    let active ;
    let url;
     if (len>0 ) {
        for (let i=0; i<len; i++) {
        
            dataList = list[i]
            url = `${dataList['url']}&userId=${userId}&v=${version}`
            // url = escape(url)
            _htmlCentent +=  `
                <ul class="mydiscuss-list" >
                    <li class="content-discuss">
                    <ul>
                        <li>
                                <div>
                                    <a >
                                        <img src="${dataList['headImage']}" data-original="" class="lazy">
                                    </a>
                                    <strong>${dataList['nikeName']}</strong>
                                </div>
                               
                        </li>
                        <li class="content">
                                    ${dataList['content']}
                        </li>
                        <li class="span-li">
                            <span>
                                ${dataList['commentTime']}
                            </span>
                            <span>
                                <i></i>
                                ${dataList['province']} ${dataList['city']}
                            </span>
                        </li>

                    </ul>

                    </li>

                    <li>
                        <p><a href='${url}'>来自：${dataList['title']}</a></p>
                    </li>
                </ul>
            `
        }
        // console.log(htmlCentent)
        mydiscussLayout$.append(_htmlCentent);
        settings.$ContainerHeight =container.outerHeight()
         if(len<count){
                        
                        lazNoting();
                         ifNothingD = false;
                    }
     } else {
        ifNothingD = false;
         lazNoting();
     }
 }

 //－－－－－－－－－－－－－－－我的回复－－－－－－－－－－－－－－－－－－
 function replyAjaxFn() {
     if (ifNothingR) {
        let data = {
                userId:userId,
                cursor:replyCursor,
                count:count
            }
            lazOpen()
            $.ajax({
                    type: "post",
                    url: baseUrl + '/comment/myreply',
                    data:data,
                    beforeSend: function (XMLHttpRequest) {
                        
                    },
                    success: function (json) {
                        // console.log(json)
                        if (json.status == "0") {
                            let list = json.data.comment
                           addhtmlCententToListFn(list) 
                            replyCursor=json.data.minId
                        } else {

                        noticeSetTimeoutPublick(json.msg);
                            
                        }

                    },
                    complete: function (XMLHttpRequest) {

                    },
                    error: function () {
                        noticeSetTimeoutPublick("网络不畅，敬请谅解");

                    }
            });
        } else {
            return
        }
 }

 
 // －－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
 function addhtmlCententToListFn(list) {
    let len = list.length
    let _htmlCentent = "";
    let spanhtmlCentent;
     let dataList 
     let url;

     if (len>0) {
        for (let i=0; i<len; i++) {
                dataList = list[i]
            
                url = `${dataList['url']}&userId=${userId}&v=${version}`

                _htmlCentent +=  `
                    <ul class="replyme-list" >
                        <li class="content-discuss">
                        <ul>
                            <li>
                                    <div>
                                        <a href="attentionMessage.html">
                                            <img src="${dataList['headImage']}" data-original="" class="lazy">
                                        </a>
                                        <strong>${dataList['nikeName']}</strong>回复了我
                                    </div>
                                   
                            </li>
                            <li class="content">
                                        ${dataList['content']}
                            </li>
                            <li class="span-li">
                                <span>
                                    ${dataList['commentTime']}
                                </span>
                                <span>
                                    <i></i>
                                    ${dataList['province']}${dataList['city']}
                                </span>
                            </li>

                        </ul>

                        </li>
                        <li class="reply-content" >
                                <ul class="discuss-ajax">
                                    <li class="name">
                                        我的评论:
                                    </li>
                                    <li>
                                        ${dataList['commentContent']}
                                    </li>
                                </ul>
                                
                            </li>

                        <li>
                            <p><a href='${url}'>来自：${dataList['title']}</a></p>
                        </li>
                    </ul>
                `
            }
            // console.log(htmlCentent)
            replymeLayout$.append(_htmlCentent);
            settings.$ContainerHeight =container.outerHeight()

          if(len<count){
                        
                        lazNoting();
                         ifNothingR = false;
                    }
     } else {
        ifNothingR = false;
         lazNoting();
     }
   
   

 }

//－－－－－－－－－－－－－小红点提示语句－－－－－－－－－－－－－－－－
 function disappearRedPointAjax(){
     var data = {
         userId:userId
     }
     $.ajax({
                    type: "post",
                    url: baseUrl + '/appuser/disappearRedPoint',
                    data:data,
                    beforeSend: function (XMLHttpRequest) {
                        
                    },
                    success: function (json) {
                        // console.log(json)
                        if (json.status == "0") {
                            
                        } else {

                        noticeSetTimeoutPublick(json.msg);
                            
                        }

                    },
                    complete: function (XMLHttpRequest) {

                    },
                    error: function () {
                        noticeSetTimeoutPublick("网络不畅，敬请谅解");

                    }
            });
 }
  


    // －－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

     // －－－－－－－－懒加载－－－－－－－－－－－
    var $window = $(window);
    var container =  $(document);
    var $ContainerHeight = container.outerHeight();
    var $toTop = $("#toTop");
    var winHeight = $window.height();
    var containerWin = window;

      var settings = {
            threshold: 0,
            failure_limit: 0,
            event: 'scroll',
            effect: 'show',
            container: window,
            $ContainerHeight:$ContainerHeight,
            data_attribute: "original",
            skip_invisible: false,
            isUpdata:true,
            appear: null,
            $window : $window,
            toTopShowFn:toTopShowFn,
            
            load: function(){
                if (DiscussOrReply){
                    myDiscussAjax() 
                } else {
                    replyAjaxFn()
                }
            }//载入远程 htmlCentent 文件代码并插入至 DOM 中。
        };

  

    function toTopShowFn( fold ) {
        if ( fold <= winHeight+10 ) {
            $toTop.hide()
        } else {
            $toTop.show()
        }
        
    }

    $toTop.on("click",function(){
        $window.scrollTop(0)
        $toTop.hide()
    })

      $window.scroll(function(e){
                    

            var fold = (window.innerHeight ? window.innerHeight : winHeight) +$window.scrollTop();
            settings.toTopShowFn( fold )
          
            if (fold < settings.$ContainerHeight) {
            } else if (fold == settings.$ContainerHeight) {
            
                    settings.load();//这里当页面的高的等于可滑动的最大高度时候我们就进行加载一页的计划
                    return false;//这个地方原来是 true
        

            }
         
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

$(function () {
    controller.doInit();
});