/**
 * Created by Administrator on 14-9-30.
 */
(function(){
    var height = window.screen.height;
    var width = window.screen.width;
    var str ='<div id="mask" style="background: #000;position: fixed;top: 0;left: 0;display:table-cell;'+
    'text-align:center;vertical-align:middle"><img id="loading" src="./img/003.gif" width="100" height="100" ></div>';
    document.write(str);
    document.getElementById('mask').style.height =height+"px";
    document.getElementById('mask').style.width =width+"px";
    document.getElementById('loading').style.margin =((height-200)/2)+"px 0 0 0";
}());

function test(){
    document.getElementById('mask').style.display = "none";
}
