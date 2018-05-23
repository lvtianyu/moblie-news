// import '../../utils/jweixin-1.2.0'
import {shareUrl,initWxJSSDK} from '../../utils/share'
import "../../utils/main750"
import {baseUrl,oGetVars,host} from '../../utils/host'

import "../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/modal.css"
import "../../styles/Picture.scss"
import"./detailsMessage.css"
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"
import {performProcessWithFunc,setupWebViewJavascriptBridge}  from "../../utils/iosLogin"
import environmentJudgeFn from '../../utils/moblieOrPc'


var controller = (function ($, window, document) {

    var articleId = oGetVars.id,
        openUserId ,//文章作者的userid
        userId = 0,//登陆人的userid
        shareAwardUserId,//分享者的userId
        commentCount,
        commentPostcmt$= $("#commentPostcmt"),
        submitFn$ = $('#submitFn'),
        shareLayouter$ = $('#share-layouter'),//显示制定分享层
        shareLayouterFn$ = $('#shereLayouter'),//显示可分享图标
        userData ,
        isAndroid = window.SuperStudent ? true:false,//根据安卓的方法来判断是否是安卓
        isIOS = window.WebViewJavascriptBridge!=undefined? true: false,
        likeNumber = 1,//点赞文章的数
        upvoteStatus = 0,//是否点赞0未点赞
        collectionStatus = 0,//0未收藏
        collect$=$('#collect'),
        title,//文章title
        articleHeight=0,
        enterTime=new Date().getTime(),
        bodyList$=$('.contain');//主容器id

        
        window.IOSmsg = false

    
    //  －－－－－－－－首次加载初始化－－－－－－－－－－
            function init(list) {
                let   data = {
                        id:articleId
                    }
    
                $.ajax({
                    type: "post",
                    url: baseUrl + '/article/listdetail',
                    data: data,
                    beforeSend: function (XMLHttpRequest) {
                    },
                    success: function (json) {
                        if (json.status == "0") {
                            addHtmlToListFn(json.data,bodyList$);
                        } else {
                            noticeSetTimeoutPublick("服务器忙！")
                        }
    
                    },
                    complete: function (XMLHttpRequest) {
    
                    },
                    error: function () {
                            noticeSetTimeoutPublick("网络不畅，敬请原谅！")
                    }
                });
    
                
                shareAjaxFn()
            }
    //－－－－－－－－－－－初始化也看整体文章布局方法－－－－－－－－－－－－－－－－－－

    function addHtmlToListFn(data,html) {
        var list  = data.article[0],
         list2 = data.comment,
         active = '',
        //  somebodyLikeHtml,
         hotComment = '';

        openUserId = list['userId'];//文章用户的id
        sessionStorage.setItem('userId',openUserId)
        if (list2){
            hotComment = hotCommentFn(list2)
        }

        likeNumber = list['upvote']
        title = list['title']
        $('title').html(title)
            
        var _html = `
            <h4 class="title">${title}</h4>

            <div  class="header" id="headerContent">
            <img src="${list['headImage']}"   onclick="${'moblieOpen()'}"/>
                    <ul>
                        <li>${list['nikeName']}</li>
                        <li>
                            <span>${list['cateName']}</span>
                            <b>｜</b>
                            <span>${list['creatTime']}</span>
                        </li>
                    </ul>
                    <strong class='' data-message='' id="attentionStaturs"  onclick=${'getAttention(this)'} >关注</strong>
            </div>
            <div class="content-detail" id="open-detail">
                ${list['content']}
                 <div class="notice-statement">
                    <p><span>免责声明</span>
                    本文来自"趣赚资讯"客户端自媒体，不代表"趣赚资讯"的观点和立场</p>
                </div>
                <div class="unfold-field"  onclick="openArticle(this)">
                    <div class="unflod-field__mask"></div>
                    <a class="unfold-field__text">展开全文</a>
                </div>
            </div>
            <div class="somebody-like" >
                <div id="somebodyLike" onclick="clickLikeFn(this)">
                    <span class="heart" id="like3" rel="like"></span>
                    <span class="likeCount" id="likeCount3">${likeNumber}人喜欢</span>
                </div>       
            </div>
          

            <a class="lad">
                <img src='./lad.png' alt="">
                <span class="hide">广告</span>
            </a>

             ${hotComment}
          
        `
        
        html.append(_html);
        commentCount = list['commentCount']
        commentCountFn(commentCount)
        var goto = Number(sessionStorage.getItem('goto'))

        if(goto){
            gotoBottomFn(0)
            sessionStorage.setItem('goto',0)
        }
        hotRecommendAjax()
        //－－－－－收藏状态－－－－－－
        collectionStatus = Number(list['collectionStatus'])
        if (collectionStatus==1){
            collect$.addClass('active')
        }
    }   
    //－－－－－－－－－－－－页面评论区布局方法－－－－－－－－－－－－－－－
  
    function hotCommentFn(list) {
        let len = list.length
        let _html = "";
        let dataList;
        let replyConmentHtml = '';
        let active
        let addR;
            _html =  `<div class="body-list">
                <h5>
                    用户热评
                </h5>`
           
             for (let i=0; i<len; i++){
                 dataList = list[i]
                 active = dataList['likeStatus']==1?'active':'';
                 if (dataList['reply']) {
                     addR = dataList['replyCount']>1? `<a  id="${dataList['commentId']}&${dataList['replyCount']}">
                            查看所有${dataList['replyCount']}条回复 >
                        </a>`:'';
                     replyConmentHtml =  `
                             <li class="reply-content">
                        <ul>
                            <li class='name'>
                                ${dataList['reply']['nikeName']}:
                            </li>
                            <li>
                                ${dataList['reply']['content']}
                            </li>
                        </ul>
                       ${addR}

                    </li>
                     `
                 } else{
                     replyConmentHtml =''
                 }
                 _html +=`
                
                <ul class="replyme-list" onclick=${'getUlToPageFn(this)'}>
                    <li class="content-discuss" >
                    <ul  id=${dataList['commentId']} class='page'>
                        <li>
                                <div>
                                    <img class='page' src="${dataList['headImage']}" alt=""> <strong class='page'>${dataList['nikeName']}</strong>
                                </div>
                                <div  >
                                       <i class="${active}" data-id='${dataList['likeStatus']}' data-message='${dataList['commentId']}' onclick='gaveSupportFn(this)'></i> <span>${dataList['likeCount']}</span>
                                    </div>
                        </li>
                        <li class="content-detailsMessage page">
                                ${dataList['content']}
                        </li>
                        <li>
                            <span class='page'>
                                ${dataList['commentTime']}
                            </span>
                            <span class='page'>
                                <i></i>
                                ${dataList['province']||'中国'} ${dataList['city']||'中国'}
                            </span>
                        </li>
                    </ul>
                    </li>

                  ${replyConmentHtml}
                
                </ul>
            
                 `
        }
        _html += ` <a class="more-message" onclick=${'allDiscussFn(this)'}><span>全部评论</span></a>
            </div>`
       return _html
    }


    // －－－－－－－－－－－热门推荐－－－－－－－－－－－－－
    function hotRecommendAjax() {
             $.ajax({
                        type: "post",
                        url: baseUrl + '/article/recommendlist',
                        data: '',
                        beforeSend: function (XMLHttpRequest) {

                        },
                        success: function (json) {
                            
                            if (json.status == "0") {
                            
                            // console.log(json.data.article)
                           hotRecommend(json.data.article)
          
                            } else {

                            }

                        },
                        complete: function (XMLHttpRequest) {

                        },
                        error: function () {
                                noticeSetTimeoutPublick('网络不畅！敬请谅解')

                        }
                    });
    }

    //－－－－－－－－－－－－推荐页面布局方法－－－－－－－－－
    function hotRecommend(list) {
        let len = list.length
        let _html = "";
        let dataList;
        let replyConmentHtml = '';
        let active
        let addR;
        let liClass;
        let pHtml;
        let spanhtml;
            _html =  `
                <h5>
                    相关文章推荐
                </h5><ul>`
           
           for (let i=0; i<len; i++) {
                dataList = list[i]
                liClass="default";
                
                pHtml = `<a class="gotopage-A" href="/detailsMessage.html?id=${dataList['id']}&userId=${userId}">
                                        ${dataList['title']}
                            </a>`
         
                
                spanhtml = ` <span class="first-span " >
                                        ${dataList["creatTime"]}
                                        </span>`
                                _html +=  `<li class="${liClass}">
                            <ul >
                                <li>
                                <a href="/detailsMessage.html?id=${dataList['id']}&userId=${userId}">
                                       <img src="${dataList['cover']}" data-original="" class="lazy">    
                                    </a>
                                </li>
                                <li>
                            

                                    ${pHtml}
                                    <div>
                                
                                    ${spanhtml}
                                    <span class="last-span" >评论:${dataList['commentCount']}</span>
                                    </div>
                                </li>
                            </ul>
            
                        
                    </li>`
            }
            _html+='</ul>'
            $('#recommendedArticles').html(_html)
            return userIdJudageFn()
    }
        
    //－－－－－－－－－－－判断三方－－－－－－－－－－－－－－－
    function userIdJudageFn(){
        if (isIOS){
                    setupWebViewJavascriptBridge()
                    var i = 0
                    // 做个轮训，知道iOS返回登录状态时才停止
                    var timeLoop =setInterval(function(){
                        i++
                        // alert(IOSmsg)
                        if (IOSmsg==1){
                            // alert('未登录')
                            timeLoop = null
                            userId = 0
                        }else{
                            // alert(IOSmsg)
                            userId = IOSmsg
                            timeLoop = null
                            readRcordAjax()
                        }
                        if(i==20){
                            timeLoop = null
                        }
                    },100)
                    
                } else if (isAndroid){
                    userId = oGetVars.userId//登录人的userid
                    readRcordAjax()
                } else {
                    userData = localStorage.getItem('userData')?JSON.parse(localStorage.getItem('userData')):{userId:0}
                    userId = userData.userId//web版的只能用本地存储来判断人不能用连接上的id
                    // console.log(userData)
                    readRcordAjax()
                    //--------------判断是否时pc端--------------------
                    environmentJudgeFn(articleId)
                    let picUrl = sharePicUrlFn()
                    shareUrl(picUrl)
                    initWxJSSDK(host,$)
                    $("#historyBackHome").show()
                }
    }

    //－－－－－－－－－－－－－－－－分享参数初始化－－－－－－－－－
    function sharePicUrlFn(){
        var picUrl = $('#open-detail img').attr('src')||`${host}/logo.png`

        var urlContent={
            method:location.href,
            data:{
                url:location.href,
                share_title:'趣赚资讯邀你一起看新闻',
                share_content:title,
                share_icon: picUrl
            }
        };
        return urlContent
    }

   
       
    
    //－－－－－－－－－－－历史记录接口，后台记录阅读－－－－－－－－－－－－－－
    // setTimeout(function() {
    //     readRcordAjax()
    // }, 1000);
    function readRcordAjax(){
        // console.log(userId)
        if (userId){
            let   data = {
                id:articleId,
                userId:userId
            }
            $.ajax({
                type: "post",
                url: baseUrl + '/article/insertReadLog',
                data: data,
                success: function (json) {
                    if (json.status == "0") {
                        changeStatusFn(json)
                        
                    } else {
                        noticeSetTimeoutPublick("服务异常！")
                    }

                },
            });
        }
        //    console.log(IOSmsg,isAndroid)
        if(!IOSmsg && !isAndroid){
            //    console.log($('#carousel-head'))
            $('#carousel-head').show()
           }
    }
    //－－－－－－－－－－－将轮播条和状态都加上－－－－－－－－－－－－－－－－
    function changeStatusFn(list){
           //－－－－－－判断第三方－－－－－－－
        
           //－－－－－收藏状态－－－－－－
           collectionStatus = Number(list['collectStatus'])
           if (collectionStatus==1){
               collect$.addClass('active')
           }
           upvoteStatus = Number(list['upvoteStatus'])
           let isAttention = "关注"
           let active=''
           if (list["attentionStatus"]==1) {
               isAttention = "已关注"
               active = 'active'
           } else {
               isAttention = "关注"
               active = ''
           }
           $('#attentionStaturs').html(isAttention).attr({'class':active,'data-message':list["attentionStatus"]})
    }
    //－－－－－－－－－－－－－－－－发送数字更新－－－－－－－－－
    function commentCountFn(val) {
        $('#commentCount').html(val)
    }

    //－－－－－－－－－－－－－－－－点击文章打开文章－－－－－－－
    window.openArticle = function (){
        $(arguments[0]).hide()
        $('#open-detail').attr('style','height:auto')
        articleHeight=$('#open-detail').height()
    }

    //－－－－－－－－－－－－－－userid不再就跳转方法三方登录判断－

	    function gotoLogin( fn ,self) {
	        if (!userId || userId==0 ) {
				if(isAndroid ){
                    if (oGetVars.userId==0){

					    window.SuperStudent.loginFnAn();
                    } else {
                        return
                    }
				}else if (IOSmsg==1){
                    performProcessWithFunc({'method':'gotoLogin'})
                }else {
                    location.href = `${host}login.html?backHtml=${articleId}`;
				}
				
	        } else {
				fn(self)
			}
        }
    //－－－－－－－－给文章点赞－－－－－－－－－－－－
    window.clickLikeFn = function() {
            var self = arguments[0];
            gotoLogin(clickLikeJudgeFn,self) 
				
    }

    //－－－－－－－－给文章点赞进行拆分，先判断－－－－－－－－－－－
    function clickLikeJudgeFn(){
        if(!upvoteStatus) {
            
                                upvoteStatus = 1
                                ++likeNumber
                                var self = arguments[0];
                                var likeNumberHtml = `${likeNumber}人喜欢`
                                //点赞动画逻辑
                                    var A=$(self).find('.heart').attr("id");
                                    var B=A.split("like"); //splitting like1 to 1
                                    // console.log(B,A)
                                    var messageID=B[1];
                                    $(self).find('.heart').css("background-position","")
                                    var D=$(self).find('.heart').attr("rel");
                                
                                
                                    $("#likeCount"+messageID).html(likeNumberHtml);
                                    if(D === 'like') {
                                        $(self).find('.heart').addClass("heartAnimation").attr("rel","unlike"); 
                                    }
                                    else{
                                        $(self).find('.heart').removeClass("heartAnimation").attr("rel","like");
                                        $(self).find('.heart').css("background-position","left");
                                    
                                    }
                                    $(self).addClass('active')
            
                                     clickLikeAjaxFn(likeNumber)
                                }else {
                                    noticeSetTimeoutPublick('你已经赞过此篇文章了，看来很感兴趣哦！')
                                }
    }
    //－－－－－调用接口传点赞－－－－－－－
     function clickLikeAjaxFn(upvote){
            var data = {
                userId:userId,
                id:articleId,
                upvote:upvote
            }
             $.ajax({
                        type: "post",
                        url: baseUrl + '/article/upvote',
                        data: data,
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
                                noticeSetTimeoutPublick('网络不畅！敬请谅解')

                        }
                    });
    }
    //－－－－－－－－－－－－－跳转页面,点击评论区－－－－－－－－－－－－－－－－－－－－－
    window.getUlToPageFn = function() {
       if (!isAndroid){
           if (!userId || userId==0 ) {
					location.href = `${host}login.html`;
				}else {
                    var html = $(arguments[0]).find('.content-discuss>ul').context.children[0].children[0].outerHTML;
                    sessionStorage.setItem('html',html);
                    location.href=`/submitDiscuss.html?commentCount=${commentCount}&userId=${userId}`
                }
       }else {
                if (oGetVars.userId==0){
                    window.SuperStudent.loginFnAn();

                }else {
                     var parent = $(arguments[0]).find('.page')
                    gotToCommentPageFn(parent)
                }
       }
       
      
    }

    //－－－－－－－－－－－－－点击评论区给安卓的数据－－－－－－－－－－－－－－－－－－
    function gotToCommentPageFn(parent){
            var id = parent.eq(0).attr('id')
            var image = parent.eq(1).attr('src');
            var nickname = parent.eq(2).text()
            var content = parent.eq(3).text()
            var time = parent.eq(4).text()
            var address = parent.eq(5).text()
            var data = `${image},${nickname},${content},${time},${address},${commentCount},${userId},${id}`
            
        window.SuperStudent.goToCommentPage(data)
    }

    //－－－－－－－－－－－－－安卓和前端－点击个人中心头像跳转页面－－－－－－－－－－－－－－－－－－－
    window.moblieOpen = function() {
       	gotoLogin(moblieOpenFnAn);

        
    }
    // －－－－－－－－－为了安卓和 web共用的便利方法－－－－－－－－－－
    function moblieOpenFnAn(){
        	var userId = openUserId;
	        if (isAndroid) {
	            window.SuperStudent.collection(userId);
	        } else {
	            
	            location.href = `${host}attentionMessage.html?userId=${userId}`;
	        }
    }
    //－－－－－－－－－－－－－－－－－全部评论底边栏的全部评论安按钮－－－－－－－－－－－－－－－－－
    window.allDiscussFn = function() {
        gotoLogin(allDiscussFnAn)
    }

    function allDiscussFnAn() {
        if(isAndroid){
            window.SuperStudent.allDiscuss(articleId)
        }else {
            
            location.href=`${host}allDiscuss.html?articleId=${articleId}`
        }
    }
    //－－－－－－－－－－－－－－－底边栏的分享按钮－－－－－－－－－－－－－－－－

    $('#shareFn').on('click',function(){
			gotoLogin(shareAn)

    })

    function shareAn() {
        if(isAndroid){
            var data1 = sharePicUrlFn();
            data1 = JSON.stringify(data1);
            window.SuperStudent.shareFnAn(data1);
            
        } else if (isIOS){
            var data = sharePicUrlFn()
            data = JSON.stringify(data)
            performProcessWithFunc(
                data,function(res){}
            )
        }else {
            shareLayouterFn$.show()
            $('#shareBtn').addClass('no')
        }
    }

    $('#closeLayouter').on('click',closeShareLayouter)

    function closeShareLayouter() {
        shareLayouterFn$.hide()
        $('#shareBtn').removeClass('no')
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
            closeShareLayouter()
    }
    //－－－－－－－－－－－－分享层的控制－－－－－－－－－－－－－
    shareLayouter$.on('click',function(){
            $(this).hide()
    })
    
    // －－－－－－－－－－－－－－给评论区的人点赞 时候的方法－－－－－－－－－－－－－－－
    window.gaveSupportFn = function () {
        
        var self = arguments[0];
        gotoLogin(gaveSupportJudgeFn,self) 

    }
    //－－－－－－－－给评论区点赞进行拆分，先判断－－－－－－－－－－－
    function gaveSupportJudgeFn(){
        var e = window.event;
        e.stopPropagation()
        var self = arguments[0];
        var status = $(self).attr("data-id");
        var commentId = $(self).attr('data-message')
        var nextHtml = $(self).next()
        let likeCount = nextHtml.text()
        likeCount = Number(likeCount);
        status = status ==1?2:1;
        let className = status ==1?'active':'';
        likeCount = status ==1?(likeCount+1):likeCount>0?(likeCount-1):0
        $(self).attr({'class':className,'data-id':status})
        nextHtml.html(likeCount)
        gaveSupportAjax(commentId, status)
    }

    function gaveSupportAjax(commentId, status) {
         let data = {
            userId:userId,
            status:status,
            commentId:commentId
        }
          $.ajax({
            type: "post",
            url: baseUrl + '/attention/like',
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

    //--------当关注作者 时候的方法-------

    window.getAttention = function () {
        var self = arguments[0];
        gotoLogin(getAttentionJudgeFn,self) 
  
    }
    //－－－－－－－－给当关注作者 进行拆分，先判断－－－－－－－－－－－
    function getAttentionJudgeFn () {
        var self = arguments[0];
        var active = '';
        var status = $(self).attr("data-message");
            status = status ==1?2:1;
            let text = status ==1 ?'已关注':'关注'
            active = status ==1 ?'active':''
            $(self).html(text).attr({"data-message":status,'class':active})
       if(isAndroid) {
               attentionAjaxFn(status, oGetVars.userId)
       }else {          
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
    //－－－－－－－－收藏方法－－－－－－－－－－
    collect$.on('click',collectAjaxFn)

    // console.log(location.search)
    function collectAjaxFn() {
          if (!userId || userId==0 ) {
				if(isAndroid ){
                    if (oGetVars.userId==0){

					    window.SuperStudent.loginFnAn();
                    } else {
                        return
                    }
				}else {				
                    location.href = `${host}login.html`;
				}
				
	        }else{
                    if (!collectionStatus){
                    let url = `id=${articleId}&userId=${userId}`
                    url = escape(url)
                    url = `detailsMessage.html?${url}`
                    $('#collect').addClass('active')
                    var data = {
                        userId:userId,
                        id:articleId,
                        url:url,
                        title:title
                    }
                            $.ajax({
                                type: "post",
                                url: baseUrl + '/article/collectArticle',
                                data: data,
                                beforeSend: function (XMLHttpRequest) {

                                },
                                success: function (json) {
                                    
                                    if (json.status == "0") {
                                        collectionStatus=1
                                        noticeSetTimeoutPublick('收藏成功')
                
                                    } else {
                                        noticeSetTimeoutPublick(json.msg)
                                    }
                                },
                                complete: function (XMLHttpRequest) {

                                },
                                error: function () {
                                        noticeSetTimeoutPublick('网络不畅！敬请谅解')

                                }
                            });
                }else{
                    noticeSetTimeoutPublick('你已经收藏过这篇文章！')
                }
            }
    
            
    }

    //－－－－－－－－－判断键盘获取焦点时候布局改变－－－－－－－－－－－
    commentPostcmt$.on('focus',function(){
        $('.close-li').hide();
        $('.li1').addClass('active')
        $('.li5').show()
    })
     commentPostcmt$.on('blur',function(){
         setTimeout(function(){
             $('.close-li').show();
            $('.li1').removeClass('active')
            $('.li5').hide()
         },500)
        
     })
    commentPostcmt$.on('input',function(){
        var val = commentPostcmt$.val();
        if (val){
            submitFn$.addClass('active')
        }else {
            submitFn$.removeClass('active')
        }
    })
    //－－－－－－－－－－－－－提交评论－－－－－－－－－－－－－－－－－－－－
     var submitFnAn =function () {
            var val = commentPostcmt$.val();
                if ( val && !/\>|\</.test(val) ) {
                    if (val.length<=220){
                         commentAjax(val)
                    }else{
                        noticeSetTimeoutPublick('评论不能超过220字，谢谢！')
                    }
                   
                } else{
                    noticeSetTimeoutPublick('空格和< >不能提交')
                }
    }
    submitFn$.on('click', submitFn);

    function submitFn() {
        gotoLogin(submitFnAn);
    }
 
    //－－－－－－－－－－－发表评论－－－－－－－－－－－－－－－－－－－－－
    $(document).keydown(function (event) {           
            if (event.keyCode == 13) {
                submitFn()
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
            url: baseUrl + '/comment/postcmt',
            data: data,
            beforeSend: function (XMLHttpRequest) {
            },
            success: function (json) {
                if (json.status == "0") {
                   commentCount = json.data.commentcount;
                   commentPostcmt$.val('');
                   submitFn$.removeClass('active')
                   commentCountFn(commentCount)

                   var _html = hotCommentFn(json.data.comment)
                   if ($('.body-list').html()){
                        $('.body-list').replaceWith(_html)
                   } else {
                        bodyList$.append(_html)
                   }
                    
                     gotoBottomFn(450)
                } else {

                    noticeSetTimeoutPublick('暂不支持表情输入！敬请谅解')
                    
                }

            },
            complete: function (XMLHttpRequest) {

            },
            error: function () {
                noticeSetTimeoutPublick("网络不畅，敬请谅解");

            }
        });

    }

        //－－－－－－－－执行动画－－－－－－－－－－－－
        function amimateFn(){
           
            setTimeout(function(){
                 $('#award-layout').show()
            },1000)
            setTimeout(function(){
                 $('#award-layout').hide()
            },5000)
        }

       //－－－－－－－－－－－－－阅读记录有奖励－－－－－－－－－－－－－－
    function readingAjaxFn() {
        let read = oGetVars.read
        if ( read ){
            if (userId){
                let data = {
                    userId:userId,
                    enterTime:enterTime,
                    articleId:articleId
                }
                      $.ajax({
                        type: "post",
                        url: baseUrl + '/reward/readlog',
                        data: data,
                        beforeSend: function (XMLHttpRequest) {
                            // loadShow()
                        },
                        success: function (json) {
                            // console.log(json)
                            if (json.status == "0") {
                                let success = ''
                               if (json.data==1)
                               {
                                    // success=`个人中心页面已进账${oGetVars.rewardMoney}元阅读奖励金`
                                    //－－－－动画执行－－－
                                    amimateFn()
                                    // noticeSetTimeoutPublick(success)
                               }
                               else if(json.data == 2){
                                //    success = `快去查看你的账户吧，你已经得到鼓励金了！`
                                
                               } else {
                                    success = `手慢了，您没有抢到阅读奖励金`
                                    noticeSetTimeoutPublick(success)
                               }
                                
                            }else{
                                noticeSetTimeoutPublick('服务器忙！敬请谅解')
                            }

                        },
                        complete: function (XMLHttpRequest) {
                            // loadHide()
                        },
                        error: function () {
                                noticeSetTimeoutPublick('网络不畅！敬请谅解')

                        }
                    });
            }
        }
    }
    //－－－－－－－－－－－－－分享记录有奖励－－－－－－－－－－－－－－－－
    function shareAjaxFn() {
        let share = oGetVars.share
        if ( share && !isAndroid){
            let userData = localStorage.getItem('userData')
            userData = userData?JSON.parse(userData):{userId:null};
            if ( share==1 && userData.userId != oGetVars.userId ){
                let data = {
                    userId:oGetVars.userId,//分享有奖励将奖励给了你的好友，连接上的是好友的ID
                    articleId:articleId
                }
                      $.ajax({
                        type: "post",
                        url: baseUrl + '/reward/sharelog',
                        data: data,
                        beforeSend: function (XMLHttpRequest) {

                        },
                        success: function (json) {
                            
                            if (json.status == "0") {
                                let success = ''
                               if (json.data==1)
                               {
                                    success=`分享者已经收获${oGetVars.rewardMoney}元分享奖励金`;
                                    noticeSetTimeoutPublick(success)
                               }
                               else if(json.data==2){
                                // success = `每篇文章只能得一次分享奖励金`
                               } else {
                                //    success = `手慢了，您没有抢到分享奖励金`
                               }
                                
                                
                            }

                        },
                        complete: function (XMLHttpRequest) {

                        },
                        error: function () {
                                noticeSetTimeoutPublick('网络不畅！敬请谅解')

                        }
                    });
            }
        }
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
            $window : $window,
            toTopShowFn:toTopShowFn,
            fold:0
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

       $window.scroll(function(){

            var fold = (window.innerHeight ? window.innerHeight : winHeight) +$window.scrollTop();
            settings.toTopShowFn( fold )
            settings.fold = fold;
            // console.log(fold)
             if (fold == settings.$ContainerHeight) {
            
                    return false;//这个地方原来是 true
        

            }else if(articleHeight){
                if(fold >= articleHeight){
                    
                    readingAjaxFn()
                    
                    articleHeight=0
                }
            }

        })




    //－－－－－－－－－－统一跳转到底部－－－－－－－－－－－
    function gotoBottomFn( i ){
        var container = document.getElementById('contain')
        // console.log(container.scrollHeight,)
        var height = container.scrollHeight-i
         $(window).scrollTop(height)
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
        controller.doInit()
        console.log('lvtianyu:front end;email:lv1464562713@163.com')
})

