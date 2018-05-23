// var timerSiteLoading;
// SiteLoadingNum=0;
import {TweenMax,ScrollToPlugin} from "gsap"
import $ from "jquery"
import siteLoaded from "../../src/component/love/love"

function preLoad(preLoadImgArr){
	preLoad2(preLoadImgArr);
}
var src,per,toY,toH,bl,n,siteLoaded;
function preLoad2(preLoadImgArr){
	var imgLoadAll = 0;
	var imgList = new Array();
	imgList=preLoadImgArr;
	
	$("img").each(function(){
		src=$(this).attr("src");
		imgLoadAll++;
		imgList.push($(this).attr("src"));
	})
	imgList = getNoRepeat(imgList);

	var timeout = 3000;
	var count = 0;
	var fire = false;
	var fireFn = function(){
		
		fire = true;
		// clearTimeout(timerSiteLoading);
		$(".siteLoading .txt span").text(per+'%');
		siteLoaded();
		// TweenMax.to($(".siteLoading"),1,{autoAlpha:0,display:'none',delay:0,onComplete:function(){$(".siteLoading").remove();}})
		TweenMax.to($(".siteLoading"),1,{autoAlpha:0,display:'none',delay:4,onComplete:function(){$(".siteLoading").remove();}})
	}

	for(var i = 0, len = imgList.length; i < len; i++){
		var img = new Image();
		var loadFn = function(e){
			count++;
			per=Math.floor((count/len)*100);

			toY=84-per;
			toH=120*(per/100);

			TweenMax.killTweensOf($('.siteLoading .h1'));
			// TweenMax.to($('.siteLoading .h1'),4,{top:toY+'%'})
			TweenMax.to($('.siteLoading .h1'),4,{height:toH+'%'})
			// $(".siteLoading .line").css('width',per+"%");
			// $(".siteLoading .txt span").text(per+'%');

			bl=100/6;
			n=Math.floor(per/bl);

			if (count >= len && !fire) {
				fireFn();
			};
		}
		img.onload = loadFn;
		img.onerror = loadFn;
		img.src = imgList[i];
	}
}

//去除数组中重复值  
function getNoRepeat(s) {  
	return s.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");  
}

//Loading图层
sendSiteLoading();
function sendSiteLoading(){
	var html='';
	html+='<div class="siteLoading">';
	html+='	<div class="bg dynamicBG posabs"></div>';
	html+='	<div class="starline0 posabs"><img src="images/star1.png"></div>';
	html+='	<div class="starline1 posabs"><img src="images/star1.png"></div>';
	html+='	<div class="heart posabs">';
	html+='		<div class="h0 posabs"><img src="images/loading_heart1.png"></div>';
	html+='		<ul class="star posabs">';
	for(var i=0;i<10;i++){
		html+='			<li><img src="images/loading_light0.png"></li>';
	}
	html+='		</ul>';
	html+='		<div class="wrap">';
	html+='			<ul class="h1 posabs">';
	html+='				<div class="wrap1 posabs">';
	html+='					<li></li><li></li>';
	html+='				</div>';
	html+='			</ul>';
	html+='			<div class="bg"><img src="images/loading_heart_empty.png"></div>';
	html+='		</div>';
	html+='	</div>';
	html+='</div>';
	document.write(html);
	TweenMax.fromTo($('.siteLoading .h1 .wrap1'),2,{left:'-50%'},{left:'0%', repeat:-1, ease:Linear.easeNone})

var x0,x1,x2,x3,y0,y1,y2,y3,delay;
	$('.siteLoading .star li').each(function(){
		x0=Math.random()*100-50; y0=0;
		x1=Math.random()*100-50; y1=-50;
		x2=-Math.random()*50-25; y2=-130;
		x3=Math.random()*20-10;  y3=-170;
		delay=Math.random()*3;

		TweenMax.to($(this),1,{bezier:{type:'soft', values:[{x:x0,y:y0,autoAlpha:1},{x:x1,y:y1,autoAlpha:0.8},{x:x2,y:y2,autoAlpha:0.8},{x:x3,y:y3,autoAlpha:0}]}, repeat:-1, delay:delay, ease:Linear.easeNone});

	})

	//流星
	TweenMax.fromTo($('.siteLoading .starline0'),1,{x:'-100%',y:'-100%',autoAlpha:1,display:'block'},{x:'500%',y:'300%',autoAlpha:0, repeat:-1, repeatDelay:5, ease:Expo.easeOut})
	TweenMax.fromTo($('.siteLoading .starline1'),2,{x:'200%',y:'0%',autoAlpha:1,scaleX:-1,display:'block'},{x:'-800%',y:'600%',autoAlpha:0, repeat:-1, repeatDelay:5, delay:3, ease:Expo.easeOut})
}


export default preLoad
