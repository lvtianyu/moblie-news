import "../../utils/main750"
import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import"./withdraw.css"
import {baseUrl,oGetVars} from '../../utils/host'
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"

var controller = (function ($, window, document) {


var _html =`<ul>`;
  var userId = oGetVars.userId;
    var restMoney = oGetVars.restMoney

//  首次加载初始化
    function init(list,html) {
            let data = {
                userId:userId
            }
                $.ajax({
                                type: "post",
                                url: baseUrl + '/reward/clickwithdraw',
                                data: data,
                                beforeSend: function (XMLHttpRequest) {
                                    
                                },
                                success: function (json) {
                                    if (json.status == "0") {
                                        addHtmlToTtileList(json.data) ;                                                                           
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




    // 标题的循环
    function addHtmlToTtileList(list,html) {
        if (list.clickWithDraw) {
            let len = list.clickWithDraw.length
            let _active = false
            let dataList;
            for (let i=0; i<len; i++) {
                dataList = list.clickWithDraw[i]
                _active=dataList['status']==1 ? '提现中...':'提现成功';
                _html+=` 
                    <li>
                        <span>${dataList['cashDate']}月</span>
                        <span>${dataList['cashMoney']}</span>
                        <span>${_active}</span>
                    </li>`

            }
        }
    
        _html+=`</ul>
            <div>
                总计提现：${list.amount}元
            </div>
            `
        $('#withdraw').html(_html);
        $('#money').html(restMoney)
    }

    //－－－－－－－－－－－申请提现－－－－－－－－－－－

    //  $('#apply').on('click',function(){
    //      $('#ruleModal').show()
    //  })

    //  $('#returnCollect').on('click',function(){
    //      $('#ruleModal').hide()
    //  })
    //下载按钮id（jquery）一下为安卓判定
        // $('#button').click(function() {
        //     let ifr = document.createElement('iframe');
        //     ifr.src = 'jap://jap.dxt.com?abbr=19990';//传值（abbr：房间号）
        //     ifr.style.display = 'none';
        //     document.body.appendChild(ifr);
        //     //记录唤醒时间
        //     let openTime = new Date();
        //     //唤醒超时，跳转到下载连接
        //     window.setTimeout(function(){
        //         document.body.removeChild(ifr);
        //         //如果setTimeout 回调超过2500ms，则弹出下载
        //         if( (+new Date()) - openTime > 2500 ){
        //             window.location = '下载地址链接';//跳到指定的下载界面
                   
        //         }
        //     },2000)

        // })

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