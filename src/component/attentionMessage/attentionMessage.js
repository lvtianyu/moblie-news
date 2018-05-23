
import "../../utils/main750"
import {baseUrl,oGetVars} from '../../utils/host'
// import MyDropLoad from '../../utils/loadUp'
import '../../styles/loadUp.scss'

import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import"./attentionMessage.css"
import "../../utils/dateHandle.js"  
import '../../styles/liststyle.css'
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"

// 标题的循环

var controller = (function ($, window, document) {

        var isUpdata = true,
            data = {page:0},
            titleId = 'allMessage',
            // allMessage$ = $("#allMessage"),//全部文章
            // timeMessage$ = $("#timeMessage"),//timeMessage
            // leadMessage$ = $("#leadMessage"),//按阅读
            // changeTitle$ = $("#changeTitle"),//切换标题
            isFirst= true ,
            list = [],//存储所有数组的
            cursor = 0,//后台需要的，分页表示最小ID
            ifNothing = true,
            preCursor = 'a',
            count=10,
            userId = userData.userId,
            openUserId = oGetVars.userId,//文章发送人的ID
            htmlCentent = $("#bodyList");


        //点击头部切换内容
        // changeTitle$.bind("click",function(e){
        //     var liHtml = e.target
        //     titleId = liHtml.id;
        //     var titleClass = liHtml.getAttribute("class");
        //     if (titleClass) {

        //     } else {
        //         $(this).find('.active').removeClass("active")
        //         liHtml.setAttribute("class","active")
        //     }
            
        // })
        //  首次加载初始化
        //  首次加载初始化
        function init() {

            addHtmlToTtileList();
            addHtmlToListFn();

        }


    // 
    function addHtmlToTtileList() {
        let data = {userId:openUserId
            ,appuserId:userId}

        if (ifNothing) {
                 $.ajax({
                            type: "get",
                            url: baseUrl + '/appuser/personlist',
                            data: data,
                            beforeSend: function (XMLHttpRequest) {
                                loadShow()
                            },
                            success: function (json) {
                                if (json.status == "0") {
                                    addHtmlToTtileListHtml(json.data.user) 
                                
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
        } else {

        }
  
  
    }

    function addHtmlToTtileListHtml(list){
        let _html = "";
        let _active = ""
        let isAttention = "免费"
        if (list["attentionStatus"]==1) {
            isAttention = "免费"
        } else {
            isAttention = "免费"
        }
        _html = `
            <img src="${list["headImage"]}" alt="">
                    <ul>
                        <li>${list["nikeName"]}</li>
                        <li>
                            <span>${list["articleNum"]}发布</span>
                            <b>｜</b>
                            <span>${list["readNum"]}阅读</span>
                        </li>
                    </ul>
                    <strong data-message=${list['attentionStatus']}  onclick=${'getAttention(this)'} >${isAttention}</strong>
        `
        $("#headerContent").html(_html);
    }

    // 
    function addHtmlToListFn(list) {

        if (preCursor != cursor && ifNothing) {
                preCursor = cursor;
                lazOpen(true)
                let data = {userId:openUserId,cursor:cursor,count:count}

                  $.ajax({
                                type: "post",
                                url: baseUrl + '/article/personalarticle',
                                data: data,
                                beforeSend: function (XMLHttpRequest) {
                                    
                                },
                                success: function (json) {
                                    if (json.status == "0") {
                                        
                                        addHtmlToListFnHtml(json.data.article) ;
                                        
                                        cursor = json.data.minId
                                    
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
  

    }

    function addHtmlToListFnHtml(list) {
            let len = list.length
            let _html = "";
            let content ="";
            let userId = userData.userId;
            let url;
            let istopHtml
            var dataList;
            if ( len>0) {
                for (let i=0; i<len; i++) {
                    dataList =  list[i]

                    switch(dataList['adType']){
                        case 4:
                        url = escapeUrlFn(dataList['id'], userId)
                        istopHtml = istopHtmlFn(dataList['isTop'])
                        content = ` <li class="character-list">
                                        <ul>
                                            <li>
                                                <a href="/detailsMessage.html?${url}" >${dataList['title']}</a>
                                            </li>
                                            <li>
                                                ${istopHtml}
                                                <span class="first-span"> </span>
                                                <span class="last-span">评论:${dataList['commentCount']}</span>
                                            
                                            </li>
                                        </ul>
                                </li>`
                        break;
                        case 5:
                        url = escapeUrlFn(dataList['id'], userId)
                        istopHtml = istopHtmlFn(dataList['isTop'])
                        content = `<li class="common-list">
                                        <ul>
                                            <li>
                                                <a href="/detailsMessage.html?${url}"><img src="${dataList['cover1'][0]}" alt=""></a>
                                            </li>
                                            <li>
                                                <a href="/detailsMessage.html?${url}">
                                                    ${dataList['title']}
                                                </a>
                                                <div>
                                                    ${istopHtml}
                                                    <span class="first-span"> </span>
                                                    <span class="last-span">评论:${dataList['commentCount']}</span>
                                                </div>
                                            </li>
                                        </ul>
                                </li>`
                        break;
                        case 6:
                        url = escapeUrlFn(dataList['id'], userId)
                        istopHtml = istopHtmlFn(dataList['isTop'])
                        content = `<li class="picture-list">
                                        <ul>
                                            <li>
                                                <a href="/detailsMessage.html?${url}">${dataList['title']}</a>
                                            </li>
                                            <li class="picture">
                                                <a href="/detailsMessage.html?${url}">
                                                <img src="${dataList['cover1'][0]}" alt="">
                                                <img src="${dataList['cover1'][1]}" alt="">
                                                <img src="${dataList['cover1'][2]}" alt="">
                                                </a>
                                            </li>
                                            <li>  
                                                ${istopHtml}
                                                <span class="first-span"></span>
                                                <span class="last-span">评论:${dataList['commentCount']}</span>  
                                            </li>
                                        </ul>
                                </li>`
                        break;
                    }
                    _html +=  `
                                ${content}
                            `
                }
                   
                     htmlCentent.append(_html);                       
   
                     setHeightFn()         
                    if(len<count){                      
                        lazNoting();
                        ifNothing = false;
                    }
            } else {
              
                 lazNoting();
                 ifNothing = false;
            } 

    }
    //－－－－－－－抽象url方法－－－－－－－－
        function escapeUrlFn(id, userId){
            let url 
            url = `id=${id}&userId=${userId}`
                        url = escape(url)
            return url
        }
    //－－－－－－－－置顶动画方法－－－－－－－－
        function istopHtmlFn(isTop){
            let istopHtml=''
              if(isTop){
                            istopHtml = '<span class="top-span">置顶</span>'
                        }else {
                            istopHtml = ''
                        }
            return istopHtml
        }
    //－－－－－－－－－重新设定高度－－－－－－－－－－－
        function setHeightFn(){
    //－－－－－－－添加一个定时器1ms后我们在获取页面上的高度，因为马上获取高的会造成高度误差－－－－－－－－－－－
                     setTimeout(function(){settings.$ContainerHeight = container.outerHeight()},80)   
        }
    //--------当点赞 时候的方法-------

   
    window.getAttention = function () {
        var self = arguments[0];
        var status = $(self).attr("data-message");
        //todo ajax;
             status = status ==1?2:1;
        let text = status ==1 ?'已关注':'关注'
        $(self).html(text).attr("data-message",status)

        if( !userId || userId == '0' ){
           
                    location.href='http://wap.zx.dxt.cn/login.html'
             
        } else {
            attentionAjaxFn(status, userId)
        }
    }


    //--------------关注ajax---------------
    function attentionAjaxFn(status, appuserId) {
        let data = {
            userId:openUserId,
            status:status,
            appuserId:appuserId
        }
          $.ajax({
            type: "get",
            url: baseUrl + '/attention/click',
            data:data,
            beforeSend: function (XMLHttpRequest) {

            },
            success: function (json) {
                if (json.status == "0") {
                    
                } else {

                   noticeSetTimeoutPublick(json.msg)
                    
                }

            },
            complete: function (XMLHttpRequest) {

            },
            error: function () {
                noticeSetTimeoutPublick('网络不畅，请多关照')
            }
        });
    }


    // －－－－－－－－懒加载－－－－－－－－－－－－－－－－－－－－－－－－－－
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
            data:data,
            $window : $window,
            toTopShowFn:toTopShowFn,
            
            load: function(){
                addHtmlToListFn()
                
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

    var me ={
                        $element:$("body"),
                        $scrollArea:$("body"),
                        opts:{},
                    }

       $window.scroll(function(){

            var fold = (window.innerHeight ? window.innerHeight : winHeight) +$window.scrollTop();
            settings.toTopShowFn( fold )
            // console.log(fold,settings.$ContainerHeight)
            if (fold < settings.$ContainerHeight) {
            } else if (fold == settings.$ContainerHeight) {
            
                    settings.load();//这里当页面的高的等于可滑动的最大高度时候我们就进行加载一页的计划
                    return false;//这个地方原来是 true
        

            }
            if ($window.scrollTop()==0) {
                //   MyDropLoad(addHtmlToListFn, me)
            }
        })
        // MyDropLoad(addHtmlToListFn, me)






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

