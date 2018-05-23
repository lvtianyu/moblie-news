var userData = localStorage.getItem('userData');
    userData = JSON.parse(userData);
    
if (userData){
    if(userData.mobile && userData.userId){
        // console.log('电话登录')
    }else if(!userData.mobile && userData.userId){
        // console.log('第三方登录')
    }else {
        location.href=`http://wap.zx.dxt.cn/login.html?v=2`;
    }

} else{
                    // location.href='http://192.168.1.104:9090/login.html';
                    location.href=`http://wap.zx.dxt.cn/login.html?v=2`;                    

}
