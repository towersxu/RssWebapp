/**
 * Created by xt on 14-11-10.
 */
var progressBar = (function(){
    var _progress_begin = 0;
    var _progress_speed = 0.1;
    var _progress_selector = "progressBar"
    function ProgressBar(begin, end, id, bgColor, speed,interval) {
        _progress_begin = begin || 0;
        this.end = end || 100;
        _progress_selector = id || "progressBar";
        this.bgColor = bgColor || "green";
        _progress_speed = speed || 0.1;
        this.interval = interval || 30;
        this.ele = document.getElementById(this.id);
        this.progress = this.ele.style.width;
    }
    function started(){
        _progress_begin += 0.1;
        document.getElementById("progressBar").style.width = _progress_begin +"%";
    }
    ProgressBar.prototype.start = function () {
        var fun = this.run;
        var int = this.interval;
        this.timer = setInterval(this.run,int);
    };
    ProgressBar.prototype.stop = function () {
        clearInterval(this.timer);
    };
   return new ProgressBar();
}());