
import MyDropLoad from '../../utils/loadUp'
import isCroll from 'iscroll'
import "../../utils/main750"
import {baseUrl} from '../../utils/host'
import '../../styles/loadUp.scss'   //－－下拉刷新
import "../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/modal.css"
import "./index.css"
import "../../styles/banner.css"
import "../../styles/liststyle.css"

// import AllFunction from "../../utils/carousel"

import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"

var controller = (function ($, window, document) {

    var titleList$ = $("#titleList"),
    bodyList$ = $("#bodyList");
    var isCheange = true,
     data,
     cursor = 0,//后台需要的，分页表示最小ID
     ifNothing = true,
     preCursor = 'a',
     count = 15,
     myScroll ,
     isFresh=false,
     hashLocation = sessionStorage.getItem('hahLocation') ,//记录页面跳转的。
     sessIsCroll = Number(sessionStorage.getItem('isCrollStartX')),
     isCrollStartX = sessIsCroll?sessIsCroll:0,
     cateId = sessionStorage.getItem('cateId')? sessionStorage.getItem('cateId'):'48';
    
    var userData = localStorage.getItem('userData')
    userData = userData ? JSON.parse(userData) : {userId:0};

        //  首次加载初始化
        function init() {
            addHtmlToTtileList('',titleList$)

        }
        
        // 标题的循环
        function addHtmlToTtileList(list,html) {
                $.ajax({
                    type: "get",
                    url: baseUrl + '/category/2',
                    data: '',
                    
                    beforeSend: function (XMLHttpRequest) {

                    },
                    success: function (json) {
                        if (json.status == "0") {
                        // var a = {cateId: '0', cateName: "精选"}
                        var list  = json.data.category;
                        //  list.unshift(a)
                        let len = list.length
                            let _html = "";
                            let _active = ""
                            let listData;
                            // cateId = cateId ?cateId :list[0]['cateId']
                            for (let i=0; i<len; i++) {
                                 listData = list[i]
                                if (cateId==listData['cateId'] ) {
                                     _active="active"
                                } else {
                                   _active = ''
                                }
                                _html +=  `<li  id="${listData['cateId']}" class="${_active}">
                                            ${listData['cateName'] }
                                        </li>`
                            }
                            var width = len+'rem'
                            html.html(_html).attr('style','width:'+width);
                            searchListFN()
                            initClickFn();
                            iscrollTitle()
                        } else {
                            noticeSetTimeoutPublick("网络不畅，敬请原谅！")
                            
                        }

                    },
                    complete: function (XMLHttpRequest) {

                    },
                    error: function () {
                    noticeSetTimeoutPublick("网络不畅，敬请原谅！")

                    }
                });

        }

        // 初始化title点击事件
        function initClickFn() {

            $("#titleList>li").bind("click",function() {
                $("#loadingMore").css({visibility: "visible"});
                cateId= $(this).attr('id')
                $("#titleList>li").removeClass("active")
                $("#"+cateId).addClass("active");
                originalData()
                sessionStorage.setItem('cateId',cateId);
                sessionStorage.setItem('isCrollStartX',myScroll.x)
                searchListFN()
            })

        }
        //－－将数据还原－－－
        function originalData(){
                cursor = 0;
                ifNothing = true;
                preCursor = 'a';
                isCheange = true;

        }


        // －－－当切换标题时候的请求，懒加载也绑定该方法－－－

        function searchListFN() {
            // todo ajax
            // console.log(preCursor != cursor && ifNothing,ifNothing,cursor,preCursor)
            if (preCursor != cursor && ifNothing) {
                lazOpen()

                preCursor = cursor;
                $.ajax({
                    type: "post",
                    url: baseUrl + '/article/list',
                    data:  {cateId:cateId,cursor:cursor,count:count},
                    beforeSend: function (XMLHttpRequest) {
                    },
                    success: function (json) {
                        if (json.status == "0") {
                            var list  = json.data.article
                            let len = list.length
                                        cursor = json.data.minId
                                        addHtmlToListFn(list,bodyList$)
                                    
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
        
            }else {
                lazNoting();
            }
        }

        // －－－－－首页列表循环方法－－－－－－
        function addHtmlToListFn(list,html) {
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
                        case 1:
                        content = ` <li class='lad-big'>
                                        <a href="${dataList['adUrl']}"><img src="${dataList['cover']}" alt=""></a>

                                        <ul>
                                            <li>广告<span>|</span>新鲜</li>
                                            <li onclick="deleteLad(this)"><b>&times</b></li>
                                        </ul> 
                                        
                                    </li>
                   
                                    `
                        break;
                        case 2:
                        content = ` <li class='lad-small'>
                                        <ul>
                                            <li>
                                            <a href='${dataList['adUrl']}'> <img src="${dataList['cover']}" alt=""></a>
                                            </li>
                                            <li>
                                                <a href='${dataList['adUrl']}'>
                                                    ${dataList['title']}
                                                </a>
                                                <div>
                                                    <span class="first-span">广告</span>
                                                </div>
                                            </li>
                                        </ul>
                    
                                    </li>`
                        break;
                        case 3:
                        content = `<li class='lad-big'>
                                        <a href='${dataList['adUrl']}' class="first-a">${dataList['title']}</a>
                                        <a href='${dataList['adUrl']}'><img src="${dataList['cover']}" alt=""></a>

                                        <ul>
                                            <li>广告<span>|</span>新鲜</li>
                                            <li onclick="deleteLad(this)"><b>&times</b></li>
                                        </ul> 
                                        
                                    </li>`
                        break
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
                                                    <span class="first-span"></span>
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
                    if (isCheange) {
                        html.html(_html);
                    } else {
                        html.append(_html);                       
                    }
                    isCheange = false;
                     setHeightFn()         
                    if(len<count){                      
                        lazNoting();
                        ifNothing = false;
                    }
            } else {
                if (!cursor && isCheange) {
                   _html = ''
                    html.html(_html);
                }
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

        //－－－－－－－－－删除广告方法方法－－－－－－－－－
        window.deleteLad = function(){
            $(arguments[0]).parent().parent().hide();
            //删除广告后重新获取高度
            setHeightFn()
        }
        // －－－－－－懒加载的设置－－－－－－－－－－
        var container =  $(document)
        var $ContainerHeight = container.outerHeight();
        var $toTop = $("#toTop");
        var $window = $(window);
        var winHeight = $window.height();


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
            toTopShowFn:toTopShowFn,
            loadUpFn:init,
            load: function(){
                searchListFN()
            }//载入远程 HTML 文件代码并插入至 DOM 中。
            
        };

        function toTopShowFn( fold ) {
                if ( fold <= winHeight ) {
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
                        $element:$("#contain"),
                        $scrollArea:$("#contain"),
                        opts:{},
                }

       $window.scroll(function(){
            
            var fold = (window.innerHeight ? window.innerHeight : winHeight) +$window.scrollTop();
            settings.toTopShowFn( fold )
            // console.log(fold,settings.$ContainerHeight)
            if (fold < settings.$ContainerHeight) {
            } else if (fold == settings.$ContainerHeight ) {
               
                    settings.load();//这里当页面的高的等于可滑动的最大高度时候我们就进行加载一页的计划
                    return false;//这个地方原来是 true        
            }
            if ($window.scrollTop()==0) {
                  MyDropLoad(searchListFN, me)
            }
        })
        MyDropLoad(searchListFN, me)


    //－－－－－－－－标题绑定scroll方法－－－－－－－－
    function iscrollTitle() {
         myScroll = new isCroll('#wrapper',{
            mouseWheel:true,
            scrollbars:false,
            scrollY:false,
            scrollX:true,
            startX:isCrollStartX,
            click:true,
        })
       
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

$(function () {
    controller.doInit();
});

