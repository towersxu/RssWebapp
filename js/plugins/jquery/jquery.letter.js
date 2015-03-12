/**
 * Created by Administrator on 14-10-21.
 */
(function($){
    function injector(text,splitter){
        splitter=splitter || "";
        var a = text.split(splitter),
            inject = '';
        if(a.length>0){
            $(a).each(function(i,item){
                inject+='<span class="word'+i+'">'+item+'</span>';
            });
        }
        return inject;
    }
    $.fn.textSplit = function() {
        var txt = injector(this.text());
        $that = $(this);
        $(this).html(txt);
        var len = txt.split("</span>");
        var i= 0,t;
        function addAnimate(){
            $(".word"+i).addClass('flash');
            $(".word"+i).css('display','inline');
            i++;
            $that.css('display','block');
            if(i==len.length){

                clearInterval(t);

            }
        }

        t= setInterval(addAnimate,100);
    }
}(jQuery));