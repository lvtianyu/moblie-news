// 当开启debug模式时意味着是线下测试

var debug = false;

var version = 1;//目前版本为第一版1

//基础连接用于接口的

var baseUrl = "http://api.con.hbluck.com";
var host = "http://192.168.1.104:9090/"
// var host = "http://wap.zx.dxt.cn/";

var oGetVars = new (function (sSearch) {
	sSearch = unescape(sSearch);//强制执行解码
	var rNull = /^\s*$/, rBool = /^(true|false)$/i;
	function buildValue(sValue) {
		if (rNull.test(sValue)) { return null; }
		if (rBool.test(sValue)) { return sValue.toLowerCase() === "true"; }
		if (isFinite(sValue)) { return parseFloat(sValue); }
		if (isFinite(Date.parse(sValue))) { return new Date(sValue);
		}
		return sValue;
	}
	if (sSearch.length > 1) {
		for (var aItKey, nKeyId = 0, aCouples = sSearch.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
			aItKey = aCouples[nKeyId].split("=");
			this[unescape(aItKey[0])] = aItKey.length > 1 ? buildValue(unescape(aItKey[1])) : null;
		}
	}
})(window.location.search);

export { baseUrl,debug,oGetVars,host,version };