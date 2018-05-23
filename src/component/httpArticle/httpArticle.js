import "../../utils/main750"
import "../../styles/base.css"
import "../../styles/mobile.css"
import "../complaint/complaint.css"
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
                            url: baseUrl + '/complaint/recommendarticle',
                            data: data,
                            beforeSend: function (XMLHttpRequest) {
                                loadShow()
                            },
                            success: function (json) {
                              
                                if (json.status == "0") {
                                    
                                noticeSetTimeoutPublick('非常感谢您的推荐的文章，我们会尽快处理给')
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
            
            // console.log(/^http:\/\//g.test(value))
            if (/^http:\/\//g.test(value) || /^https:\/\//g.test(value) ){

                init(value)
            } else {
                noticeSetTimeoutPublick("只接收以http://或https://开头的链接")
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