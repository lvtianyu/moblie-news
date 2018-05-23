
var qrcode = require('../../utils/jquery.qrcode.min')
import {baseUrl,oGetVars,host} from '../../utils/host'
import "../../utils/main750"
import "../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/modal.css"
import "./advertiseWallet.css"


var controller = (function ($, window, document) {
        var money = oGetVars.money||0
        var _html =`<li>我已经赚了</li>
        <li>
            ${money}<i>元</i>
        </li>`

        $("#headerBody  .money-content").html(_html)
        $("#headerBody").show()

         /*canvas转化为图片*/
         function canvasToImage(canvas) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image;
        }
        var code$ = $("#code")
        code$.qrcode({
            render: "canvas",
            width: 160, //宽度
            height: 160, //高度
            background : "#ffffff",       //二维码的后景色
            foreground : "#000000",
            text:'http://a.app.qq.com/o/simple.jsp?pkgname=dxt.duke.union',
           });

           code$.html(canvasToImage(code$[0].getElementsByTagName("canvas")[0]))
           var code = code$.find('img').attr('src')
           $("#code-push").attr('src',code)

        // －－－－－－－－统一释放的方法－－－－－－－－－－－
        var doInit = function () {
           
        };
        return {
            doInit: doInit
        }
        
})($, window, document);


$(function(){
        controller.doInit()
        
})