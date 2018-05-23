// const $ = require('jquery')
// window.jquery = window.$ = $
import "../../utils/main750"

import"../../styles/base.css"
import "../../styles/mobile.css"

import"../myself/myself.css"
import "./setting.css"
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"

var controller = (function ($, window, document) {
 
        $('#aboutUs').on('click',function(){
            $(".help-modal").show();
            $('#about-us').attr("class","slideInRight");
        })
        //－－－－－－－－关闭成－－－－－－－－－－－－－
        $("#returnPage").on("click",function(){
                $(".help-modal").hide();
			
        })
        // －－－－－－－－统一释放的方法－－－－－－－－－－－
        var doInit = function () {
            loadingHide()
        };
        return {
            doInit: doInit
        }
        
})($, window, document);

$(function () {
    controller.doInit();
});


