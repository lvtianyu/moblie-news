import "../../utils/main750"
import {baseUrl,oGetVars,host} from '../../utils/host'

import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/modal.css"
// import "../../styles/Picture.scss"
import"./collectPage.css"
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting}  from "../../utils/loading"
////import FastClick from  "../../utils/fastclick"



//new FastClick(document.body);//防止快速点击
var controller = (function ($, window, document) {
    let userId = userData.userId
     var target = document.getElementById('list-ul')
     function init(list) {
                let   data = {
                    userId:userId
                }

            $.ajax({
                type: "post",
                url: baseUrl + '/article/collectArticleList',
                data: data,
                beforeSend: function (XMLHttpRequest) {
                },
                success: function (json) {
                    if (json.status == "0") {
                        // console.log(json)
                        addHtmlToListFn(json.data.article);
                    } else {
                        noticeSetTimeoutPublick("服务器忙！")
                    }

                },
                complete: function (XMLHttpRequest) {

                },
                error: function () {
                        noticeSetTimeoutPublick("网络不畅，敬请原谅！")

                }
                });

        }

    //－－－－－－－－－－初始化列表－－－－－－－－－－－－
    function addHtmlToListFn(list){
        let len = list.length
        let _html = "";
        let dataList;
        if (len>0){
            for (let i=0; i<len; i++){
                    dataList = list[i]

                    _html += `<li  class="list-li" >
                                <a class="con" href="${dataList['url']}">
                                ${dataList['title']}
                                </a>
                                <div class="btn" data-message="${dataList['id']}">删除</div>
                            </li>`
                }
        }else {
            _html=`<li class="Noting">还没有收藏内容哦！</li>`
        }
    
        target.innerHTML = _html;
        // setTimeout(function(){
            touchDeleteList()
        // },50)
    }
    //－－－－－－－－－收藏列表滑动方法－－－－－－－－－
     function touchDeleteList(){

     
        var initX; //触摸位置
        var moveX; //滑动时的位置
        var X = 0; //移动距离
        var objX = 0; //目标对象位置
        target.addEventListener('touchstart', function(event) {
        // event.preventDefault();
        // console.log(event.target.parentNode)
        var obj = event.target.parentNode;
            
        if (obj.className == "list-li") {
            initX = event.targetTouches[0].pageX;
            objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
        }
        if (objX == 0) {
            target.addEventListener('touchmove', function(event) {
            // event.preventDefault();
            var obj = event.target.parentNode;
            if (obj.className == "list-li") {
                moveX = event.targetTouches[0].pageX;
                X = moveX - initX;
                if (X >= 0) {
                obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                } else if (X < 0) {
                var l = Math.abs(X);
                obj.style.WebkitTransform = "translateX(" + -l + "px)";
                if (l > 80) {
                    l = 80;
                    obj.style.WebkitTransform = "translateX(" + -l + "px)";
                }
                }
            }
            });
        } else if (objX < 0) {
            target.addEventListener('touchmove', function(event) {
            // event.preventDefault();
            var obj = event.target.parentNode;
            if (obj.className == "list-li") {
                moveX = event.targetTouches[0].pageX;
                X = moveX - initX;
                if (X >= 0) {
                var r = -80 + Math.abs(X);
                obj.style.WebkitTransform = "translateX(" + r + "px)";
                if (r > 0) {
                    r = 0;
                    obj.style.WebkitTransform = "translateX(" + r + "px)";
                }
                } else { //向左滑动
                obj.style.WebkitTransform = "translateX(" + -80 + "px)";
                }
            }
            });
        }

        })
        target.addEventListener('touchend', function(event) {
        // event.preventDefault();
        var obj = event.target.parentNode;
        if (obj.className == "list-li") {
            objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
            if (objX > -40) {
            obj.style.WebkitTransform = "translateX(" + 0 + "px)";
            objX = 0;
            } else {
            obj.style.WebkitTransform = "translateX(" + -80 + "px)";
            objX = -80;
            }
        }
        })



        $('.btn').on('click',function(){
            // console.log($(this).parent())
            $(this).parent().hide()
            var id = $(this).attr('data-message')
            deleteAjaxFn(id)
        })

    }
    //－－－－－－－－－删除ajax－－－－－－－－－－－－

    function deleteAjaxFn(id){
           let data = {
                    userId:userId,
                    id:id
                }

            $.ajax({
                type: "post",
                url: baseUrl + '/article/deleteCollectArticle',
                data: data,
                beforeSend: function (XMLHttpRequest) {
                },
                success: function (json) {
                    if (json.status == "0") {
                        
                    } else {
                        noticeSetTimeoutPublick("服务器忙！")
                    }

                },
                complete: function (XMLHttpRequest) {

                },
                error: function () {
                        noticeSetTimeoutPublick("网络不畅，敬请原谅！")

                }
                });
    }

    // －－－－－－－－点击进入文章详情－－－－－－－－－－－

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
        controller.doInit()
})




    /*
    * SwipeOut
    * version 0.1.0
    * https://github.com/ankane/swipeout
    * Licensed under the MIT license.
    */

    /*jslint browser: true, indent: 2 */
    /*global Hammer*/

    // function SwipeOut(listEl, options) {
    //     'use strict';

    //     options = options || {};

    //     var swiped = false,
    //         preventSwipe = false,
    //         hammer = null,
    //         deleteBtn = document.createElement("div"),
    //         btnText = options.btnText || "取消收藏",
    //         touchable = "ontouchstart" in window;

    //     // generic helpers

    //     // http://stackoverflow.com/questions/195951/change-an-elements-css-class-with-javascript
    //     function addClass(el, cssClass) {
    //         el.className += (" " + cssClass);
    //     }
    //     //－－－－上次元素方法－－－－－－－
    //     function removeElement(el) {
    //         if (el.parentNode) {
    //         el.parentNode.removeChild(el);
    //         console.log()
    //         }
    //     }

    //     function addCss(css) {
    //         var head = document.getElementsByTagName("head")[0],
    //         style = document.createElement("style");

    //         style.type = "text/css";
    //         if (style.styleSheet) {
    //         style.styleSheet.cssText = css;
    //         } else {
    //         style.appendChild(document.createTextNode(css));
    //         }

    //         head.appendChild(style);
    //     }

    //     // custom helpers

    //     function findListItemNode(el) {
    //         var currentEl = el;
    //         while (currentEl && currentEl.parentNode !== listEl) {
    //         currentEl = currentEl.parentNode;
    //         }
    //         return currentEl;
    //     }

    //     function transform(style) {
    //         deleteBtn.style.transform = style;
    //         deleteBtn.style.webkitTransform = style;
    //         deleteBtn.style.mozTransform = style;
    //         deleteBtn.style.oTransform = style;
    //     }

    //     function hideButton() {
    //         swiped = false;
    //         deleteBtn.style.opacity = 0;
    //         transform("translate3d(20px,0,0)"); // use 3d for hardware acceleration
    //     }

    //     function centerButton() {
    //         deleteBtn.style.top = ((findListItemNode(deleteBtn).offsetHeight - deleteBtn.offsetHeight) / 2) + "px";
    //     }

    //     function showButton() {
    //         centerButton();
    //         deleteBtn.style.opacity = 1;
    //         transform("translate3d(0,0,0)");
    //     }

    //     // events

    //     // trap click events on list when delete is shown
    //     // http://stackoverflow.com/questions/6157486/jquery-trap-all-click-events-before-they-happen
    //     function onClick(e) {
    //         if (swiped || preventSwipe) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         }
    //         if (swiped && e.target === deleteBtn) {
    //         var li = findListItemNode(e.target),
    //             event = document.createEvent("Events");

    //         // must send event before removal from the dom
    //         event.initEvent("delete", true, true, null, null, null, null, null, null, null, null, null, null, null, null);
    //         li.dispatchEvent(event);

    //         removeElement(li);
    //         hideButton();
    //         }
    //     }

    //     function onTouchStart(e) {
    //         preventSwipe = false;
    //         if (swiped && e.target !== deleteBtn) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         hideButton();
    //         preventSwipe = true;
    //         }
    //     }

    //     function onOrientationChange() {
    //         centerButton();
    //     }

    //     function onDragStart(e) {
    //         if (!preventSwipe) {
    //         if (swiped) {
    //             hideButton();
    //         } else {
    //             // add delete button
    //             swiped = true;
    //             var li = findListItemNode(e.target);
    //             removeElement(deleteBtn);
    //             li.appendChild(deleteBtn);
    //             showButton(deleteBtn);
    //         }
    //         }
    //     }

    //     // attach / detach events

    //     function attachEvents() {
    //         listEl.addEventListener("click", onClick, true);
    //         if (touchable) {
    //         listEl.addEventListener("touchstart", onTouchStart, false);
    //         } else {
    //         listEl.addEventListener("mousedown", onTouchStart, false);
    //         }
    //         window.addEventListener("orientationchange", onOrientationChange, false);
    //         hammer = Hammer(listEl, {drag_vertical: false}).on("dragstart", onDragStart);
    //     }

    //     function detachEvents() {
    //         removeElement(deleteBtn);
    //         hammer.off("dragstart");
    //         window.removeEventListener("orientationchange", onOrientationChange, false);
    //         if (touchable) {
    //         listEl.removeEventListener("touchstart", onTouchStart, false);
    //         } else {
    //         listEl.removeEventListener("mousedown", onTouchStart, false);
    //         }
    //         listEl.removeEventListener("click", onClick, true);
    //     }

    //     // add text
    //     deleteBtn.appendChild(document.createTextNode(btnText));

    //     // style button
    //     deleteBtn.style.position = "absolute";
    //     deleteBtn.style.right = "0px";//修改6px
    //     deleteBtn.style.transition = "transform 0.25s ease-in-out, opacity 0.25s ease-in-out";
    //     deleteBtn.style.webkitTransition = "-webkit-transform 0.25s ease-in-out, opacity 0.25s ease-in-out";
    //     deleteBtn.style.mozTransition = "-moz-transform 0.25s ease-in-out, opacity 0.25s ease-in-out";
    //     deleteBtn.style.oTransition = "-o-transform 0.25s ease-in-out, opacity 0.25s ease-in-out";
    //     hideButton();
    //     addClass(deleteBtn, "delete-btn");

    //     // style list items
    //     // TODO insert only once per page and clean up
    //     addCss(".swipe-out > li { position: relative; }");

    //     // style list
    //     listEl.style.overflow = "hidden";
    //     addClass(listEl, "swipe-out");

    //     attachEvents();

    //     // public methods
    //     console.log(this)
    //     // this.destroy = function () {
    //     //     detachEvents();
    //     // };
    // }



    //   SwipeOut(document.getElementById("list"))