// import $ from "jquery"
import "../../utils/main750"
import {baseUrl,oGetVars,host} from '../../utils/host'

import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/modal.css"
import './submitDiscuss.css'
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"



var controller = (function ($, window, document) {
 
     var commentId,
    commentPostcmt$= $("#commentPostcmt"),
    submitFn$ = $('#submitFn');
    sessionStorage.setItem('goto',2)//记录是从详情页面跳转回来的
//  首次加载初始化
        function init(list) {

          var html = sessionStorage.getItem('html');
          $('.comment-div').html(html)
          
         
          return replyAjaxFn()
         }

//－－－－－－－－－－－－全部回复－－－－－－－－－－－－－－－－－－
        function replyAjaxFn() {
            commentId = $('.comment-div>ul').attr('id')
            var data = {
             commentId:commentId,
          
            }
             $.ajax({
                type: "post",
                url: baseUrl + '/comment/selectreply',
                data: data,
                beforeSend: function (XMLHttpRequest) {

                },
                success: function (json) {
                    // console.log(json)
                    if (json.status == "0") {
                        var list = json.data.comment
                        replyFn(list) 
                    } else {

                    
                        
                    }

                },
                complete: function (XMLHttpRequest) {

                },
                error: function () {
                    noticeSetTimeoutPublick("网络不畅，敬请谅解");

                }
            });
        }



        function replyFn(list) {
            
            let len = list.length
            let _html = "";
            let dataList;
            let replyConmentHtml = ''
            if (len) {
                _html =  `
                            <h5>全部回复</h5>
                            <ul>`
            
                for (let i=0; i<len; i++){
                    dataList = list[i]
               
                    _html +=`
                    
                        <li class="name" >
                            ${dataList['nikeName']}
                        </li>
                        <li>${dataList['content']}</li>
                
                    `
                    }
                    _html += `  
                        </ul>
                   `
                 $('.reply').html(_html)
                 $(window).scrollTop(0)
                }
            
        }



    //－－－－－－－－－－原单返回－－－－－－－－－－－－－－－－
    $('#goBack').on('click',function(){
        history.go(-1)
    })
    //－－－－－－－－－－－－－－－－－－－－－－－－－－
    commentPostcmt$.on('input',function(){
        var val = commentPostcmt$.val();
        if (val){
            submitFn$.addClass('active')
        }else {
            submitFn$.removeClass('active')
        }
    })
    //－－－－－－－－－－－－－提交－－－－－－－－－－－－－－－－－－－
  
    submitFn$.on('click', submitFn)
    function submitFn() {
          var val = commentPostcmt$.val();
                if ( val && !/\>|\</.test(val) ) {
                    // console.log(val.length)
                    if (val.length<=220){
                        commentAjax(val)
                    } else{
                        noticeSetTimeoutPublick('评论不能超过220字，谢谢！')

                    }
                    
                } else{
                    noticeSetTimeoutPublick('空格和< >不能提交')
                }
    }

    //－－－－－－－－－－－发表评论－－－－－－－－－－－－－－－－
    $(document).keydown(function (event) {
           
            if (event.keyCode == 13) {
                submitFn()
                
            }
        });

    //－－－－－－－－－－－－－评论ajax－－－－－－－－－－－－－－－－－－－

    function commentAjax(val) {
        

        var data = {
            commentId:commentId,
            commentatorId:oGetVars.userId,
            content:val
        }
        $.ajax({
            type: "post",
            url: baseUrl + '/comment/postreply',
            data: data,
            beforeSend: function (XMLHttpRequest) {

            },
            success: function (json) {
                if (json.status == "0") {
                    addHtml(val)
                     commentPostcmt$.val('');
                } else {

                     noticeSetTimeoutPublick("回复失败！请重新尝试");

                    
                }

            },
            complete: function (XMLHttpRequest) {

            },
            error: function () {
                noticeSetTimeoutPublick("网络不畅，敬请谅解");

            }
        });

    }

    //

    function addHtml(val) {
            var baseData = localStorage.getItem('baseDate'),
                _html ='';
                baseData = JSON.parse(baseData)
               
            // console.log(baseData)
            let nikeName = baseData.nikeName;
            // alert(nikeName)
            if (!baseData && !nikeName) {
                return replyAjaxFn()
            }
            if (document.querySelector('.reply>ul')) {
                _html +=`
                    
                        <li class="name" >
                            ${nikeName}
                        </li>
                        <li>${val}</li>
                
                    `
                
                 $('.reply>ul').find(':first-child ').before(_html)
            }else {

                _html +=`
                        <h5>全部回复</h5>
                        <ul>
                        <li class="name" >
                            ${nikeName}
                        </li>
                        <li>${val}</li>
                        </ul>
                    `
                $('.reply').html(_html)
            }
               
                 $(window).scrollTop(0)
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

