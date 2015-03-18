$(function () {
    var $tip = $(".tip"),
        $container = $(".container"),
        loadCount = 0,
        index = 0,
        $this,
        channel,
        startX, startY, x, y,article;
    $("#rss-menu").on("click","li",function(e){
        var data = {};
        data.rssurl= $(this).children(".rss-item").attr('title');
        $container.append('<div id="loader-wrapper"><div id="loader"></div></div>');
        $("#mask-area").children().addClass("masks");
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
    if(window.localStorage){
        article = JSON.parse(localStorage.getItem('json'));
        if(article){
            appendContainer(article);
        }else{
            $(".rss-item")[2].click();
            //loadDefaultArticle();
        }
    }else{
        $(".rss-item")[2].click();
    }

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

    $(".p-div").on("mouseenter",function(){
        $(this).children(".tip").show().siblings().children(".hide-img").removeClass("hide-img").siblings().addClass("hide-img");
    }).on("mouseleave",function(){
        $(this).children(".tip").hide().siblings().children(".hide-img").removeClass("hide-img").siblings().addClass("hide-img");
    });
    $(".rss").on("click",function(){
        $(".detail-hide").toggleClass("detail-nav");
    });
    $container.on("mouseenter",".info",function(){
        $(this).siblings(".uptip").addClass("uptip-show");
    }).on("mouseleave",".info",function(){
        $(this).siblings(".uptip").removeClass("uptip-show");
    });
    $container.on("click",".article-box",function(e){
        var attr = e.target.getAttribute("sourceurl");
        if(attr){
            window.location.href=attr;
        }
        $(this).children(".article-content").hide().siblings(".article-detail").show();
    });

    function addContainer(count){
        var items = channel.item,
            article = "",
            imgReg = /src=\S*\.(jpg|png|jpeg)\S*"/g,
            itemLength = items.length;
        if(itemLength > index){
            while(index <= (loadCount+1) *count){
                var item = items[index],
                    title = item.title,
                    description = item.description,
                    imgSrc = description.match(imgReg),
                    des = description.replace(imgReg,function($1){
                        return $1+' onerror=\"this.style.display=\'none\';return true;\"';
                    }),
                    guid = item.guid || item.link,
                    sortDes = description.replace(/<(.*?)>/g,"").substr(0,200)+"...";
                if(!imgSrc){
                    imgSrc = 'src=""';
                }else{
                    imgSrc = imgSrc[0];
                }
                article = "<div class='article-box' >" +
                    "<div class='info' sourceUrl='"+guid+"'></div>"+
                    "<div class='uptip'><span>查看原文</span></div>"+
                    "<a href='javascript:void(0)'>"+title+"</a>" +
                    '<img '+imgSrc+'onerror="this.style.display=\'none\';return true;"  width="100" height="100" style="float: left;margin: 1em"><p class="article-content">' +
                    sortDes
                    + "</p>" +
                    '<pre class="article-detail">' + des + '</pre>'+
                    "</div>"+article;
                index++;
            }
            $container.append(article);
            loadCount ++;
        }else{
            $(".load").hide();
        }
    }

    function appendContainer(json){
            channel = json.rss.channel;
        var channelTitle = channel.title,
            channelUrl = channel.link,
            regUrl = /http:\/\/(\S+?)\//.exec(channelUrl),
            imgUrl = regUrl?regUrl[0]:channelUrl+"/";
        $("#container-img").attr("src",imgUrl+"favicon.ico");
        $("#container-title").empty().append(channelTitle);
        addContainer(20);
        $("#mask-area").children().removeClass("masks");
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

    $(window).scroll(function(){
        $this = $(this);
        if($(document).height() - $this.height() - $this.scrollTop() < 400){
            $(".loadImg").addClass("load");
            addContainer(10);
        }
    });
});
