var md5 = require('md5')
// import $ from 'jquery'
import {baseUrl,host,oGetVars} from '../../utils/host'


import "../../utils/main750"
import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import "./login.css"
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick}  from "../../utils/loading"


var controller = (function ($, window, document) {
       var registerBtn$=$("#registerBtn");
        var btn$=$("#btn");
        var phoneCode = false;
        var getVerificationCode = false;
        var ifClickVerification = true;
        var setVerificationCode=false;//每天写验证码就是false，填写了就是该验证码；
        var inputType = false //false==password

    //----------------登录环节-----------------------------
        $("#phoneInput").on("input",phoneInputFn)

    //----------------

    function phoneInputFn() {
        var phone =$(this).val();
        var _phoneCode ;
        let len = phone.length;
                    if ( len == 11) {
                        phoneCode = phone
                        return;
                    } 
                    if ( len>11){
                        noticeSetTimeoutPublick("您的号码位数不正确");
                        $(this).focus().val(''); 
                    }
        }

        $("#loginSubmit").on("click",function(){
            let value = $("#setingPassword").val();
            phoneCode = phoneCode || $('#phoneInput').val()
            let setingPasswordCode = /^[A-Za-z0-9]+$/.test(value)?value : false;

            phoneCode = (/^1(3|4|5|7|8)\d{9}$/.test(phoneCode)) ? phoneCode: false;
            if (phoneCode && setingPasswordCode.length>=6) {
                
                // console.log(md5._hh(setingPasswordCode))
                let md5Password = md5(setingPasswordCode)
                    md5Password = md5Password.substr(0,16)
                    // console.log(md5Password.length)

                 

                let data ={mobile:phoneCode,password:md5Password}
                $.ajax({
                            type: "post",
                            url: baseUrl + '/appuser/login',
                            data: data,
                            beforeSend: function (XMLHttpRequest) {
                                loadShow()
                            },
                            success: function (json) {
                                // console.log(json)
                                if (json.status == "0") {
                                    loginSucess(json) 
                                
                                } else {

                                noticeSetTimeoutPublick(json.msg)
                                   
                                }

                            },
                            complete: function (XMLHttpRequest) {
                                loadHide()
                            },
                            error: function () {
                            noticeSetTimeoutPublick("网络不畅，敬请原谅！")

                            }
                        });
            } else {
                noticeSetTimeoutPublick("账号或密码输入有误！");
            }
        })

    //登录和注册成功统一跳转
        function loginSucess(json) {
            var userData={
                                        userId:json.data.user.userId,
                                        mobile:json.data.user.mobile,
                                      

                                    },
                baseDate = {
                                        nikeName:json.data.user.nikeName,
                                        headImage:json.data.user.headImage,
                                        province:json.data.user.province,
                                        city:json.data.user.city,
                                        age:json.data.user.age,
                                        sex:json.data.user.sex,
                };

                                    userData=JSON.stringify(userData)
                                    baseDate = JSON.stringify(baseDate)
                                    localStorage.setItem('userData',userData);
                                    localStorage.setItem('baseDate',baseDate);
                                    history.back()
        }

        //－－－－－－－－－－－－－－微信环境－－－－－－－－－－－－－－－－－－－－
        function refreshWxLoginLinkUrl(callback, redirectDataPojo) {
            
                // var _redirectDataPojo = {
                //     r : "/pages/index.html", // 以/开头，写全文件名
                // };
                // if (undefined == redirectDataPojo || null == redirectDataPojo) {
                //     // donothing
                // } else {
                //     if ((typeof redirectDataPojo) != "object") {

                //         return;
                //     } else {
                //         _redirectDataPojo = redirectDataPojo;
                //     }
                // }
                // var redirectData = JSON.stringify(_redirectDataPojo);
                //alert(redirectData.length);
                let backHtml = oGetVars.backHtml?oGetVars.backHtml:'0'
                location.href= `${baseUrl}/appuser/thirdlogin/weixin?type=1&backHtml=${backHtml}`
                
            }
        function checkWxLogin() {
            // 判断用户是否登录          
                refreshWxLoginLinkUrl();
            
        }
        var ua = navigator.userAgent.toLowerCase();
        //－－－－－－－－－－－微信环境用微信登录－－－－－－－－－－
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            checkWxLogin();
        }

})($, window, document);

$(function(){
    loadingHide()
})