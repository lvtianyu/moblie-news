 // －－－－－－懒加载的设置－－－－－－－－－－
        
        var $toTop = $("#toTop");
        var $window = $(window);
        var winHeight = $window.height();
        var settings = {
            threshold: 0,
            failure_limit: 0,
            event: 'scroll',
            effect: 'show',
            container: window,
            $ContainerHeight:'',
            data_attribute: "original",
            skip_invisible: false,
            $window:$window ,
            isUpdata:true,
            appear: null,
            toTopShowFn:toTopShowFn,
            load:''
            
        };

        function toTopShowFn( fold ) {
                if ( fold <= winHeight ) {
                    $toTop.hide()
                } else {
                    $toTop.show()
                }
                
            }

        $toTop.on("click",function(){

                $window.scrollTop(0)
                $toTop.hide()
            })


         //一定要设置图片的高度
    var lazyload = function () { 
    
        // var elements = $('.lazy');
        function update(isopen) {
            //每一次都用elements存储的$('.lazy')，会造成不是新的$('.lazy')的数量
            lazyLoadFn()// 提前绑定加载$('.lazy')的appear方法
            $('.lazy').each(function () {

                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                //第一次不存在时就用屏幕高度
                if (!(isopen<= $(this).offset().top - 2)) {
                    $this.trigger("appear");
                    
                } else {
                    return false;
                }
            });

        }

      
        $window.scroll(function(){

              var fold = winHeight + settings.$window.scrollTop();
                settings.toTopShowFn( fold )
                if (fold < settings.$ContainerHeight) {
                    return update(fold)
                } else if (fold == settings.$ContainerHeight) {
                        settings.isUpdata = false//为了防止多次加载lazyload方法造成多次绑定
                        settings.load();//这里当页面的高的等于可滑动的最大高度时候我们就进行加载一页的计划
                        return true;//这个地方原来是 true
                }
        })
        
        function lazyLoadFn() {
            //像页面上加载src属性直的方法
            $('.lazy').each(function () {
                var self = this;
                var $self = $(self);
                //当出现时触发加载原始图像  为每一个匹配元素的特定事件（像click）绑定一个一次性的事件处理函数。
                $self.one("appear", function () {
                    $self.bind("load", function () {
                        var original = $self.attr("data-" + settings.data_attribute);
                        $self.removeClass("lazy");
                        if ($self.is('img')) {
                            $self.attr("src", original);
                        } else {
                            $self.css("background-image", "url('" + original + "')");
                        }
                    }).attr("src", $self.attr("data-" + settings.data_attribute));
                });
            });
        }


        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function (event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    $('.lazy').each(function () {
                        $(this).trigger("appear");
                    })
                }
            })
        }
        //强制初始检查，如果图像出现
        update(winHeight);
        
    };



export {settings, lazyload}