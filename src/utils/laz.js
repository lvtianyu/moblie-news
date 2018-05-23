  

       // var settings = {
        //     threshold: 0,
        //     failure_limit: 0,
        //     event: 'scroll',
        //     effect: 'show',
        //     container: window,
        //     $ContainerHeight:0,
        //     data_attribute: "original",
        //     skip_invisible: false,
        //     appear: null,
        //     $window : window,
        //     toTopShowFn:function(){},
        //     load: function(){}//载入远程 HTML 文件代码并插入至 DOM 中。
        // };

  
  //一定要设置图片的高度
  $.fn.lazyload = function (options) {
        var elements = this;
        
        var settings = options;

        function update() {
            
            elements.each(function () {
                // console.log($(this).length,$('.lazy').length)
                var $this = $(this);
               
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                // console.log("false", $.belowthefold(this, settings));
                if (!$.belowthefold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                } else {
                    return false;
                }
            });
        }

        // if (options) {
        //     if (undefined !== options.failurelimit) {
        //         options.failure_limit = options.failurelimit;
        //         delete options.failurelimit;
        //     }
        //     if (undefined !== options.effectspeed) {
        //         options.effect_speed = options.effectspeed;
        //         delete options.effectspeed;
        //     }
        //     $.extend(settings, options)
        // }
        // container = (settings.container === undefined || settings.container === window) ? $window : $(settings.container);
        settings.$window.bind(settings.event, function () {//绑定scroll事件;
            return update();
        });
        
        //像页面上加载src属性直的方法
        this.each(function () {
            var self = this;
            var $self = $(self);
            //当出现时触发加载原始图像  为每一个匹配元素的特定事件（像click）绑定一个一次性的事件处理函数。
            $self.one("appear", function () {
                $self.bind("load", function () {
                    var original = $self.attr("data-" + settings.data_attribute);
                    $self.removeClass("lazy");
                    if ($self.is("img")) {
                        $self.attr("src", original);
                    } else {
                        $self.css("background-image", "url('" + original + "')");
                    }
                }).attr("src", $self.attr("data-" + settings.data_attribute));
            });
        });

        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function (event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function () {
                        $(this).trigger("appear");
                    })
                }
            })
        }
        //强制初始检查，如果图像出现
        update();
        return this
    };
    $.belowthefold = function (element, settings) {
        var fold = (window.innerHeight ? window.innerHeight : winHeight) +settings.$window.scrollTop();
        settings.toTopShowFn( fold );
        // console.log(fold,settings.$ContainerHeight)
        if (fold < settings.$ContainerHeight) {
            return fold <= $(element).offset().top - settings.threshold;
        } else if (fold == settings.$ContainerHeight) {
            // if(settings.isUpdata){//当等于false时候就不能进行请求了
                // settings.load();//这里当页面的高的等于可滑动的最大高度时候我们就进行加载一页的计划
                return false;//这个地方原来是 true
            // }

        }
        
    };

 