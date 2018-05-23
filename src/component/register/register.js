var md5 = require('md5')

// import $ from 'jquery'
import {baseUrl,host,oGetVars,version} from '../../utils/host'

import "../../utils/main750"
import"../../styles/base.css"
import "../../styles/mobile.css"
import "../../styles/banner.css"
import "../../styles/modal.css"
import "./register.css"
import {loadingHide,loadShow,loadHide,noticeSetTimeoutPublick}  from "../../utils/loading"


var controller = (function ($, window, document) {
        var registerBtn$=$("#registerBtn");
        var btn$=$("#btn");
        var phoneCode = false;
        var getVerificationCode = false;
        var ifClickVerification = true;
        var againPassword = false;//默认再次输入密码
        var setVerificationCode=false;//每天写验证码就是false，填写了就是该验证码；
        var inputType = false //false==password
        var againPassword$ = $("#againPassword")//在此输入密码
        var returnCancel=$("#return-cancel")//关闭图形验证码
        var refreshBtnNmg = $("#refreshBtn-img")//图文验证码图片
        var refreshBtn$ = $("#refreshBtn")// 刷新图片
        var getVerification = 'http://api.con.hbluck.com/appuser/smsAuthCode?mobile='//验证码的链接
        var verificationLayout$ = $("#verificationLayout")//图文验证码逻辑
        var modalVerification$ = $("#modal-verification")
        var verificationPictureCode$ = $("#verificationPictureCode")//input
        var verificationPictureCode = false;//图文验证码的纪录
    //注册环节
    var i=0

    //－－－－－－－－图文验证吗更新－－－－－－－－－－
    refreshBtn$.on("click",function(){
        if (phoneCode){
            let getVerificationCode = getVerification+phoneCode+'&i='+i
            i++
            let _html=`<img src='${getVerificationCode}' alt="${i}"/>`
                    
            refreshBtnNmg.html(_html)
        }else {
            noticeSetTimeoutPublick("电话号码不能为空");
        }
    })

    //－－－－－－－关闭层－－－－－－－
    returnCancel.on('click',function(){
        modalVerification$.hide()
    })
    //－－－－－－－－－手机号码－－－－－－－－－－－－
    $("#phoneInput").on("input",phoneInputFn)

    //－－－－－－－－图文验证码逻辑－－－－－－－－－
    verificationLayout$.on("click",function(){
         if (ifClickVerification) {
                    phoneCode = (/^1(3|4|5|7|8)\d{9}$/.test(phoneCode)) ? phoneCode: false;
                // console.log(phoneCode)
                getVerificationCode = false;//每次点击都重新获取验证码，要重置
                if (phoneCode) {
                    
                    verificationPictureHtml()

                    modalVerification$.show()
                    
                } else {
                    noticeSetTimeoutPublick("您的号码不符合中国电话号码规则");
                    $("#phoneInput").focus().val(''); 

                }
                
            } else {
                noticeSetTimeoutPublick("1分钟后才可以再次获取验证码")
            }
    })

    //－－－－－－－－－图文验证码逻辑－－－－－－－－－－
    function verificationPictureHtml(){
        let getVerificationCode = getVerification+phoneCode
        let _html=`<img src='${getVerificationCode}'/>`
        
        refreshBtnNmg.html(_html)
        verificationPictureCode$.focus().val(''); 
    }
    //－－－－－－图文验证码获取焦点－－－－－－－－－－－
    verificationPictureCode$.focus()
    //－－－－－－验证吗逻辑－－－－－－－－－－－－－－－－

        $("#verificationCode").on("click",function(){
            verificationPictureCode=verificationPictureCode$.val()//图文验证码复制给变量
            // console.log(verificationPictureCode)
            if (phoneCode) {
                    verificationPictureCode = (/^[0-9a-zA-Z]{4}$/.test(verificationPictureCode)) ? verificationPictureCode: false;
                // console.log(phoneCode)
                getVerificationCode = false;//每次点击都重新获取验证码，要重置
                if (verificationPictureCode ) {
                    let data = {mobile:phoneCode,smsAuthCode:verificationPictureCode}
                    let _html = verificationLayout$

                    
                    //todo 请求
                    $.ajax({
                            type: "post",
                            url: baseUrl + '/appuser/sendcode',
                            data: data,
                            beforeSend: function (XMLHttpRequest) {
                                loadShow()
                            },
                            success: function (json) {
                                // console.log(json.status)
                                if (json.status == "0") {
                                    getVerificationCode = true;//后台发送验证码
                                    modalVerification$.hide()
                                    setLoop(_html)//给用户反馈验证码倒计时
                                    verificationPictureHtml()
                                } else if(json.status == "2"){
                                        resetPictureCodeFn()
                                       

                                }else {
                                    noticeSetTimeoutPublick("网络不畅，敬请原谅！")
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
                    resetPictureCodeFn()

                }
                
            } else {
                noticeSetTimeoutPublick("1分钟后才可以再次获取验证码")
            }
            
            

        })

    //－－－－－－－－图形验证码错误后进行重新获取焦点－－－－－－－－－－－
    function resetPictureCodeFn(){
        noticeSetTimeoutPublick("图形验证码错误！");
        verificationPictureCode$.focus().val(''); 
    }
    //验证码逻辑
        function setLoop(_html){
            let i = 60;
            ifClickVerification = false;
            _html.removeClass("active");
            var _varificationLoop = setInterval(function(){
                if (!i) {
                clearInterval(_varificationLoop);
                _html.addClass("active");
                _html.html("获取验证码")
                ifClickVerification = true
                } else{
                    _html.html(`${i} (秒)`)
                }
                i--
                
            },1000)
        }

    

        //验证码
        $("#verificationCodeInput").on("input",function(){
            let value = $(this).val();
            let len = value.length;
            if (len>6) {
                noticeSetTimeoutPublick("请填写真实的验证码。")
                $(this).focus().val(''); 
            } else if (!len) {
                setVerificationCode = false;

            } else if(len == 6){
                setVerificationCode = value;
            }
        })

        // 点击密码眼镜的逻辑的input标签逻辑；
        $("#openEye").on("click",function(){
            inputType= !inputType
            if (inputType) {
                $("#setingPassword").attr("type","text").focus()
                $('#openEye').attr('class','active')
            } else {
                $("#setingPassword").attr("type","password").focus()
                $('#openEye').attr('class','')
            }
            
        })

        //－－－－－－再次输入密码－－－－－－－
        againPassword$.on("input", function(){
            let value = $("#setingPassword").val();
            let val = $(this).val();
            let REG = new RegExp(value)
            if ( REG.test(val) ) {
                againPassword = true;
            } else {
                againPassword = false;
            }
        })
        //设置密码

      
        //提交按钮
        $("#registerSumit").on("click",function(){
            let value = $("#setingPassword").val();
            let setingPasswordCode = /^[A-Za-z0-9]+$/.test(value)?value : false;
            phoneCode = phoneCode? phoneCode:$('#phoneInput').val()
            if ( setVerificationCode && getVerificationCode && phoneCode) {
                    if (setingPasswordCode && setingPasswordCode.length>=6) {
                        //todo ajax
                        alert(md5(setingPasswordCode))
                        let md5Password = md5(setingPasswordCode)
                            md5Password = md5Password.substr(0,16)
                            // console.log(md5Password.length)
                        if (againPassword) {
                            let data ={
                                mobile:phoneCode,code:setVerificationCode,
                                password:md5Password
                            }
                            $.ajax({
                                type: "post",
                                url: baseUrl + '/appuser/register',
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
                        }else {
                            noticeSetTimeoutPublick("再次输入密码不一致，请查看！")
                        } 
           
                    } else { 
                        
                        noticeSetTimeoutPublick("请填写数字加英文组合的六位以上的密码。")
                        $("#setingPassword").focus().val(''); 
                    }
            } else {
                    noticeSetTimeoutPublick("请认真填写注册流程(全为必填选项)，谢谢。")
                    
                }
        
            // console.log(setVerificationCode,getVerificationCode,phoneCode)
            
        })


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
                                    location.href=`${host}index.html?v=${version}`
        }

        //--------------------------
        if(oGetVars.name){
            $('title').html(oGetVars.name)
        }
})($, window, document);

$(function(){
    loadingHide()
 
})