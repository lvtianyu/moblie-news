/*
ver:1.01
author:Michael He
*/
(function(window, document, exportName, undefined) {
	var mScrollPage = function(){};

	mScrollPage.prototype = {
		scroller:{},
		touchObj:{},
		photos:[],
		photoSize:{},
		direction:'vertical',
		itemName:'li',
		canTouch:1,
		init:function(){
			var that=this;
			that.thisId=0;
			that.running=0;
			that.scroller=this.scroller;
			that.direction=this.direction;
			that.canTouch=this.canTouch;

			//如果指定页标签
			if(this.itemName!='li'){
				that.itemName=this.itemName;
			}
			//如果指定触摸对象
			if(this.touchObj.length>0){
				that.touchObj=this.touchObj;
			}else{
				that.touchObj=that.scroller;
			}
			//如果有指定图片
			if(this.photos.length>0){
				makePhotoList(this.photos,this.scroller);
			}
			//是否能触摸
			if(that.canTouch==1){
				that.hammer = new Hammer(that.touchObj[0],{direction: Hammer.DIRECTION_ALL});
				that.hammer.on("panend", function(ev){panEndAction(ev,that)});
				// that.hammer.on("pan", function(ev){panAction(ev,that)});
			}
			//如果有全屏背景的情况下，处理背景尺寸
			if(this.photoSize.width!=undefined || this.photoSize.height!=undefined){
				that.photoSize={width:this.photoSize.width,height:this.photoSize.height};
				setBGSize(that.photoSize,that.scroller);
				$(window).resize(function(){setBGSize(that.photoSize,that.scroller);})
			}
		},
		getId:function(){
			var that=this;
			return that.thisId;
		},
		goto:function(toId){
			var that=this;
			TweenMax.to(that.scroller, 0, {x:0,scrollTo:{x:0}});
			that.thisId=0;
			photoScrollBegin(toId,that);
		},
		next:function(){
			var that=this;
			photoScrollBegin(1,that);
		},
		pre:function(){
			photoScrollBegin(-1,that);
		},
		onPanEnd:function(fn){
			var that=this;
			if(typeof(fn)=='function'){
				that.onPanEnd = fn;
			}			
		},
		onBegin:function(fn){
			var that=this;
			if(typeof(fn)=='function'){
				that.onBegin = fn;
			}
		},
		onComplete:function(fn){
			var that=this;
			if(typeof(fn)=='function'){
				that.onComplete = fn;
			}
		},
	};

	function makePhotoList(photos,scroller){
		scroller.html('');
		scroller.append('<ul class="wrap"></ul>');
		for(i in photos){
			p=photos[i];
			scroller.find('ul.wrap').append('<li style="background:url('+p+') no-repeat center center;"></li>');
		}
	}


	//设置背景缩放
	function setBGSize(photoSize,scroller){
		toW=$(window).innerWidth();
		toH=$(window).height();
		scroller.find('>.wrap>li').css({'width':toW,'height':toH});

		bl=photoSize.width/photoSize.height;
		sw=$(window).width();
		sh=$(window).height();
		bl2=sw/sh;
		if(bl>bl2){
			scroller.find('li').css("background-size","auto 100%");
		}else{
			scroller.find('li').css("background-size","100% auto");
		}
	}

	function panAction(ev,that){
		if(that.canTouch!=1){
			return false;
		}

		if(that.direction=='vertical'){
			var y=ev.deltaY;
			thisN=that.thisId;
			toT=thisN*that.scroller.height()-y;
			TweenMax.to(that.scroller, 0, {scrollTo:{y:toT}});
		}
		if(that.direction=='horizontal'){
			var x=ev.deltaX;
			thisN=that.thisId;
			toL=thisN*that.scroller.width()-x;
			TweenMax.to(that.scroller, 0, {scrollTo:{x:toL}});
		}
	}

	function panEndAction(ev,that){
		that.onPanEnd(that.getId());
		if(that.canTouch!=1){
			return false;
		}
		var direction=that.direction;
		if(direction=='vertical'){
			dh=$(window).height()*0.2;//拉动距离
			var y=ev.deltaY;
			if( y <= -dh){
				photoScrollBegin(1,that);
			}else if( y >= dh){
				photoScrollBegin(-1,that);
			}else{
				photoScrollBegin(0,that);
			}
		}
		if(direction=='horizontal'){
			dw=$(window).width()*0.2;//拉动距离
			var x=ev.deltaX;
			if( x <= -dw){
				photoScrollBegin(1,that);
			}else if( x >= dw){
				photoScrollBegin(-1,that);
			}else{
				photoScrollBegin(0,that);
			}
		}
	}

	function photoScrollBegin(dir,that){
		var scroller=that.scroller;
		var running=that.running;
		var nextId = that.thisId;
		var direction = that.direction;
		var photosLength = scroller.find(that.itemName).length;

		if(running==0){
			that.running=1;
			if(dir==undefined){
				nextId++;
			}else{
				nextId+=dir;
			}

			//限定在图片数量范围内
			if(nextId<0 || nextId>photosLength-1){
				that.running=0;
				return false;
			}

			if(direction=='vertical'){
				toT=scroller.height()*nextId;
				TweenMax.to(scroller, 0.3, {x:0,scrollTo:{y:toT}, onComplete:photoScrollEnd, onCompleteParams:[nextId,that]});
			}
			if(direction=='horizontal'){
				toL=scroller.width()*nextId;
				TweenMax.to(scroller, 0.3, {x:0,scrollTo:{x:toL}, onComplete:photoScrollEnd, onCompleteParams:[nextId,that]});
			}

			that.onBegin(that.thisId,nextId);
		}
	}
	
	function photoScrollEnd(nextId,that){
		that.thisId=nextId;
		that.running=0;
		that.onComplete(nextId);
	}
	
	window[exportName] = mScrollPage;
})(window, document, 'mScrollPage');
