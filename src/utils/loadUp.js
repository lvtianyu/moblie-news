
var MyDropLoad;


var fresh = true;
export default MyDropLoad = function(init,me){

        me.opts =  {
            scrollArea : me.$element,                                            // 滑动区域
            domUp : {                                                            // 上方DOM
                domClass   : 'dropload-up',
                domRefresh : ' <div class="dropload-update"><span id="routeId">↓</span></div>',
                domLoad    : '<div class="dropload-load"><div class="load-div"><span class="loading-up"></span></div></div>'
            },

            autoLoad : true,                                                     // 自动加载
            distance : 90,                                                       // 拉动距离
            threshold : '',                                                      // 提前加载距离
            loadUpFn : init,                                                      
           
        }

        
        me.$element.bind('touchstart',function(e){
                fnTouches(e);
                fnTouchstart(e, me);
        });
        me.$element.bind('touchmove',function(e){
                e.preventDefault();
                fnTouches(e, me);
                fnTouchmove(e, me);
        });
        me.$element.bind('touchend',function(e){
                 
                               fnTouchend(me);   

                            
               
        });

   
    };

    //取消jquery的绑定事件和默认行为

    function cancelFn(e,me){
                   e.stopPropagation();
        window.event.cancelBubble = true;
        me.$element.unbind('touchstart touchmove touchend') 
    }

    // touches
    function fnTouches(e){
        if(!e.touches){
            e.touches = e.originalEvent.touches;
        }
    }

    // touchstart
    function fnTouchstart(e, me){
        me._startY = e.touches[0].pageY;
        //  console.log(me._startY)
        // 记住触摸时的scrolltop值
    }

    // touchmove
    function fnTouchmove(e, me){
        me._curY = e.touches[0].pageY;
        me._moveY = me._curY - me._startY;
        if(me._moveY > 0){
            me.direction = 'down';

            loadDown (me)
        }else if(me._moveY < 0 && fresh){
            me.direction = 'up';
            cancelFn(e, me)
        }

    }

    function loadDown (me){
        fresh = false
         var _absMoveY = Math.abs(me._moveY);
          // 加载上方
        if(me.opts.loadUpFn != '' && me.direction == 'down' && !me.isLockUp){
            

            me.$domUp = $('.'+me.opts.domUp.domClass);
            // 如果加载区没有DOM
            if(!me.upInsertDOM){
                me.$element.prepend('<div class="'+me.opts.domUp.domClass+'"></div>');
                me.upInsertDOM = true;
            }
            
            fnTransition(me.$domUp,0);

            // 下拉
            if(_absMoveY <= me.opts.distance){
                me._offsetY = _absMoveY;
                // todo：move时会不断清空、增加dom，有可能影响性能，下同
                me.$domUp.html(me.opts.domUp.domRefresh);
                $('#routeId').attr("style",  "-webkit-transform: rotate(" + me._offsetY*2 + "deg)")
               
            // 指定距离 < 下拉距离 < 指定距离*2
            }else if(_absMoveY > me.opts.distance && _absMoveY <= me.opts.distance*2){
                me._offsetY = me.opts.distance+(_absMoveY-me.opts.distance)*0.5;
                // me.$domUp.html(me.opts.domUp.domUpdate);
                 $('#routeId').attr("style",  "-webkit-transform: rotate(180deg)")
            // 下拉距离 > 指定距离*2
            }else{
                me._offsetY = me.opts.distance+me.opts.distance*0.5+(_absMoveY-me.opts.distance*2)*0.2;
            }

            me.$domUp.css({'height': me._offsetY});
        }
    }

    // touchend
    function fnTouchend(me){
        
        var _absMoveY = Math.abs(me._moveY);
       
        if( me.direction == 'down'){
            fnTransition(me.$domUp,300);

            if(_absMoveY > me.opts.distance){
                me.$domUp.css({'height':me.$domUp.children().height()});
                me.$domUp.html(me.opts.domUp.domLoad);
                me.opts.loadUpFn(me);

            }
            
            me.$domUp.css({'height':'0'}).one('webkitTransitionEnd mozTransitionEnd transitionend',function(){
                    me.upInsertDOM = false;
                    $(this).remove();
                    fresh = true
                    //  console.log(fresh)             
                });
            
            
        }
        me._moveY = 0;
    }

   
    // css过渡
    function fnTransition(dom,num){
        dom.css({
            '-webkit-transition':'all '+num+'ms',
            'transition':'all '+num+'ms'
        });
    }

