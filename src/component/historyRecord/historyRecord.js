
import "../../utils/main750"
import {baseUrl} from '../../utils/host'
import '../../styles/loadUp.scss'

import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import"./historyRecord.scss"
import "../../styles/liststyle.css"
// import "../../utils/dateHandle.js"  

import {loadingHide,noticeSetTimeoutPublick,lazOpen,lazNoting}  from "../../utils/loading"



var controller = (function ($, window, document) {

        var isUpdata = true,
            data = {},
            titleId = 'allMessage',
            changeTitle$ = $("#changeTitle"),//切换标题
            isFirst= true ,
            list = [],//存储所有数组的
            cursor = 0,//后台需要的，分页表示最小ID
            ifNothing = true,
            preCursor = 'a',
            count = 15,
            userId = userData.userId,//登录人的ID

            htmlCentent = $("#bodyList");

        //  首次加载初始化

    function init() {

        if (preCursor != cursor && ifNothing) {
                // preCursor = cursor;
                let data = {userId:userId,cursor:cursor,count:count}
                lazOpen()
                $.ajax({
                                type: "post",
                                url: baseUrl + '/article/readhistory',
                                data: data,
                                beforeSend: function (XMLHttpRequest) {
                                    
                                },
                                success: function (json) {
                                    if (json.status == "0") {
                                        addHtmlToListFnHtml(json.data.article) ;
                                        
                                        cursor +=15
                                    
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
                                                <span class="first-span">${dataList['creatTime']} </span>
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
                                                    <span class="first-span">${dataList['creatTime']} </span>
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
                                                <span class="first-span">${dataList['creatTime']}</span>
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
            data:data,
            $window : $window,
            toTopShowFn:toTopShowFn,
            
            load: function(){
                init()                
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

      var me =    {
                        $element:$("body"),
                        $scrollArea:$("body"),
                        opts:{},
                    }

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

