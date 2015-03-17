$(function () {
    var $tip = $(".tip"),
        $container = $(".container");
    $(".p-div").on("mouseenter",function(){
        $(this).children(".tip").show().siblings().children(".hide-img").removeClass("hide-img").siblings().addClass("hide-img");
    }).on("mouseleave",function(){
        $(this).children(".tip").hide().siblings().children(".hide-img").removeClass("hide-img").siblings().addClass("hide-img");
    });
    $(".rss").on("click",function(){
        $(".detail-hide").toggleClass("detail-nav");
    });

    $container.on("click",".article-box",function(e){
        var attr = e.target.getAttribute("sourceurl");
        if(attr){
            window.location.href=attr;
        }
        $(this).children(".article-content").hide().siblings(".article-detail").show();
    });

    $("#rss-menu").on("click",function(e){
        var data = {};
        data.rssurl= $(e.target).attr('title');
        $container.append('<div id="loader-wrapper"><div id="loader"></div></div>');
        $(".detail-hide").removeClass("detail-nav");
        $.ajax({
            url: 'http://2.xthtml5.sinaapp.com/rss',
            dataType: "jsonp",
            data:data,
            jsonpCallback: "callbacks",
            success: function (data) {
                $container.empty();
                var content = data['key'];
                content = content.replace(/\n+|\r+/g, "").replace(/\>\s+/g, ">");
                var xmldoc = loadXML(content);
                var json = xmlToJson(xmldoc);
                appendContainer(json);
                json = JSON.stringify(json);
                localStorage.setItem("json",json);
            }
        });
    });
    function appendContainer(json){
        var items = json.rss.channel.item;
        var imgReg = /src=\S*\.(jpg|png|jpeg)\S*"/g;
        var itemLength = items.length;
        var article = "";
        while(itemLength>0){
            var item = items[itemLength-1];
            var title = item.title;
            var description = item.description;
            var imgSrc = description.match(imgReg);
            var des = description.replace(imgReg,function($1){
                return $1+' onerror=\"this.style.display=\'none\';return true;\"';
            });
            var guid = item.guid || item.link;
            var sortDes = description.replace(/<(.*?)>/g,"").substr(0,200)+"...";
            if(!imgSrc){
                imgSrc = 'src="http://placehold.it/100x100"';
            }else{
                imgSrc = imgSrc[0];
            }
            article = "<div class='article-box' >" +
            "<div class='info' sourceUrl='"+guid+"'></div>"+
            "<a href='javascript:void(0)'>"+title+"</a>" +
            '<img '+imgSrc+'onerror="this.style.display=\'none\';return true;"  width="100" height="100" style="float: left;margin: 1em"><p class="article-content">' +
            sortDes
            + "</p>" +
            '<pre class="article-detail">' + des + '</pre>'+
            "</div>"+article;
            //$(".container").prepend(article);
            itemLength --;
        }
        $container.prepend(article);
    }

    function loadDefaultArticle(){
        $.ajax({
            url: 'http://2.xthtml5.sinaapp.com/ajax',
            dataType: "jsonp",
            jsonpCallback: "callback",
            success: function (data) {
                data = data || [];
                var article;
                for (var i = 0; i < data.length; i++) {
                    article = "<div class='article-box'><a href='" + data[i][2] + "'>" + data[i][1] + "</a>" +
                    '<img src="http://placehold.it/100x100" width="100" height="100" style="float: left;margin: 1em">' +
                    '<p style="text-indent: 2em;">' + data[i][3] + '</p>'
                    + "</div>";
                    $(".container").append(article);
                }
            }
        });
    }
    if(window.localStorage){
        var article =localStorage.getItem('json');
        article = JSON.parse(article);
        if(article){
            appendContainer(article);
        }else{
            $(".rss-item")[0].click();
            //loadDefaultArticle();
        }
    }else{
        $(".rss-item")[0].click();
    }
    var startX, startY, x, y;
    function touchStart(e) {//触摸开始
        var touch = e.touches[0];
        startY = touch.pageY;   //刚触摸时的坐标
        startX = touch.pageX;
    }
    function touchMove(e) {//滑动
        var touch = e.touches[0];
        y = touch.pageY - startY;//滑动的距离
        x = touch.pageX - startX;
        if(x > 0 && x > y && x + y > 0){  //右
            $(".head-nav").addClass("head-nav-show");
        }
        if(x < 0 && x < y && x + y <0){   //左
            $(".head-nav").removeClass("head-nav-show");
            $(".detail-hide").removeClass("detail-nav");
        }
    }
    document.addEventListener('touchstart', touchStart, false);
    document.addEventListener('touchmove', touchMove, false);
});
