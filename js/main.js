$(function () {
    if (!document.addEventListener) {
        alert("对不起，由于时间关系，没有做兼容低版本IE浏览器。请使用chrome浏览器查看！");
    }
    var $container = $(".container"),
        loadCount = 0,
        index = 0,
        $this,
        items,
        width = document.body.clientWidth,
        openHeight,
        offHeight,
        imgReg = /src=\S*\.(jpg|png|jpeg)\S*"/g,
        article,
        navObj = {
            "sprite-RSS": "sprite-RSS1",
            "sprite-RSS1": "sprite-RSS",
            "sprite-Evernote": "sprite-Evernote1",
            "sprite-Evernote1": "sprite-Evernote",
            "sprite-email": "sprite-email1",
            "sprite-email1": "sprite-email",
            "sprite-GitHub": "sprite-GitHub1",
            "sprite-GitHub1": "sprite-GitHub"
        };

    $("#rss-menu").on("click", "li", function (e) {
        var data = {},
            content,
            json;
        data.rssurl = $(this).children(".rss-item").attr('title');
        $container.append('<div id="loader-wrapper"><div id="loader"></div></div>');
        $("#mask-area").children().addClass("masks");
        $(".detail-hide").removeClass("detail-nav");
        $.ajax({
            url: 'http://2.xthtml5.sinaapp.com/rss',
            dataType: "jsonp",
            data: data,
            jsonpCallback: "callbacks",
            success: function (data) {
                window.scrollTo(0,0);
                $container.empty();
                index = 0;
                content = data['key'];
                content = content.replace(/\n+|\r+/g, "").replace(/\>\s+/g, ">");
                json = xmlToJson(loadXML(content));
                appendContainer(json);
                json = JSON.stringify(json);
                localStorage.setItem("json", json);
            }
        });
    });

    if (window.localStorage) {
        article = JSON.parse(localStorage.getItem('json'));
        if (article) {
            appendContainer(article);
        } else {
            $(".rss-item")[2].click();
        }
    } else {
        $(".rss-item")[2].click();
    }

    $container.touchRight(function(){
        $(".head-nav").addClass("head-nav-show");
    }).touchLeft(function(){
        $(".head-nav").removeClass("head-nav-show");
        $(".detail-hide").removeClass("detail-nav");
    });
    $(".p-div").on("mouseenter", ".sprite", function () {
        $this = $(this);
        var spriteElement = $this.attr("class").split(" ")[1];
        if (spriteElement) {
            $this.removeClass(spriteElement).addClass(navObj[spriteElement]).siblings(".tip").show();
        }
    }).on("mouseleave", ".sprite", function () {
        $this = $(this);
        var spriteElement = $this.attr("class").split(" ")[1];
        if (spriteElement) {
            $this.removeClass(spriteElement).addClass(navObj[spriteElement]).siblings(".tip").hide();
        }
    });

    $("#RSS").on("click", function () {
        $(".detail-hide").toggleClass("detail-nav");
    });
    $(".head-nav").on("click",function(e){
        var tar = e.target,
            url;
        if(tar){
            url = tar.getAttribute("source");
            if(url){
                window.location.href = url;
            }
        }
    });
    $container.on("mouseenter", ".info", function () {
        $(this).siblings(".uptip").addClass("uptip-show");
    }).on("mouseleave", ".info", function () {
        $(this).siblings(".uptip").removeClass("uptip-show");
    });

    $container.on("click", ".article-box", function (e) {
        var attr = e.target.getAttribute("sourceurl");

        if (attr) {
            window.location.href = attr;
            return false;
        }
        addDetail($(this).children(".article-content").attr('idx'));
    });

    function addDetail(idx) {
        var widReg = /<img.*?>/g,
            description = items[idx].description;

        description = description.replace(imgReg, function ($1) {
            return $1 + ' onerror=\"this.style.display=\'none\';return true;\"';
        }).replace(widReg, function ($1) {
            //如果图片没有设置宽度，将宽度指定为300
            if (!/( |")width="\d+"/.exec($1)) {
                $1 = $1.replace(imgReg, function (arg1) {
                    return arg1 + ' width="640"';
                });
            }
            if (width <= 600) {
                return $1.replace(/( |")width="(\d+)"/, function ($1, $2, $3) {
                    if (parseInt($3) > width * 0.6) {
                        return " width='" + width * 0.6 + "'";
                    }
                    return $1;
                });
            } else {
                return $1.replace(/( |")width="(\d+)"/, function ($1, $2, $3) {
                    //如果图片的宽度大于640，则将其宽度设为640
                    if (parseInt($3) > 640) {
                        return " width='640'"
                    }
                    return $1;
                });
            }
        });
        description = "<h2>" + items[idx].title + "</h2>" +
            '<pre class="article-detail">' + description + '</pre>';
        $(".ifm").addClass("ifm-show");
        $("#ifm-content").addClass("masks");

        //调用子页面方法，显示文章详细内容。
        myframe.window.get(description);
        openHeight = $(document).scrollTop();
    }

    //取出固定数目条文章内容，显示在界面上。
    function addContainer(count) {
        var article = "",
            itemLength = items.length;

        if (itemLength > index) {
            try {
                while (itemLength > index && index <= (loadCount + 1) * count) {

                    var item = items[index],
                        title = item.title,
                        description = item.description,
                        imgSrc = description.match(imgReg),
                        guid = item.guid || item.link,
                        sortDes = description.replace(/<(.*?)>/g, "").substr(0, 200) + "...";
                    if (!imgSrc) {
                        imgSrc = 'src=""';
                    } else {
                        imgSrc = imgSrc[0];
                    }
                    article = "<div class='article-box' >" +
                        "<div class='info' sourceUrl='" + guid + "'></div>" +
                        "<div class='uptip'><span>查看原文</span></div>" +
                        "<a href='javascript:void(0)'>" + title + "</a>" +
                        '<img ' + imgSrc + 'onerror="this.style.display=\'none\';return true;"  width="100" height="100" style="float: left;margin: 1em;border:1px solid #fefefe">' +
                        '<p class="article-content" idx="' + index + '">' +
                        sortDes
                        + "</p>" +
                        "</div>" + article;

                index++;
              }
            }catch(e){
                console.log("RSS数据源异常！");
                items.length = index;
            }
            $container.append(article);
            loadCount++;
        } else {
            $(".load").hide();
        }
    }

    //将RSS内容取出，并将内容设置给变量items。
    function appendContainer(json) {
        var channel = json.rss.channel,
            channelTitle = channel.title,
            channelUrl = channel.link,
            regUrl = /http:\/\/(\S+?)\//.exec(channelUrl),
            imgUrl = regUrl ? regUrl[0] : channelUrl + "/";
        items = channel.item;  //items其它地方会用到，所有内部全局。
        $("#container-img").attr("src", imgUrl + "favicon.ico");
        $("#container-title").empty().append(channelTitle);
        addContainer(20);
        $("#mask-area").children().removeClass("masks");
        if(width<600){
            $(".head-nav").removeClass("head-nav-show");
        }
    }

    $(window).scroll(function () {
        $this = $(this);
        offHeight = $(document).height();
        if (offHeight - $this.height() - $this.scrollTop() < 400) {
            $(".loadImg").addClass("load");
            addContainer(10);
        }
        var $ifm = $("#ifm-id");
        var ifmHeight = $(document.getElementById("ifm-id").contentWindow.document.body).height();
        if ($ifm.height() !== (ifmHeight + 50)) {
            $ifm.height(ifmHeight + 50);
        }
    });

    window.setIframe = function (count) {
        var e = document.getElementById("ifm-id"),
            clientWidth = document.body.clientWidth,
            sty;
        if(count < 0){
            sty = "top:0;left:" + (clientWidth > 600 ? clientWidth * 0.2 + "px" : clientWidth * 0.1 + "px");
        }else{
            sty = "height:" + (count + 50) + "px;top:" + $(document).scrollTop() + "px;left:" + (clientWidth > 600 ? clientWidth * 0.2 + "px" : clientWidth * 0.1 + "px");
        }
        e.setAttribute("style", sty);
        e.scrolling = "no";

        //重置主页面高度，解决如果弹出文章高度超过页面高度时显示不完全。
        if (count + $(document).scrollTop() !== document.body.clientHeight) {
            document.body.height = count + $(document).scrollTop();
        }
    };
    window.removeIframe = function(){

    };
    window.closeIframe = function () {
        $(".ifm").removeClass("ifm-show");
        $("#ifm-content").removeClass("masks");
        window.scrollTo(0,openHeight);
        window.setIframe(-1);
    }
});
