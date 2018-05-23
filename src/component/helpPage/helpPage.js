

import "../../utils/main750"
import {baseUrl} from '../../utils/host'
import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/modal.css"
import "./helpPage.css"
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"

var controller = (function ($, window, document) {
    var active;
    var len = $('li').length

    //----------------------------
    

    for(var i=1; i<=len; i++){
        let tag = `#li${i}`
        $(tag).on("click",function(){

        var active= $(this).attr('class')
        console.log(active)
        active = active?'':'active'
        $(this).attr('class',active)
        // if (active){
            $(this).find('p').fadeToggle("slow","linear")
        // }
    })
    }

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