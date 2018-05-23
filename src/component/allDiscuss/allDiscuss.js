import "../../utils/main750";
import "../../styles/footerMessage.css";
import "../../styles/base.css";
import "../../styles/mobile.css";
import "./allDiscuss.css";
import { baseUrl,oGetVars } from "../../utils/host";
import { loadingHide,noticeSetTimeoutPublick,lazOpen,lazNoting }  from "../../utils/loading";
import { settings, lazyload } from "../../utils/lazUpdate";

var controller = (function ($, window, document) {

        var isUpdata = true,
            data = { page:0 },
            allDiscuss$ = $("#allDiscuss"),
            hotDiscuss$ = $("#hotDiscuss"),
            articleId = oGetVars.articleId,//本文章的id
            cursor=0,
            count=20,
            userId = userData.userId,
            ifNothing = true,
            commentPostcmt$= $("#commentPostcmt"),
            submitFn$ = $("#submitFn"),
            isFirst= true ;


//  // 请求某人的评论

//  function ajaxDiscussFn(list,len,htmlCentent) {
//      var _html = "";

//      for (var i = 1; i<len; i++) {
//          _html += `
//              <li class="name">
//                 ${list[i]["name"]}的评论:
//              </li>
//              <li> 
//              ${list[i]["content"]}
                            
//             </li>
//          `
//      }
//      htmlCentent.append(_html);
//      settings.$ContainerHeight =container.outerHeight()
//  }

 //  首次加载初始化
 function init() {
    hotcommentAjax()  
    allCommentAjax()      
 }
//－－－－－－－－－－－－－－－－－－－全部评论－－－－－－－－－－－－－－－－－－
function allCommentAjax() {

    if (ifNothing) {
        let data = {
                articleId: articleId,
                cursor: cursor,
                count: count,
                userId: userId
            }
            lazOpen()
            $.ajax({
                    type: "post",
                    url: baseUrl + "/comment/newcomment",
                    data: data,
                    beforeSend: function () {
                        
                    },
                    success: function (json) {
                        if (json.status == "0") {
                            let list = json.data.comment
                            addhtmlCententToListFn(list, "全部", allDiscuss$ );
                            cursor=json.data.minId
                        } else {

                        noticeSetTimeoutPublick(json.msg);
                            
                        }

                    },
                    complete: function () {

                    },
                    error: function () {
                        noticeSetTimeoutPublick("后台服务可能出现问题，给你带来不便敬请谅解");

                    }
            });
    } else {
        return
    }
 
}
//－－－－－－－－－－－－－－－－－－－热门评论－－－－－－－－－－－－－－－－－－－－

function hotcommentAjax() {
    let data = {articleId:articleId,userId:userId}
     $.ajax({
            type: "post",
            url: baseUrl + "/comment/hotcomment",
            data: data,
            beforeSend: function () {
                
            },
            success: function (json) {
                // console.log(json)
                if (json.status == "0") {
                    let list = json.data.comment
                 addhtmlCententToListFn(list, "热门", hotDiscuss$);
                } else {

                   noticeSetTimeoutPublick(json.msg);
                    
                }

            },
            complete: function () {

            },
            error: function () {
                    noticeSetTimeoutPublick("后台服务可能出现问题，给你带来不便敬请谅解");

            }
        });
}
 // －－－－－－出现了逻辑性内聚－－－－－－－－
 function addhtmlCententToListFn(list, title, html) {
    let len = list.length
    let _html
    if (len>0 ) {
            _html = loopHtmlFn( len, title, list) 
            html.append(_html);
            settings.$ContainerHeight =container.outerHeight()
            if (settings.isUpdata){
                    lazyload();
                }
            if(len<count){
                        
                        lazNoting();
                         ifNothing = false;
                    }
    } else {
         ifNothing = false;
         lazNoting();
    }
           
 }

    //－－－－－－－－将评论区的内容给分出来，1、为了后来添加的发布评论模块，2、减少逻辑性内聚修改为功能性那句－－－－－－
    function loopHtmlFn( len, title, list) {
        let _html = ` <h6>${title}评论</h6>`;
        let ulClass;
        let aHtml;
        let replyLayout = "";
        let spanhtmlCentent;
        let listChild = []
        let active ;
         for (var i=0; i<len; i++) {
                listChild = list[i]
                active = listChild["likeStatus"]==1?"active":"";
                if (listChild["reply"] && listChild["reply"].length) {

                    if (listChild["replyCount"]>1) {
                    aHtml= `<a >
                                    查看所有${listChild["replyCount"]}条回复 >
                        </a>`
                    } else {
                        aHtml=""
                    }
                    
                    replyLayout =   `<li class="reply-content" >
                                <ul class="discuss-ajax">
                                    <li class="name">
                                        ${listChild["reply"][0]["nikeName"]}:
                                    </li>
                                    <li>
                                        ${listChild["reply"][0]["content"]}
                                    </li>
                                </ul>
                                
                                ${aHtml}

                            </li>`
                            ulClass = "replyme-list"
                } else {
                    replyLayout = "";
                    ulClass = "mydiscuss-list"
                }

                _html +=  `
                    <ul class="${ulClass}" onclick=${"getUlToPageFn(this)"}>
                        <li class="content-discuss">
                        <ul id=${listChild["commentId"]}>
                            <li>
                                    <div>
                                        <a >
                                            <img src="${listChild["headImage"]}" >
                                        </a>
                                        <strong>${listChild["nikeName"]}</strong>
                                    </div>
                                     <div  >
                                       <i class="${active}" data-id="${listChild["likeStatus"]}" data-message="${listChild["commentId"]}" onclick="gaveSupportFn(this)"></i> <span>${listChild["likeCount"]}</span>
                                    </div>
                            </li>
                            <li class="content">
                                        ${listChild["content"]}
                            </li>
                            <li class="span-li">
                                <span>
                                    ${listChild["commentTime"]}
                                </span>
                                <span>
                                    <i></i>
                                    ${listChild["province"]}${listChild["city"]}
                                </span>
                            </li>

                        </ul>

                        </li>
                        ${replyLayout}
                    </ul>
                `
            }
            return _html
    }

    //－－－－－－－－－－－－－跳转页面－－－－－－－－－－－－－－－－－－－－－
    window.getUlToPageFn = function() {
       if (!oGetVars["mobile"]){
           var html = $(arguments[0]).find(".content-discuss>ul").context.children[0].children[0].outerHTML;
      
        sessionStorage.setItem("html",html);
        location.href=`/submitDiscuss.html?userId=${userId}`
       }
       return
        
    }


    //--------当点赞 时候的方法-------
  
    //－－－－－点赞方法做了一个全局变量，造成了公共耦合－－－－－－
    window.gaveSupportFn = function () {
        var e = window.event;
         e.stopPropagation()
        var self = arguments[0];
        var status = $(self).attr("data-id");
        var commentId = $(self).attr("data-message")
        var nextHtml = $(self).next()
        let likeCount = nextHtml.text()
        likeCount = Number(likeCount);
        status = status ==1?2:1;
        let className = status ==1?"active":"";
        likeCount = status ==1?(likeCount+1):likeCount>0?(likeCount-1):0
        $(self).attr({"class":className,"data-id":status})
        nextHtml.html(likeCount)
        gaveSupportAjax(commentId, status)

    }

    //－－－－－－点赞请求方法－－－－－－－
    function gaveSupportAjax(commentId, status) {
         let data = {
            userId:userId,
            status:status,
            commentId:commentId
        }
          $.ajax({
            type: "post",
            url: baseUrl + "/attention/like",
            data:data,
            beforeSend: function () {

            },
            success: function (json) {
                if (json.status == "0") {
                    // noticeSetTimeoutPublick("点赞成功")
                } else {

                   noticeSetTimeoutPublick(json.msg)
                    
                }

            },
            complete: function () {

            },
            error: function () {
                     noticeSetTimeoutPublick("后台服务可能出现问题，给你带来不便敬请谅解");

            }
        });
    }

        commentPostcmt$.on("input",function(){
        var val = commentPostcmt$.val();
        if (val){
            submitFn$.addClass("active")
        }else {
            submitFn$.removeClass("active")
        }
    })
    //－－－－－－－－－－－－－提交－－－－－－－－－－－－－－－－－－－－
     var submitFnAn =function () {
            var val = commentPostcmt$.val();
                if ( val && !/\>|\</.test(val) ) {
                    if (val.length<=220){
                         commentAjax(val)
                    }else{
                        noticeSetTimeoutPublick("评论不能超过220字，谢谢！")
                    }
                   
                } else{
                    noticeSetTimeoutPublick("空格和< >不能提交")
                }
    }
    submitFn$.on("click", submitFnAn)
  
 
    //－－－－－－－－－－－发表评论－－－－－－－－－－－－－－－－－－－－－
    $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                submitFnAn()
            }
        });

    //－－－－－－－－－－－－－评论ajax－－－－－－－－－－－－－－－－－－－

    function commentAjax(val) {
        var data = {
            articleId:articleId,
            commentatorId:userId,
            content:val
        }
          $.ajax({
            type: "post",
            url: baseUrl + "/comment/postcmt",
            data: data,
            beforeSend: function () {

            },
            success: function (json) {
                if (json.status == "0") {
                   commentPostcmt$.val("");
                   submitFn$.removeClass("active")
                    var data = json.data.comment.splice(0,1)
                    var _html = loopHtmlFn( 1, "最新", data)

                    $("#allDiscuss").find("h6").replaceWith(_html);
                    settings.$ContainerHeight =container.outerHeight()

                    } else {
                        noticeSetTimeoutPublick("网络不畅，敬请谅解");
                }

            },
            complete: function () {

            },
            error: function () {
                noticeSetTimeoutPublick("网络不畅，敬请谅解");

            }
        });

    }
    //－－－－－－－－－－－－－－－－－－－－分页加载－－－－－－－－－－－－－－－－－－－－－

    // －－－－－－－－懒加载－－－－－－－－－－－


    var container = $(document)
    var $ContainerHeight = container.outerHeight();
    settings.load = function(){
        allCommentAjax()   
    }
    settings.$ContainerHeight = $ContainerHeight



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