/**
 * Created by towersxu on 14-12-10.
 */
(function ($,document,window,undefined) {

    var $window = $(window);
    $.fn.lazyLoad = $.fn.lazyLoad || function(options){
        var $elements = this;
        var settings = {
            threshold           : 0,
            event               : "scroll",
            effect              : "show",
            container           : window,
            data_attribute      : "original",
            data_attribute_arr  : "original-array",
            placeholder         : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"

        };
        //console.log($elements);
        if(options){
            $.extend(settings,options);
        }
        /*计算当前元素是否在可视区范围内（可适当增加一点范围），若在范围内，则下载该元素的图片。*/
        function update(){
            $elements.each(function(){
                console.log(this);
                if(!$.belowthefold(this,settings) && !$(this).attr("update")){
                    $(this).attr("updated",true);
                    $(this).attr("src",$(this).attr("data-original"));
                }
            });
            console.log($elements)
        }
        update();
    };
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
    /* 判断该元素距离顶部的位置是否大于可视窗口距离顶部的位置*/
    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
})(jQuery,document,window);