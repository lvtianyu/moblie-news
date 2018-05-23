var AllFunction = function() {
  var banner = document.getElementsByClassName("news-banner")[0];
  var imgBox = banner.getElementsByTagName("ul")[0];
  var imgLis = imgBox.getElementsByTagName("li");
  var pointBox = banner.getElementsByTagName("ul")[1];
  var pointLis = pointBox.getElementsByTagName('li');
  var width = banner.offsetWidth;
  var timer = null;
  var index = 0;
  var sumlength = imgLis.length;
  var isShow = false

  // 过渡
  var addtransition = function() {
    imgBox.style.transition = "all .5s ease 0s";
    imgBox.style.webkitTransition = "all .5s ease 0s";

  }
  var removeTransition = function() {
      imgBox.style.transition = "none";
      imgBox.style.webkitTransition = "none";
    }

    // 改变位置
  var setTransform = function(t) {
      imgBox.style.transform = 'translateX(' + t + 'px)';
      imgBox.style.webkitTransform = 'translateX(' + t + 'px)';
    }

    //改变点
  var setPoint = function() {
      var currIndex;
      if (index >= sumlength) {
        currIndex = 0;
      } else if (index < 0) {
        currIndex = sumlength-1;
      }
      currIndex = index;
      for (var i = 0; i < pointLis.length; i++) {
        pointLis[i].className = " ";
      }
      pointLis[currIndex].className = "active";
    }
    // 定时器
  timer = setInterval(function() {
    index++;
    addtransition();
    if ( index == sumlength) {
        index = 0
    }
    setTransform(-index * width);
  }, 3000);

  /*过渡结束*/
  imgBox.addEventListener('webkitTransitionEnd', function() {
    transformEnd();
  }, false);
  imgBox.addEventListener('transitionEnd', function() {
    transformEnd();
  }, false);

  var transformEnd = function() {
    if (index >= sumlength) {
      index = 0;
    } else if (index < 0) {
      index = sumlength-1;
    }
    removeTransition();
    setTransform(-index * width);
    setPoint();
  }

  var startX = 0,
    endX = 0,
    moveX = 0;

  imgBox.addEventListener('touchstart', function(e) {
    clearInterval(timer);
    startX = e.touches[0].clientX;

  })

  imgBox.addEventListener('touchmove', function(e) {
    endX = e.touches[0].clientX;
    moveX = startX - endX;
    e.preventDefault();
    removeTransition();
    setTransform(-index * width - moveX);

  })
  imgBox.addEventListener('touchend', function(e) {
    if (Math.abs(moveX) > (width / 3) && endX != 0) {
      if (moveX > 0) {
        index++;
      } else {
        index--;
      }

    }
    addtransition();
    setTransform(-index * width);
    startX = 0;
    endX = 0;

    clearInterval(timer);
    timer = setInterval(function() {
      index++;
      addtransition();
      if ( index == sumlength) {
        index = 0
        }
      setTransform(-index * width);
    }, 3000);
  })
}

export default AllFunction