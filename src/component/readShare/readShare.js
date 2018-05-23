var circleProgress = require('../../utils/circle-progress')

import "../../utils/main750"
import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import"../recommend/recommend.css"
import "./readShare.css"
import'../../utils/laz'
import {baseUrl,version} from '../../utils/host'
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"
import {settings, lazyload} from '../../utils/lazUpdate'




var controller = (function ($, window, document) {

    var 
        bodyList$ = $("#bodyList"),
        cursor =0,
        count =20 ,
        isUpdate = true,
        isFrist = true,
        userId = userData.userId;//登录人的uderid

    //  首次加载初始化
    function init() {
        if (!isUpdate) {
            return
        }
        isUpdate = false
            let data = {userId:userId,cursor:cursor,count:count}
                lazOpen()

                $.ajax({
                                type: "post",
                                url: baseUrl + '/reward/share',
                                data: data,
                                beforeSend: function (XMLHttpRequest) {
                                    
                                },
                                success: function (json) {
                                    if (json.status == "0") {
                                        addHtmlToListFn(json.data.reward) ;
                                        cursor +=count
                                    
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



    // listprogress
    var listprogress=[]
    // 
    function addHtmlToListFn(list,html) {
        let len = list.length
        let _html = "";
        let liClass;
        let active;
        let pHtml;
        let divClass;
        let readStatus;
        let dataList;
        let url;
        if (len>0) {
            for (let i=0; i<len; i++) {
                        dataList = list[i]
                        if (dataList["gd"]) {
                            liClass="lad";
                            divClass=""

                            pHtml=''
                            url = dataList['title']
                        } else {
                            liClass="default";
                            divClass="share"
                            
                            if (dataList['readStatus'] ==2) {
                                readStatus ='您已经分享'
                                active = ''
                            } else if (dataList['readStatus'] ==3){
                                readStatus ='分享已达最大上限'
                                active = ''
                            } else {
                                readStatus =` 赚¥${dataList['rewardMoney']}`
                                active = 'active'
                            }

                            url = `id=${dataList['articleId']}&userId=${userId}&share=${dataList['readStatus']}&rewardMoney=${dataList['rewardMoney']}&v=${version}`
                            url = escape(url)
                            url = `detailsMessage.html?${url}`
                            pHtml = `<li><a class="gotopage-A" href="${url}">
                                                    ${dataList['title']}
                                        </a>
                                        <div class="${divClass}">
                            <span class='${active} first-span'><i ></i>${readStatus}</span>
                            <span class="last-span progress">${dataList['readPercent']}%</span></div> </li>`

                            listprogress.push(dataList['readPercent'])
                        }
                    
                        _html +=  `<li class="${liClass}">
                                        <ul >
                                            <li>

                                                <a href="${url}">
                                                    <img src="" data-original="${dataList['cover']}" class="lazy" >
                                                </a>
                                            </li>
                                                ${pHtml}
                                        </ul>
                        
                                    
                                </li>`
                    }
                    bodyList$.append(_html)
                    settings.$ContainerHeight = container.outerHeight()
                      if (settings.isUpdata){

                            lazyload();
                        }
                    testcircle(listprogress)
                    isUpdate = true
                    if(len<count){
                        
                        lazNoting();
                        isUpdate = false

                    }
        } else{
                        lazNoting();
                        isUpdate = false
        }
       
        
    }

    function testcircle(test){
        var list = $(".progress");
        var len = list.length
        for (var i=0;i<len;i++) {
        list.eq(i).circleProgress({
            value: test[i]/100,
            size:90,
            fill: {
                gradient: ["red", "orange"]
            }
        });
        }
        
    }

      //－－－－－－－－－－－－和分享页面共用方法到后期可以优化－－－－－－－－－－－－－－－
    $('#rule').on('click',function(){
        $('#ruleModal').show()
    })
     $('#ruleModal').on('click',function(){
         $(this).hide()
     })

  // // －－－－－－懒加载的设置－－－－－－－－－－
   
        var container =  $(document)
        var $ContainerHeight = container.outerHeight();
         settings.load=function(){
                init()
            }
        settings.$ContainerHeight = $ContainerHeight


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

