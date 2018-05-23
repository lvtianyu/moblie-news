  var viewWidth ,//做永久存储
        html = document.documentElement;//获得html

    if (!viewWidth) {
        if (html) {
            var windowWidth = html.clientWidth / 7.5;
            viewWidth = windowWidth + 'px';
            // localStorage.setItem("viewWidth", viewWidth);
        }
    }
    html.style.fontSize=viewWidth // 设置根元素的字体大小

       var Host = 'madmin.zhongxyh.cn'




    export {Host}