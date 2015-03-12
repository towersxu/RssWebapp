if (!window.A) {
    function G(a) {
        return document.getElementById(a)
    }

    window.bds = window.bds || {};
    bds.util = bds.util || {};
    bds.util.getWinWidth = function () {
        return window.document.documentElement.clientWidth
    };
    bds.util.setContainerWidth = function () {
        var f = G("container"), b = G("wrapper"), a = function (c, g) {
            g.className = g.className.replace(c, "")
        }, e = function (c, g) {
            g.className = (g.className + " " + c).replace(/^\s+/g, "")
        }, d = function (c, g) {
            return c.test(g.className)
        };
        if (bds.util.getWinWidth() < 1207) {
            if (f) {
                a(/\bcontainer_l\b/g, f);
                if (!d(/\bcontainer_s\b/, f)) {
                    e("container_s", f)
                }
            }
            if (b) {
                a(/\bwrapper_l\b/g, b);
                if (!d(/\bwrapper_s\b/, b)) {
                    e("wrapper_s", b)
                }
            }
            bds.comm.containerSize = "s"
        } else {
            if (f) {
                a(/\bcontainer_s\b/g, f);
                if (!d(/\bcontainer_l\b/, f)) {
                    e("container_l", f)
                }
            }
            if (b) {
                a(/\bwrapper_s\b/g, b);
                if (!d(/\bwrapper_l\b/, b)) {
                    e("wrapper_l", b)
                }
            }
            bds.comm.containerSize = "l"
        }
    };
    (function () {
        var c = [], f = false;
        var b = function (h, g) {
            try {
                h.call(g)
            } catch (i) {
            }
        }, d = function () {
            this.ids = [];
            this.has = true;
            this.list = [];
            this.logs = [];
            this.loadTimes = [];
            this.groupData = [];
            this.mergeFns = [];
            this._currentContainer = null
        };
        window.A = bds.aladdin = {};
        b(d, window.A);
        bds.ready = function (g) {
            if (typeof g != "function") {
                return
            }
            if (f) {
                b(g)
            } else {
                c.push(g)
            }
        };
        bds.doReady = function () {
            f = true;
            while (c.length) {
                b(c.shift())
            }
        };
        bds.clearReady = function () {
            f = false;
            c = []
        };
        A.__reset = d;
        var a = (function () {
            var g = document.getElementsByTagName("script");
            return function () {
                var i = g[g.length - 1];
                if (window.currentScriptElem) {
                    i = window.currentScriptElem
                }
                var h = i;
                while (h) {
                    if (h.className) {
                        if (/(?:^|\s)result(?:-op)?(?:$|\s)/.test(h.className)) {
                            if (tplname = h.getAttribute("tpl")) {
                                return h
                            }
                        }
                    }
                    h = h.parentNode
                }
            }
        })(), e = function (g, j, h) {
            var l;
            if (!g.initIndex) {
                l = {container: g, data: {}, handlers: []};
                g.initIndex = A.groupData.length + 1;
                A.groupData.push(l)
            } else {
                l = A.groupData[g.initIndex - 1]
            }
            if (typeof j == "function") {
                l.handlers.push(j)
            } else {
                if (typeof j == "object") {
                    for (var m in j) {
                        if (j.hasOwnProperty(m)) {
                            l.data[m] = j[m]
                        }
                    }
                } else {
                    l.data[j] = h
                }
            }
        };
        A.init = A.setup = function (i, h) {
            if (i === undefined || i === null) {
                return
            }
            var g = A._currentContainer || a();
            if (!g) {
                return
            }
            e(g, i, h)
        };
        A.merge = function (h, g) {
            A.mergeFns.push({tplName: h, fn: g})
        }
    })()
}
function ns_c_pj(a, c) {
    var b = encodeURIComponent(window.document.location.href), h = "", f = "", i = "", e = bds.comm.queryEnc, d = bds && bds.util && bds.util.domain ? bds.util.domain.get("http://nsclick.baidu.com") : "http://nsclick.baidu.com", g = window["BD_PS_C" + (new Date()).getTime()] = new Image();
    for (v in a) {
        switch (v) {
            case"title":
                f = encodeURIComponent(a[v].replace(/<[^<>]+>/g, ""));
                break;
            case"url":
                f = encodeURIComponent(a[v]);
                break;
            default:
                f = a[v]
        }
        h += v + "=" + f + "&"
    }
    i = "&mu=" + b;
    g.src = d + "/v.gif?pid=201&" + (c || "") + h + "path=" + b + "&wd=" + e + "&rsv_sid=" + bds.comm.sid + "&t=" + new Date().getTime();
    return true
}
function ns_c(a) {
    return ns_c_pj(a, "pj=www&")
};
bds.base64 = (function () {
    var _opt = bds._base64;
    var _containerAllId = "container", _containerLeftId = "content_left", _containerRightId = "content_right", _BOTTAGLSNAME = "BASE64_BOTTAG", _domain = bds._base64.domain, _imgWatch = [], _domLoaded = [], _data = [], _dataLoaded = [], _finish = [], _hasSpImg = false, _expGroup = 0, _reqTime = 0, _reqEnd = 0, _reqEndL = 0, _rsst = 0, _rest = 0, _dt = 1, _loadState = {}, _hasPreload = 0, _ispdc = false;
    var preXhrs = [], $ = window.$;
    if ($) {
        $(window).on("swap_begin", function () {
            _imgWatch = [];
            _domLoaded = [];
            _data = [];
            _dataLoaded = [];
            _finish = [];
            _hasSpImg = false;
            _expGroup = 0;
            _reqTime = 0;
            _reqEnd = 0;
            _reqEndL = 0;
            _rsst = 0;
            _rest = 0;
            _dt = 1;
            _ispdc = false;
            for (var i = 0; i < preXhrs.length; i++) {
                preXhrs[i].abort();
            }
        });
    }
    var init = function (imgRight, imgLeft, isPreload) {
        var imgArr = imgRight || [], imgArr2 = imgLeft || [];
        if (window.__IS_IMG_PREFETCH) {
            function filter(img) {
                return !window.__IS_IMG_PREFETCH.hasOwnProperty(img);
            }

            imgArr = $.grep(imgArr, filter);
            imgArr2 = $.grep(imgArr2, filter);
        }
        if (window.__IMG_PRELOAD && isPreload) {
            _loadState["cbr"] = 0;
            _loadState["cbpr"] = 0;
            _hasPreload = 1;
            var imgPreloadList = window.__IMG_PRELOAD = {};
            for (var i = 0; i < imgArr.length; i++) {
                if (!imgPreloadList.hasOwnProperty(imgArr[i])) {
                    window.__IMG_PRELOAD[imgArr[i]] = true;
                }
            }
        } else if (window.__IMG_PRELOAD && !isPreload) {
            var tmpArr = [];
            for (var i = 0; i < imgArr.length; i++) {
                if (!window.__IMG_PRELOAD.hasOwnProperty(imgArr[i])) {
                    tmpArr.push(imgArr[i]);
                }
            }
            imgArr = tmpArr;
        }
        if (_opt.b64Exp) {
            _expGroup = _opt.b64Exp;
            if (_expGroup == 1) {
                _domain = "http://b2.bdstatic.com/";
                _dt = 2;
            }
        }
        _ispdc = _opt.pdc > 0 ? true : false;
        _reqTime = new Date() * 1;
        if (_expGroup == 2) {
            if (imgArr2.length > 0) {
                _hasSpImg = true;
                loadJs(_domain + "image?imglist=" + imgArr2.join(",") + "&cb=bds.base64.cbl");
            }
            if (!isPreload) {
                cbl({});
            }
        }
        if (imgArr.length > 0) {
            if (isPreload) {
                loadJs(_domain + "image?imglist=" + imgArr.join(",") + "&cb=bds.base64.cbpr");
            } else {
                loadJs(_domain + "image?imglist=" + imgArr.join(",") + "&cb=bds.base64.cbr");
            }
            if (_ispdc) {
                if (bds.ready) {
                    bds.ready(function () {
                        setTimeout(function () {
                            var _bottag = botTag.get();
                            var logstr = "dt=" + _dt + "&time=" + ((_reqEnd > 0) ? (_reqEnd - _reqTime) : 0) + "&bot=" + _bottag + "&rcount=" + imgArr.length;
                            window._B64_REQ_LOG = ((_reqEnd > 0) ? (_reqEnd - _reqTime) : 0) + "_" + imgArr.length;
                            if (_expGroup == 2 && _reqEndL > 0) {
                                var _apics = document.getElementById("ala_img_pics");
                                var _lcount = (_apics && _apics.children) ? _apics.children.length : 0;
                                logstr += "&time2=" + (_reqEndL - _reqTime) + "&lcount=" + _lcount;
                            }
                            if (Math.random() * 100 < 10) {
                                sendLog(logstr);
                            }
                        }, 2000);
                    });
                }
            }
        } else {
            if (!isPreload) {
                cbr({});
            }
        }
        if (imgArr.length > 0 || imgArr2.length > 0) {
            if (!isPreload) {
                watchReq(imgArr.length);
            }
        }
    };

    function crc32(str) {
        if (typeof str == "string") {
            var i, crc = 0, j = 0;
            for (i = 0; i < str.length; i++) {
                j = i % 20 + 1;
                crc += str.charCodeAt(i) << j;
            }
            return Math.abs(crc);
        }
        return 0;
    }

    var loadJs = function (url) {
        var matchs = url.match(/.*(bds\.base64\.cb[rl])/);
        if (!matchs) {
            return;
        }
        var imglist = url.match(/imglist=([^&]*)/);
        if (!imglist || !imglist[1]) {
            return;
        }
        callback_name = crc32(imglist[1].replace(/,/g, ""));
        callback_name = "cb_" + (callback_name + "").substr(Math.max(0, callback_name.length - 8), 8) + "_0";
        window[callback_name] = function (data) {
            if (matchs[1] == "bds.base64.cbr") {
                cbr(data);
            } else if (matchs[1] == "bds.base64.cbl") {
                cbl(data);
            }
            delete window[callback_name];
        };
        var url = matchs[0].replace(/bds\.base64\.cb[rl]/, callback_name);
        var a = document.createElement("script");
        a.setAttribute("type", "text/javascript");
        a.setAttribute("src", url);
        a.setAttribute("defer", "defer");
        a.setAttribute("async", "true");
        document.getElementsByTagName("head")[0].appendChild(a);
    };
    var imgLoad = function (data, side) {
        if (_finish[side]) {
            return;
        }
        _finish[side] = true;
        if (side == "right") {
            botTag.ot(false);
        }
        var imgs = document.getElementById(_expGroup != 1 ? ((side == "left") ? _containerLeftId : _containerRightId) : _containerAllId).getElementsByTagName("IMG");
        for (var i = 0; i < imgs.length; i++) {
            var b64Id = imgs[i].getAttribute("data-b64-id");
            if (b64Id) {
                var find = false;
                if (data.hasOwnProperty(b64Id)) {
                    setSrc(imgs[i], data[b64Id]);
                    find = true;
                }
                if (!find) {
                    failover(imgs[i]);
                }
            }
        }
        fail_ie7();
    };

    function fail_ie7() {
        setTimeout(function () {
            for (var i = 0; i < _imgWatch.length; i++) {
                var n = _imgWatch[i];
                if (!n.loaded) {
                    failover(n.obj);
                }
            }
            _imgWatch = [];
        }, 200);
    }

    function setSrc(img, data) {
        try {
            img.onerror = function () {
                failover(this);
            };
            _imgWatch.push({obj: img, loaded: false});
            img.onload = function () {
                for (var i = 0; i < _imgWatch.length; i++) {
                    var m = _imgWatch[i];
                    if (m.obj == this) {
                        m.loaded = true;
                    }
                }
            };
            img.src = "data:image\/jpeg;base64," + data;
        } catch (e) {
            failover(img);
        }
    }

    var failover = function (img) {
        if (img.getAttribute("data-b64-id") != null && img.getAttribute("data-b64-id") != "" && img.getAttribute("data-src") != null) {
            img.src = img.getAttribute("data-src");
        }
    };
    var watchReq = function (len) {
        var wt = 1250;
        if (len < 6) {
            wt = 1000;
        } else if (len > 10) {
            wt = 1500;
        }
        setTimeout(function () {
            if (!_dataLoaded["right"]) {
                var imgs = document.getElementById(_containerRightId).getElementsByTagName("IMG");
                for (var i = 0; i < imgs.length; i++) {
                    failover(imgs[i]);
                }
                _finish["right"] = true;
                botTag.ot(true);
            }
            setTimeout(function () {
                if (_hasSpImg && !_dataLoaded["left"]) {
                    var imgs = document.getElementById(_containerLeftId).getElementsByTagName("IMG");
                    for (var i = 0; i < imgs.length; i++) {
                        failover(imgs[i]);
                    }
                    _finish["left"] = true;
                }
            }, 500);
        }, wt);
    };
    var botTag = {ot: function (isInc) {
        var _bottag = botTag.get();
        if (isInc) {
            if (_bottag < 6) {
                _bottag++;
            }
        } else {
            if (_bottag > 0) {
                _bottag--;
            }
        }
        if (_bottag >= 2) {
            var date = new Date();
            date.setTime(date.getTime() + 24 * 3600 * 1000 * 5);
            document.cookie = "B64_BOT=1; expires=" + date.toGMTString();
        } else if (_bottag < 1) {
            if (document.cookie.match('B64_BOT=1')) {
                document.cookie = "B64_BOT=0;";
            }
        }
        try {
            if (window.localStorage) {
                window.localStorage[_BOTTAGLSNAME] = _bottag;
            }
        } catch (e) {
        }
    }, get: function () {
        try {
            if (window.localStorage) {
                var _bottag = window.localStorage[_BOTTAGLSNAME];
                _bottag = _bottag ? parseInt(_bottag) : 0;
            } else {
                return 0;
            }
            return _bottag;
        } catch (e) {
            return 0;
        }
    }};
    var cbr = function (data) {
        _reqEnd = new Date() * 1;
        if (_ispdc && bds.comm && _reqTime > 0 && _reqEnd > 0) {
            bds.comm.cusval = "b64_" + _dt + "_" + ( _reqEnd - _reqTime );
        }
        _loadState["cbr"] = 1;
        callback(data, "right");
    };
    var cbl = function (data) {
        _reqEndL = new Date() * 1;
        callback(data, "left");
    };
    var cbpr = function (data) {
        _loadState["cbpr"] = 1;
        callback(data, "right");
    };
    var callback = function (data, side) {
        _dataLoaded[side] = _hasPreload ? (_loadState.cbpr && _loadState.cbr) : true;
        if (data) {
            if (_data[side] === undefined) {
                _data[side] = {}
            }
            ;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    _data[side][key] = data[key];
                }
            }
        }
        if (_domLoaded[side] && _dataLoaded[side]) {
            imgLoad(_data[side], side);
        }
    };
    var setDomLoad = function (side) {
        _domLoaded[side] = true;
        if (_dataLoaded[side]) {
            imgLoad(_data[side], side);
        }
    };
    var predictImg = false;
    var sendLog = function (src) {
        var loghost = "http://nsclick.baidu.com/v.gif?pid=315&rsv_yc_log=3&";
        var n = "b64log__" + (new Date()).getTime(), c = window[n] = new Image();
        c.onload = (c.onerror = function () {
            window[n] = null;
        });
        c.src = loghost + src + "&_t=" + new Date() * 1;
        c = null;
    };
    cbs = function (data) {
        _rest = new Date() * 1;
        if ((_rest - _rsst) < 1500) {
            botTag.ot(false);
        } else {
            botTag.ot(true);
        }
    };
    ts = function () {
        _expGroup = 3;
        _rsst = new Date() * 1;
        loadJs(_domain + "image?imglist=1241886729_3226161681_58,1072899117_2953388635_58,2469877062_2085031320_58,155831992_309216365_58,2539127170_1607411613_58,1160777122_283857721_58,1577144716_3149119526_58,2339041784_1038484334_58&cb=bds.base64.cbs");
    };
    return {init: init, cbl: cbl, cbr: cbr, cbpr: cbpr, setDomLoad: setDomLoad, cbs: cbs, ts: ts, predictImg: predictImg}
})();

bds.comm.domain = "http://www.baidu.com";
bds.comm.ubsurl = "http://sclick.baidu.com/w.gif";
bds.comm.tn = "baiduhome_pg";
bds.comm.tng = "organic";
bds.comm.tnuka = "0";
bds.comm.queryEnc = "%3Cscript%3Ealert%28123%29%3C/script%3E";
bds.comm.queryId = "8000f2bc00017a83";
bds.comm.inter = "";
bds.comm.resTemplateName = "baidu";
bds.comm.sugHost = "http://suggestion.baidu.com/su";
bds.comm.ishome = 0;
bds.comm.curResultNum = "10";
bds.comm.rightResultExist = false;
bds.comm.protectNum = 0;
bds.comm.zxlNum = 0;
bds.comm.pageNum = parseInt('1') || 1;
bds.comm.pageSize = parseInt('10') || 10;
bds.comm.encTn = '4241/CqQeqVHnzvf7CLoPSmkTCTmytuBBkoJgnV/L/ZD+PnoJUQq+cq/QNUsp+qJjvn9';
bds.se.mon = {'loadedItems': [], 'load': function () {
}, 'srvt': -1};
try {
    bds.se.mon.srvt = parseInt(document.cookie.match(new RegExp("(^| )BDSVRTM=([^;]*)(;|$)"))[2]);
    document.cookie = "BDSVRTM=;expires=Sat, 01 Jan 2000 00:00:00 GMT";
} catch (e) {
    bds.se.mon.srvt = -1;
}
bdUser = bds.comm.user ? bds.comm.user : null;
bdQuery = bds.comm.query;
bdUseFavo = bds.comm.useFavo;
bdFavoOn = bds.comm.favoOn;
bdCid = bds.comm.cid;
bdSid = bds.comm.sid;
bdServerTime = bds.comm.serverTime;
bdQid = bds.comm.queryId;
bdstoken = bds.comm.stoken;
login_success = [];
bds.comm.seinfo = {'fm': 'se', 'T': '1414381177', 'y': 'AB1DDEFA', 'rsv_cache': (bds.se.mon.srvt > 0) ? 0 : 1 };
bds.comm.cgif = "http://c.baidu.com/c.gif?t=0&q=%3Cscript%3Ealert%28123%29%3C/script%3E&p=0&pn=1";
bds.comm.upn = {"browser": "chrome", "os": "windows", "win": "xp"};
bds.comm.imgZoomHover = false;
bds.comm.imgZoomHover2 = false;
bds.comm.imgZoomHover3 = false;
bds.util.setContainerWidth();
bds.ready(function () {
    $(window).on("resize", function () {
        bds.util.setContainerWidth();
        bds.event.trigger("se.window_resize");
    });
    bds.util.setContainerWidth();
});
