/**
 * Created by xt on 14-11-11.
 */
var ProgressBar = (function () {
    var _progress_begin,
        _progress_speed ,
        _progress_selector,
        _progress_timer,
        _progress_end,
        _progress_interval,
        _progress_callback;

    function ProgressBar(begin, end, id, time, interval, callback) {
        _progress_begin = begin || 0;
        _progress_end = end || 100;
        _progress_selector = id || "progressBar";
        _progress_speed = ((_progress_end - _progress_begin) / 40) * interval / 1000 || 0.1;
        _progress_interval = interval || 10;
        _progress_callback = callback;
    }

    function started() {
        _progress_begin += _progress_speed;
        document.getElementById("progressBar").style.width = _progress_begin + "%";
        if (_progress_begin >= _progress_end) {
            clearInterval(_progress_timer);
            _progress_callback();
        }
    }

    ProgressBar.prototype.start = function () {
        _progress_timer = setInterval(started, _progress_interval);
    };
    ProgressBar.prototype.stop = function () {
        clearInterval(_progress_timer);
    };
    ProgressBar.prototype.changeSpeed = function (speed) {
        _progress_speed = speed;
    };
    ProgressBar.prototype.isComplete = function () {
        return _progress_begin >= _progress_end;
    };
    ProgressBar.prototype.changeEnd = function (end) {
        _progress_end = end;
    };
    ProgressBar.prototype.createMaskProgress = function () {
        var height = window.screen.height,
            width = window.screen.width,
            mask_node = document.getElementById("mask");
        if (!mask_node) {
            var mask = document.createElement("div");
            mask.setAttribute("id", "mask");
            mask.setAttribute("style", "z-index:99999;position: fixed;top: 0;left: 0;display:table-cell;text-align:center;vertical-align:middle");
            mask.style.height = height + "px";
            mask.style.width = width + "px";

            var div = document.createElement("div");
            div.setAttribute("style", "width: 200px;border: 1px solid #dddddd;");
            div.style.margin = (height - 20) / 2 + 'px auto';
            mask.appendChild(div);

            var div1 = document.createElement("div");
            div1.setAttribute("id", "progressBar");
            div1.setAttribute("style", "background:#7b7b7b;height:15px;width: 0%;");
            div.appendChild(div1);
            document.body.appendChild(mask);
        }
    };
    return ProgressBar;
}());