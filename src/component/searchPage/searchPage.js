// import $ from "jquery"
import "../../utils/main750"
import {baseUrl} from '../../utils/host'
import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import "./searchPage.css"
import "../../styles/liststyle.css"

import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"

var controller = (function ($, window, document) {
    var searchInput$ = $("#searchInput"),
        searcModal$ = $("#searcModal"),//搜索层
        html = $('#bodyList');//

    searchInput$.focus(function(){
        searcModal$.show()
    })
      //  首次加载初始化
    function init() {
                    $.ajax({
                                type: "post",
                                url: baseUrl + '/article/hotWordsList',
                                data: '',
                                beforeSend: function (XMLHttpRequest) {
                                    
                                },
                                success: function (json) {
                                    if (json.status == "0") {
                                        // console.log(json.data.article)
                                        hotWordsListFn(json.data.article)
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
    function hotWordsListFn(list){
        let len = list.length
        let _html = "";
        let dataList

       if (len>0) {
            for (let i=0; i<len; i++) {
                dataList = list[i];
                _html += `<li onclick="hotWordsListSearchFn(this)"><img src="./search.png" alt="">${dataList}</li>`
            }
       }else {
        _html='<li>暂无最新热词</li>'
       }
        $('#hotWardList').html(_html)
    }

    //－－－－－－－－－热词点击搜索－－－－－－－－－－－－－－－
    window.hotWordsListSearchFn = function(){
        var self = arguments[0]
        // console.log(self)
        var hitWord = $(self).text()
        searchFn(hitWord)
    }
    //－－－－－－－－－搜索方法－－－－－－－－－－－－－－
    function searchFn(hotKey){
        var data= {
            hotKey:hotKey
        }
        $.ajax({
                                type: "post",
                                url: baseUrl + '/article/SearchArticle',
                                data: data,
                                beforeSend: function (XMLHttpRequest) {
                                    
                                },
                                success: function (json) {
                                    if (json.status == "0") {
                                        addHtmlToListFn(json.data.article) ;
                                    
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

      // －－－－－首页列表循环方法－－－－－－
        function addHtmlToListFn(list) {
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
                        
                  
            } else {
                _html = `<li class="search-nothing">我们的 <i>&hearts;</i> 小宇宙 <i>&hearts;</i> 还没有存入该词汇！</li>`
            } 
            html.html(_html);
            searcModal$.hide()
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

    //－－－－－－－－－－原单返回－－－－－－－－－－－－－－－－
    $('#goBack').on('click',function(){
        history.go(-1)
    })
        //－－－－－－－－－－－发表评论－－－－－－－－－－－－－－－－
    $(document).keydown(function (event) {
           
            if (event.keyCode == 13) {
                submitFn()
                
            }
        });

        function submitFn() {
          var val = searchInput$.val();
                if ( val && !/\>|\</.test(val) ) {
                    // console.log(val.length)
                    if (val.length<=30){
                        searchFn(val)
                         searchInput$.val('')
                    } else{
                        noticeSetTimeoutPublick('评论不能超过220字，谢谢！')

                    }
                    
                } else{
                    noticeSetTimeoutPublick('空格和< >不能提交')
                }
    }
    // －－－－－－－－统一释放的方法－－－－－－－－－－－
        var doInit = function () {
            loadingHide()
            init()
        };
        return {
            doInit: doInit
        }

        
	})($, window, document);

$(function(){
	controller.doInit();


})