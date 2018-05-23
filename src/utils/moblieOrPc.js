

function environmentJudgeFn(){
    var arid = arguments[0]
    var u = navigator.userAgent, app = navigator.appVersion;
    // alert(u)
    if (u.indexOf('Mobile') > -1) {
        //     alert('手机')
    } else if (u.indexOf('iPad') > -1) {
        //     alert('')
        location.href = `http://www.zx.dxt.cn/html/article.html?arid=${arid}`
    } else {
        //     alert('pc')
           location.href = `http://www.zx.dxt.cn/html/article.html?arid=${arid}`
        }
}

export default environmentJudgeFn