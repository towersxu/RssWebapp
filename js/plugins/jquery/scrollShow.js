/**
 * Created by xt on 14-10-17.
 */
var scrollFunc = function (e) {
    var direct = 0;
    e = e || window.event;
    if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
        if (e.wheelDelta > 0) { //当滑轮向上滚动时
            //alert("滑轮向上滚动");
            direct = 1;
        }
        if (e.wheelDelta < 0) { //当滑轮向下滚动时
            //alert("滑轮向下滚动");
            direct = 2;
        }
    } else if (e.detail) {  //Firefox滑轮事件
        if (e.detail > 0) { //当滑轮向上滚动时
            //alert("滑轮向上滚动");
            direct = 1;
        }
        if (e.detail < 0) { //当滑轮向下滚动时
            // alert("滑轮向下滚动");
            direct = 2;
        }
    }
    if (direct == 2) {
        $(".scroll-nav").addClass("head-nav-down");
        $(".head-img").addClass("head-img-hover").removeClass("head-info-img");
        $(".head-info").removeClass("head-info-show");
        //$(".head-img").removeClass("head-info-img");
    } else {
        $(".scroll-nav").removeClass("head-nav-down");
        $(".head-img").removeClass("head-img-hover");

    }
    return true;
};
var mouseMoveEvent = function (e) {
    if (e.clientY < 5) {
        $(".scroll-nav").removeClass("head-nav-down");
    }
};
if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
}
//滚动滑轮触发scrollFunc方法
window.onmousewheel = document.onmousewheel = scrollFunc;
if (document.attachEvent) {
    document.attachEvent("onmousemove", mouseMoveEvent, false);
} else {
    document.addEventListener("mousemove", mouseMoveEvent, false);
}
var startX, startY, x, y;
function touchStart(e) {//触摸开始
    var touch = e.touches[0];
    startY = touch.pageY;   //刚触摸时的坐标
}
function touchMove(e) {//滑动
    var touch = e.touches[0];
    y = touch.pageY - startY;//滑动的距离
    if (y < 0) {
        $(".scroll-nav").addClass("head-nav-down");
        $(".head-info").removeClass("head-info-show");
        $(".head-img").removeClass("head-info-img");
    }
    if (y > 0) {
        $(".scroll-nav").removeClass("head-nav-down");
    }
}
document.addEventListener('touchstart', touchStart, false);
document.addEventListener('touchmove', touchMove, false);