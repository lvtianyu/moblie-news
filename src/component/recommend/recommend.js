import "../../utils/main750"

import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import"./recommend.css"
import "../../utils/dateHandle.js"  
import  "../../utils/laz"
import {loadingHide,loadShow,loadHide}  from "../../utils/loading"



var titleList$ = $("#titleList"),
    bodyList$ = $("#bodyList")
var test={a:[
        {id:"new",word:"a1"},
        {id:"new",word:"a2"},
        {id:"new",word:"a3"},
        {id:"new",word:"a4"},
        {id:"new",word:"a5"},
        {id:"new",word:"a6"},
    
    ],
    b:[
        {id:"new",word:"b1"},
        {id:"new",word:"b2"},
        {id:"new",word:"b3"},
        {id:"new",word:"b4"},
        {id:"new",word:"b5"},
        {id:"new",word:"b6"}, 
    ]
}

var test1 = {
    title:[
            {
                id:"jx",
                word:"精选"
            },
            {
                id:"news",
                word:"新闻"
            },
            {
                id:"bj",
                word:"北京"
            },
            {
                id:"cj",
                word:"财经"
            },
            {
                id:"ls",
                word:"历史"
            },
            {
                id:"yl",
                word:"娱乐"
            },
            {
                id:"dz",
                word:"段子"
            },
            {
                id:"qps",
                word:"奇葩说"
            },
        ],
    defaultList:[
       
        {   
            id:"yl",
            img:"../../static/news-test.png",
            title:"《摔跤吧！爸爸》阿米尔汗新作，印度电影",
            date:"adddddd",
            discuss:"9999",

        },
        {   
            id:"yl",
            img:"../../static/news-test.png",
            lad:"广告",
            date:"ddddd",
            discuss:"1234"
        },
        {
            id:"news",
            img:"../../static/news-test.png",
            title:"《习大大》今日上线  说好的不堵车,开会还会多看健康健康健康健康发呆发呆发呆发呆发呆发呆发呆发呆发呆发呆发啥发热",
            date:"fffff",
            discuss:"1234",
            subject:"专题"
        },
         {
            id:"cj",
            img:"../../static/news-test.png",
            title:"《股市》今日上线",
            date:"dfdfd",
            discuss:"1234"
        },
         {
            id:"bj",
            img:"../../static/news-test.png",
            title:"《最北京》今日上线  你不知道的北京美食",
            date:"eeee",
            discuss:"1234"
        },
         {
            id:"ls",
            img:"../../static/news-test.png",
            title:"《清十二帝》今日上线  不为人知的宫廷政变",
            date:"ewf",
            discuss:"1234"
        },
         {
            id:"dz",
            img:"../../static/news-test.png",
            title:"《德云社》今日上线  相声是否能重回大师时代",
            date:"dsfds",
            discuss:"1234"
        },
    ]
}

var jx = test1["defaultList"]
var news=[
      {
            id:"news",
            img:"../../static/news-test.png",
            title:"《习大大》今日上线  说好的不堵车ddddddddddddddddddddddddd",
            date:"",
            discuss:"1234"
        },
          {
            id:"news",
            img:"../../static/news-test.png",
            title:"《习大大》今日上线  说好的不堵车ddddddddddddddddddddddddd",
            date:"",
            discuss:"1234"
        },
          {
            id:"news",
            img:"../../static/news-test.png",
            title:"《习大大》今日上线  说好的不堵车ddddddddddddddddddddddddd",
            date:"",
            discuss:"1234"
        },
]
var yl=[
         { id:"yl",
            img:"../../static/news-test.png",
            title:"《摔跤吧！爸爸》阿米尔汗新作，印度电影",
            date:"",
            discuss:"9999"
        },
        {   
            id:"yl",
            img:"../../static/news-test.png",
            title:"《人民的名义》今日上线  ddddddddddddddddddddddddd",
            date:"",
            discuss:"1234"
        },
]
var dz = [
     {
            id:"dz",
            img:"../../static/news-test.png",
            title:"《德云社》今日上线  相声是否能重回大师时代",
            date:"",
            discuss:"1234"
        },
     {
            id:"dz",
            img:"../../static/news-test.png",
            title:"《德云社》今日上线  相声是否能重回大师时代",
            date:"",
            discuss:"1234"
        },
     {
            id:"dz",
            img:"../../static/news-test.png",
            title:"《德云社》今日上线  相声是否能重回大师时代",
            date:"",
            discuss:"1234"
        },
]
var bj = [
      {
            id:"bj",
            img:"../../static/news-test.png",
            title:"《最北京》今日上线  你不知道的北京美食",
            date:"",
            discuss:"1234"
        },
      {
            id:"bj",
            img:"../../static/news-test.png",
            title:"《最北京》今日上线  你不知道的北京美食",
            date:"",
            discuss:"1234"
        },
      {
            id:"bj",
            img:"../../static/news-test.png",
            title:"《最北京》今日上线  你不知道的北京美食",
            date:"",
            discuss:"1234"
        },
]
var cj = [
       {
            id:"cj",
            img:"../../static/news-test.png",
            title:"《股市》今日上线  ddddddddddddddddddddddddd",
            date:"",
            discuss:"1234"
        },
       {
            id:"cj",
            img:"../../static/news-test.png",
            title:"《股市》今日上线  ddddddddddddddddddddddddd",
            date:"",
            discuss:"1234"
        },
       {
            id:"cj",
            img:"../../static/news-test.png",
            title:"《股市》今日上线  ddddddddddddddddddddddddd",
            date:"",
            discuss:"1234"
        },
]
var ls = [
        {
            id:"ls",
            img:"../../static/news-test.png",
            title:"《清十二帝》今日上线  不为人知的宫廷政变",
            date:"",
            discuss:"1234"
        },
        {
            id:"ls",
            img:"../../static/news-test.png",
            title:"《清十二帝》今日上线  不为人知的宫廷政变",
            date:"",
            discuss:"1234"
        },
        {
            id:"ls",
            img:"../../static/news-test.png",
            title:"《清十二帝》今日上线  不为人知的宫廷政变",
            date:"",
            discuss:"1234"
        },
]
var qps =  test1["defaultList"]
var listnews = {
    jx:test1["defaultList"],
    news:news,
    yl:yl,
    dz:dz,
    bj:bj,
    cj:cj,
    ls:ls,
    qps:[]

}





var controller = (function ($, window, document) {

    var isUpdata = true,
            data = {page:0};
 // －－－－－－－－懒加载－－－－－－－－－－－
    var $window = $(window);
    var container =  $(".contain");
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
            load: init//载入远程 HTML 文件代码并插入至 DOM 中。
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

 // －－－－－－－－搜索相关的事件－－－－－－－－－－－－－
    $("#searchBtn").on("click",function(){
        
        searchFn()
    })
    $(document).keydown(function (event) {
            //alert(event.keyCode);
            //判断当event.keyCode 为37时（即左方面键），执行函数to_left();
            //判断当event.keyCode 为39时（即右方面键），执行函数to_right();
            if (event.keyCode == 13) {
                searchFn()
            }
        });

 // －－－－－－－－－－－－－－－－－－－－

 // 搜索成功后的点击事件


 // 搜索到
 function searchSomeFn(test) {
     var len = test.length
        var _html = `<ul>`
        for (var i=0;i<len;i++) {
            _html+=`<li id="${test[i]['id']}">${test[i]['word']}</li>`
        }
        _html+=`</ul>`
        $("#searcModal").html(_html);
        
 }

 //什么都没有搜索到
 function searchNothingFn(value) {
    var _html = "<span>${value}</span>"
     $("#searcModal").html(_html)
 }

 // 搜索方法
 function searchFn() {
    $("#searcModal").show()
    var value=$("#searchInput").val();
   
    if (value) {
        
        //  todo 请求
        var list = test[value] ? test[value] : [];
        if (list.length) {
            searchSomeFn(list) 
        } else {
            searchNothingFn("暂无搜索内容")
        }
       
    } else {
        searchNothingFn("暂无搜索内容")
    }
 }

 //  首次加载初始化
 function init() {
    // todo ajax
    var list = test1
    var len = list["title"].length;
    // $("#loadingMore").show()
    setTimeout(function() {
        addHtmlToListFn(list["defaultList"],bodyList$);
    }, 1000);
    

 }



 // 初始化title点击事件
 function initClickFn() {
    $("#titleList>li").on("click",function() {
        
        let id = this.id
        $("#titleList>li").removeClass("active")
        $("#"+id).addClass("active");
        searchListFN(id)
    })
 }

 // 当切换标题时候的请求
 function searchListFN(id) {
    // todo ajax
    let len = listnews[id].length
    if (len) {
        addHtmlToListFn(listnews[id],bodyList$)
    } else {
        bodyList$.html(`<li nothing>暂无内容</li>`)
    }
    
 }

 // 
 function addHtmlToListFn(list,html) {
    let len = list.length
    let _html = "";
    let liClass;
    let spanClass;
    let pHtml;
    let spanhtml;
    for (let i=0; i<len; i++) {
        if (list[i]["gd"]) {
            liClass="lad";
            pHtml="";
        } else {
            liClass="default";
            
             pHtml = `<a class="gotopage-A" href="detailsMessage.html?id='a'">
                                    ${list[i]['title']}
                        </a>`
        }
        if (list[i]["subject"]) {
            
            spanhtml = ` <span class="first-span subject" >
                                       专题
                                    </span>`
        } else {
            
            spanhtml = ` <span class="first-span " >
                                       ${list[i]["date"]}
                                    </span>`
        }
        _html +=  `<li class="${liClass}">
                    
                        <ul >
                            <li>
                                <a href="detailsMessage.html?id='a'">
                                    <img src="../../static/backDefualt_03.jpg" data-original="${list[i]['img']}" class="lazy">
                                 </a>
                            </li>
                            <li>
                           

                                ${pHtml}
                                <div>
                                   ${spanhtml}
                                   <span class="last-span" onclick="${'showDeleteDiv(this)'}">...</span>
                                 <div class="hide" data-id="${list[i]['id']}" onclick="${'deleteList(this)'}">不感兴趣</div>
                                </div>
                            </li>
                        </ul>
                   
                    
                </li>`
    }
    html.append(_html);
    settings.$ContainerHeight =container.outerHeight()
    $(".lazy").lazyload(settings);

 }

    window.deleteList = function (){
        var self = arguments[0];
        // console.log($(self).attr("data-id"))

        $(self).attr("class","amimated-out")

    }
    window.showDeleteDiv = function (){
        var self = arguments[0]
        $(".amimated").attr("class","amimated-out")
        $(self).next().attr("class","amimated")
    }

    // －－－－－－－－统一释放的方法－－－－－－－－－－－
        var doInit = function () {
            loadingHide()
            init(test1);//初始化页面变量
        };
        return {
            doInit: doInit
        }
        
})($, window, document);

$(function () {
    controller.doInit();
});
