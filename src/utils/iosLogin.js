	 // －－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
	 
	 var IOScallback = function(bridge) {
		bridge.callHandler('ISAPP', {}, function responseCallback(responseData) {
			
			//app 将用户信息返回于responseData中
			if(responseData.msg == 2)
				{ 
					//msg为2代表返回正常，用户登录成功
					//user 信息存储与 responseData.user中
					// alert(responseData.user)
					window.IOSmsg = responseData.userId
				}
				else if(responseData.msg == 1)
					{
						//msg为1代表返回正常，用户未在app登录
						window.IOSmsg = 1
						
					}
				})
			}

	 function setupWebViewJavascriptBridge( ) {
		 var callback = IOScallback
		if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
		if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
		window.WVJBCallbacks = [callback];
		var WVJBIframe = document.createElement('iframe');
		WVJBIframe.style.display = 'none';
		WVJBIframe.src = 'https://__bridge_loaded__';
		document.documentElement.appendChild(WVJBIframe);
		setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
		alert('进入环境点击下一步')
		
	}
	
	function checkFromApp()
	{
		if (checkPlatform() == 0) {
			//安卓代码
			if(window.androidgo || window.redpackage) return true;
		} else if (checkPlatform() == 1){
				return true;
			
		}
		return false;
	
	}
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
			return null;
		}
	}
	
	function checkPlatform() {
		if (/android/i.test(navigator.userAgent)) {
			return 0 //这是Android平台下浏览器
		}
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			return 1; //这是iOS平台下浏览器
		}
		if (/qiang/i.test(navigator.userAgent)) {
			return 2; //这是iOS平台下app
		}
	}
	
	function is_weixn() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}
	
	// function checkIsLogin()
	// {
	 //    performProcessWithFunc({
	 //    	'method':'checkLogin'
	// 		,'data':{}
	 //    },function (response) {
	// 		if(response.msg == 1)
	// 		{
	// 			//获取用户信息
	// 			alert(response.user.id);
	// 		}
	 //    })
	//
	// }
	
	function performProcessWithFunc(performDic,callback) {
	
		if (is_weixn()){
			// wx.closeWindow();
		} else if (checkPlatform() == 0) {
	
			//安卓代码
			// if(window.redpackage)
			// 		window.redpackage.performProcess(JSON.stringify(performDic));
		} else {
			setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('performProcess',performDic, callback);
			})
	
	
		}
	
	}

	


	
	
	// －－－－－－－－－－ios方法调用不是一上来就要吊用这个方法－－－－－－－－－－－－－－－－－－－

	
	// setupWebViewJavascriptBridge()
	
        export  {performProcessWithFunc,setupWebViewJavascriptBridge} 


		



