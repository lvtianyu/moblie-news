
var loadingHide = function () {
    document.getElementById("loading").setAttribute("style","display:none")
}

var loadShow = function () {
    document.getElementById("load").setAttribute("style","display:block")
}
var loadHide = function () {
    document.getElementById("load").setAttribute("style","display:none")
}

var noticeFn = function () {
    document.getElementById("notice").setAttribute("style","display:block")
}

function noticeSetTimeoutPublick(d) {
    var e = document.getElementById("notice");
    if (d) {
        document.getElementById("notice-text").textContent = d
    }
    e.setAttribute("style","display:block");
    var f = setTimeout(function () {
        e.setAttribute("style","display:none");
        clearTimeout(f)
    }, 5000)
}

function lazOpen() {
   // Boole代表true是加载中false是没有更多
    var loadingMore$ =document.getElementById("loadingMore");

        loadingMore$.innerHTML=`<b></b> 加载中...`;
        loadingMore$.setAttribute("style","visibility:visible");

}

function lazClose(){
    //    var f = setTimeout(function () {
         document.getElementById("loadingMore").setAttribute("style","visibility:hidden");
    //     clearTimeout(f)
    // }, 1000)
    
}

function lazNoting() {
      var loadingMore$ =document.getElementById("loadingMore");

        loadingMore$.innerHTML=`没有更多内容...`;
        loadingMore$.setAttribute("style","visibility:visible");
    //  var f = setTimeout(function () {
    //     // lazClose()
    //     clearTimeout(f)
    // }, 2000)
}

export {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick,lazOpen,lazClose,lazNoting} 