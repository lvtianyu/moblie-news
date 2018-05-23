
function loginSucess(json) {
    var userData={
                                userId:json.userId,
                                mobile:json.mobile,
                                openId:json.openId

                            },
        baseDate = {
                                nikeName:json.nikeName,
                                headImage:json.headImage,
                                province:json.province,
                                city:json.city,
                                age:json.age,
                                sex:json.sex,
        };

                            userData=JSON.stringify(userData)
                            baseDate = JSON.stringify(baseDate)
                            localStorage.setItem('userData',userData);
                            localStorage.setItem('baseDate',baseDate);
                            if (json.backHtml!='0' && json.backHtml!='null' && json.backHtml){
                                let url=`id=${json.backHtml}&userId=${json.userId}&v=1`
                                url = escape(url)
                                location.href = `detailsMessage.html?${url}`
                            }else {
                                location.href = `index.html?v=1`
                            }
                            
}


var e = location.search.substring(1);
var g = decodeURIComponent(e);
var h = g.split("&");
var dataurl = {}
for (var c = 0, b = h.length; c < b; c++) {
        var f = h[c];
        var a = f.split("=");
        dataurl[a[0]]=a[1]
    }
    // alert(e)
    loginSucess(dataurl) 