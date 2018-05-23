import "../../utils/main750"
import"../../styles/base.css"
import "../../styles/mobile.css"
import"./complaint.css"

import {baseUrl} from '../../utils/host'
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"



var controller = (function ($, window, document) {

    var isSubmit = false,
    value,
    button$ = $("button"),
    userId = userData.userId;

        function init(content) {
            let data = {userId:userId,content:content}
               $.ajax({
                            type: "post",
                            url: baseUrl + '/complaint/complain',
                            data: data,
                            beforeSend: function (XMLHttpRequest) {
                                loadShow()
                            },
                            success: function (json) {
                              
                                if (json.status == "0") {
                                    
                                noticeSetTimeoutPublick('非常感谢您的信息，我们会尽快处理给你反馈！')
                                 $("textarea").val('');
                                 isSubmit=false;
                                button$.removeClass("active");  
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
         
        }

    $("textarea").on("input",function(){
        value = $(this).val()
        if (value) {
            isSubmit = true;
            button$.addClass("active");
        } else {
            button$.removeClass("active");   
            value=''
        }
    })

    $('#submitBtn').on('click',function(){
        if (isSubmit){
            if (!/\>|\</.test(value)) {
                init(value)
            } else {
                noticeSetTimeoutPublick('空格和< >不能提交')
            }
            
        }
    })

          var h=$(window).height();
    $(window).resize(function() {
        if($(window).height()<h){
            $('.footer').hide();
        }
        if($(window).height()>=h){
            $('.footer').show();
        }
    });

            // －－－－－－－－统一释放的方法－－－－－－－－－－－
        var doInit = function () {
            loadingHide()
        };
        return {
            doInit: doInit
        }

        
	})($, window, document);

$(function(){
	controller.doInit();


})