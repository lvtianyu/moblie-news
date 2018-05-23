
import "../../utils/main750"
import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import "./attention.css"
import "../../utils/dateHandle.js"
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazNoting}  from "../../utils/loading"
import {baseUrl} from '../../utils/host'
import isCroll from 'iscroll'



var controller = (function ($, window, document) {

    var
    cateId = sessionStorage.getItem('cateIdAttention')!='undefined' ? sessionStorage.getItem('cateIdAttention'):0,
    bodyList$ = $('#bodyList'),
    titleList$ = $("#titleList"),
    myScroll,
    userId = userData.userId;
    var height = Number(sessionStorage.getItem('height'))
    var height = height?height:0;
    //  首次加载初始化
    function init(list) {
        // todo ajax

         $.ajax({
                    type: "get",
                    url: baseUrl + '/category/1',
                    data: '',
                    beforeSend: function (XMLHttpRequest) {
                        loadShow()
                    },
                    success: function (json) {
                        if (json.status == "0") {
                        var list  = json.data.category;
                        let len = list.length
                            let _html = "";
                            let _active = ""
                            let listData;
                            cateId = cateId ?cateId :list[0]['cateId']

                            for (let i=0; i<len; i++) {
                                 listData = list[i]
                                if (cateId==listData['cateId']) {
                                     _active="active"
                                } else {
                                   _active = ''
                                }
                                _html +=  `<li  id="${listData['cateId']}" class="${_active}">
                                            ${listData['cateName'] }
                                        </li>`
                            }
                            var height = 14*len/10+'rem'
                            titleList$.html(_html).attr('style','height:'+height)
                            loadHide()
                            searchListFN()
                            initClickFn();
                            iscrollTitle()
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


 

    // 初始化title点击事件
    function initClickFn() {
            $("#titleList>li").bind("click",function() {
                $("#loadingMore").css({visibility: "visible"});
                cateId= $(this).attr('id')
                $("#titleList>li").removeClass("active")
                $("#"+cateId).addClass("active");
                // console.log(myScroll.y,myScroll.pointY)
               
                sessionStorage.setItem('cateIdAttention',cateId);
                sessionStorage.setItem('height',myScroll.y)
                searchListFN()
            })        
    }

    // 当切换标题时候的请求
    function searchListFN(id) {
        //  if (preCursor != cursor && ifNothing) {
                $.ajax({
                    type: "post",
                    url: baseUrl + '/attention/moreclick',
                    data:  {cateId:cateId,userId:userData.userId},
                    beforeSend: function (XMLHttpRequest) {
                    },
                    success: function (json) {

                        if (json.status == "0") {
                            var list  = json.data.attention
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
            // console.log(id)
        
            // }
        
    }

    // 
    function addHtmlToListFn(list,html) {
        let len = list.length
        let _html = "";
        let dataList;
        let isAttention = "＋"
        let attentionColor = '';
        if (len>0) {
            for (let i=0; i<len; i++) {
                dataList = list[i]
               
            if (dataList["attentionStatus"]==1) {
                isAttention = "－"
                attentionColor = ''
            } else {
                isAttention = "＋"
                attentionColor = 'active'
            }
            var tem = ``
            if(i%2==0){
                tem =`<li  >
                        <a href='attentionMessage.html?userId=${dataList['userId']}' style="color:#fff">免费</a>
                    </li> `;
            }else{
                tem=`<li class="active" onclick="getAttention(this)" >
                        付费
                    </li>`
            }
            _html +=  `<li>
                            <ul>
                                <li>
                                    <a ><img src="${dataList['headImage']}" ></a>
                                </li>
                                <li>
                                    <p>
                                        ${dataList['nikeName']}
                                    </p>
                                    <div >
                                        
                                        ${dataList['attentionSum']}人 收听
                                    </div>
                                </li>
                                ${
                                    tem
                                }
                               
                            </ul>
            
                        
                    </li>`
                        // <li class="${attentionColor}" data-message=${dataList['attentionStatus']} data-p=${dataList['userId']}  onclick=${'getAttention(this)'}>
                                //     ${isAttention}
                                // </li>
            }
        } else {
            _html = '<li>暂无内容</li>'
        }
      
        html.html(_html)
        loadHide()
    }

        //--------当点赞 时候的方法-------

   
    window.getAttention = function () {
        $("#pay").show()
        // var self = arguments[0];
        // var status = $(self).attr("data-message");
        // var openUserId = $(self).attr('data-p')
        // let attentionColor ;
        // status = status ==1?2:1;
        // let text = status ==1 ?'－':'＋'
        // attentionColor = status ==1?'':'active';
        // $(self).html(text).attr({"data-message":status,'class':attentionColor})
        // if( !userId || userId == '0' ){
           
        //             location.href='http://wap.zx.dxt.cn/login.html'
             
        // } else {
        //     attentionAjaxFn(status, userId, openUserId, self)
        // }
    }
    $("#returnCollect").on("click",function(){
        $("#pay").hide()
    })


    //--------------关注ajax---------------
    function attentionAjaxFn(status, appuserId, openUserId, self) {
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
                    
                    $(self).prev().find('div').html(`${json.data}人 关注`)
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

    //----------------------------
      function iscrollTitle() {
        
         myScroll = new isCroll('#wrapper2',{
            mouseWheel:true,
            scrollbars:false,
            scrollY:true,
            startY:height,
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

$(function(){
    // $("#searchBtn").on("click",function(){
    //     console.log(1)
        
    //     searchFn()
    // })
    // $(document).keydown(function (event) {
    //         //alert(event.keyCode);
    //         //判断当event.keyCode 为37时（即左方面键），执行函数to_left();
    //         //判断当event.keyCode 为39时（即右方面键），执行函数to_right();
    //         if (event.keyCode == 13) {
    //             searchFn()
    //         }
    //     });

   controller.doInit();
})


// 搜索到
// function searchSomeFn(test) {
//      var len = test.length
//         var _html = `<ul>`
//         for (var i=0;i<len;i++) {
//             _html+=`<li id="${test[i]['id']}">${test[i]['word']}</li>`
//         }
//         _html+=`</ul>`
//         $("#searcModal").html(_html);
        
// }
