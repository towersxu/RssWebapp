//=======================本单元的资源字符串=======================
STR_ERROR_COMMON = "执行命令发生错误!";
STR_ERROR_COMMON_en = "Error arised when executing command!";
STR_ERROR_CREATE_XMLHTTP_FAIL = "不能创建xmlhttp通信组件.";
STR_ERROR_CREATE_XMLHTTP_FAIL_en = "Can't create xmlhttp component.";
STR_COMMANDS_ISEMPTY = "访问命令数组为空。";
STR_COMMANDS_ISEMPTY_en = "The commands group accessed is empty!";
STR_ERROR_XMLHTTP_SEND = "调用xmlhttp方法send函数出错。";
STR_ERROR_XMLHTTP_SEND_en = "Error arised when invoking the send method of xmlhttp.";
STR_ERROR_XMLHTTP_OPEN = "调用xmlhttp方法open函数出错。";
STR_ERROR_XMLHTTP_OPEN_en = "Error arised when invoking the open method of xmlhttp.";
STR_ERROR_XMLHTTP_ACCESSERROR = "发送命令失败，请检查当前设备是否能被访问！\r\n\n";
STR_ERROR_XMLHTTP_ACCESSERROR_en = "Sending command failed,please make sure the current device is accessible.\r\n\n";
STR_ERROR_XMLHTTP_ACESS_DENIED = "用户登陆过快，访问被拒绝，请等一会儿再试.";
STR_ERROR_XMLHTTP_ACESS_DENIED_en = "Access Denied, invalid user login so quickly, please try later.";
RES_SPAN_COMMAND = "命令";
RES_SPAN_COMMAND_en = "Command";
RES_SPAN_MODE = "模式";
RES_SPAN_MODE_en = "Mode";
RES_SPAN_RESULT = "结果";
RES_SPAN_RESULT_en = "Result";
RES_BUTTON_SYNCEXCUTE = "同步执行";
RES_BUTTON_SYNCEXCUTE_en = "Synchronous Execution";
RES_BUTTON_ASYNCEXCUTE = "异步执行";
RES_BUTTON_ASYNCEXCUTE_en = "Asynchronous Execution";

RES_LOGIN_AUTH_ERR = "认证失败";
RES_LOGIN_AUTH_ERR_en = "authentic error, try agin!";


var EXCU_SHELL_URL = "/EXCU_SHELL";
var CMD_SEPERATOR = "@@@@@@";
var currentTreeID = -1;
currentTreeID = window.parent.currentTreeID;
//document.write("<script language='javascript' src='/js/cookie.js'></script>");
/*function loadScript(){
 var script =  document.createElement('script');
 script.type="text/javascript" ;
 script.src="/js/cookie.js" ;
 var sc = document.getElementsByTagName('script')[0]
 document.getElementsByTagName('head')[0].insertBefore(script,sc);
 }
 loadScript();
 */


/**
 * 检测页面返回的错误信息
 *    当返回登陆过快错误时，替换返回错误串
 */
function replaceErrorMessage(msg) {
    if (msg.indexOf("<html><head><title>Document Error: Access Denied</title></head>") != -1) {
        if (msg.indexOf("<p>Access Denied, invalid user login so quickly, please try later.</p></body></html>") != -1) {
            return getMessage("STR_ERROR_XMLHTTP_ACESS_DENIED");
        }
    }
    return msg;
}
/**
 *清除命令中的分隔符"@@@@@@"
 */
function clearCmdSeperator(result) {
    if (result == null) {
        return;
    }
    var regexp = new RegExp(CMD_SEPERATOR, "g");
    return result.replace(regexp, "");
}

function __getXmlhttp(xmlhttp) {
    if (xmlhttp)
        return xmlhttp;
    try {
        xmlhttp = new XMLHttpRequest();
    } catch (e) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

var MODE_STD = "STD";             //        ">" 	
var MODE_EN = "EN";               //        "#"
var MODE_CONF = "CONF";           //		"(config)#"	

function getNoConfirmCmds(commands) {
    var aryNoConfirmCmds = new Array(commands.length);
    for (var i = 0; i < commands.length; i++) {
        aryNoConfirmCmds[i] = [commands[i], "n"];
    }
    return aryNoConfirmCmds;
}

/**
 *获取http头的变量的值
 *@strHeader http头的变量
 *@return 返回http头的变量值.如果发生错误，则返回NULL。
 */
function getResponseHeader(strHeader) {

    var xmlhttp = __getXmlhttp(syncXmlhttp);
    if (!xmlhttp) {
        alert(getMessage("STR_ERROR_CREATE_XMLHTTP_FAIL"));
        return null;
    }
    try {
        xmlhttp.open("GET", EXCU_SHELL_URL, false);
    }catch (E) {
        alert(getMessage("STR_ERROR_XMLHTTP_OPEN") + E.message);
        return null;
    }

    var commands = [
        ["whoami", "n"]
    ];
    var mode = MODE_STD;
    xmlhttp.setRequestHeader("mode", mode);
    xmlhttp.setRequestHeader("cmdnum", commands.length);

    for (var i = 1; i <= commands.length; i++) {
        xmlhttp.setRequestHeader("command" + i, (commands[i - 1][0]));
        xmlhttp.setRequestHeader("confirm" + i, (commands[i - 1][1]));
    }

    try {
        xmlhttp.send(null);
    }
    catch (E) {
        if (window.parent.currentTreeID != currentTreeID) {
            alert(getMessage("STR_ERROR_XMLHTTP_ACCESSERROR") + getMessage("STR_ERROR_XMLHTTP_SEND") + E.message);
        }
        return null;
    }

    return xmlhttp.getResponseHeader(strHeader);
}

//同步对象
var syncXmlhttp = false;
/**
 *同步访问设备。
 *@commands 没有交换的访问命令数组，如["show run","show ver"]
 *@mode 访问模式，如MODE_EN
 *@return 设备返回的数据.如果发生错误，则返回NULL。
 */
function excuteShellCommand(commands, mode) {
    return syncExecCmds(getNoConfirmCmds(commands), mode);
}
/**
 *同步访问设备。
 *@commands 访问命令数组，如[["write","y"],["show ver","n"]]
 *@mode 访问模式，如MODE_EN
 *@return 设备返回的数据.如果发生错误，则返回NULL。
 */
function syncExecCmds(commands, mode) {
    var xmlhttp = __getXmlhttp(syncXmlhttp);
    if (!xmlhttp) {
        alert(getMessage("STR_ERROR_CREATE_XMLHTTP_FAIL"));
        return null;
    }

    try {
        xmlhttp.open("GET", EXCU_SHELL_URL + "?" + new Date().getTime(), false);
    }catch (E) {
        alert(getMessage("STR_ERROR_XMLHTTP_OPEN") + E.message);
        return null;
    }

    xmlhttp.setRequestHeader("mode", mode);
    xmlhttp.setRequestHeader("cmdnum", commands.length);

    for (var i = 1; i <= commands.length; i++) {
        xmlhttp.setRequestHeader("command" + i, (commands[i - 1][0]));
        xmlhttp.setRequestHeader("confirm" + i, (commands[i - 1][1]));
    }

    try {
        xmlhttp.send(null);
    }catch (E) {
        if (window.parent.currentTreeID == currentTreeID) {
            alert(getMessage("STR_ERROR_XMLHTTP_ACCESSERROR") + getMessage("STR_ERROR_XMLHTTP_SEND") + E.message);
        }
        return null;
    }

    return replaceErrorMessage(xmlhttp.responseText);
}

/**
 * 同步执行一组没有享用命令。
 *@commands 访问命令数组，如["inf f0","ip add dhcp"]
 *@mode 访问模式，如MODE_EN
 *@return 如果执行成功，返回TRUE，否则返回FALSE。
 */
function syncExecNoResponseCmds(commands, mode) {
    if (commands.length == 0) {
        //alert(getMessage("STR_COMMANDS_ISEMPTY"));
        return true;
    }
    //alert("正在执行命令：\r\n"+commands);
    var result = excuteShellCommand(commands, mode);
    if (null != result) {
        var regexp = new RegExp(CMD_SEPERATOR, "g");
        result = result.replace(regexp, "");
        if (result.length != 0) {
            alert(getMessage("STR_ERROR_COMMON") + "\r\n" + result);
            return false;
        }
        return true;
    }
    return false;
}

/**
 *xmlhttp对象池
 */
var __XmlHttpPool__ ={
    m_MaxPoolLength: 10,
    m_XmlHttpPool: [],
    __requestObject: function () {
        var xmlhttp = null;
        var pool = this.m_XmlHttpPool;

        for (var i = 0; i < pool.length; ++i) {
            if (pool[i].readyState == 4 || pool[i].readyState == 0) {
                xmlhttp = pool[i];
                break;
            }
        }

        if (xmlhttp == null) {
            return this.__extendPool();
        }

        return xmlhttp;
    },
    __extendPool: function () {
        var xmlhttp = null;
        xmlhttp = __getXmlhttp(xmlhttp);

        if ((xmlhttp) && (this.m_XmlHttpPool.length < this.m_MaxPoolLength)) {
            this.m_XmlHttpPool.push(xmlhttp);
        }
        return xmlhttp;
    },
    CancelAll: function () {
        var extendPool = this.__extendPool;
        this.__extendPool = function () {
            return null;
        }

        for (var i = 0; i < this.m_XmlHttpPool.length; ++i) {
            this.m_XmlHttpPool[i].abort();
        }
        this.__extendPool = extendPool;
    }
};


/**
 *异步访问设备。
 *@commands 访问命令数组，如["show run","show ver"]
 *@mode 访问模式，如MODE_EN
 *@callbackfun 访问返回后的回掉函数，格式: function (responseText)
 *            responseText中返回执行命令的内容，如果发生错误，则传入NULL
 */
function asynExcuteShellCommand(commands, mode, callbackfun) {
    asynExecCmds(getNoConfirmCmds(commands), mode, callbackfun);
}

/**
 *异步访问设备。
 *@commands 访问命令数组，如[["wr","y"]]
 *@mode 访问模式，如MODE_EN
 *@callbackfun 访问返回后的回掉函数，格式: function (responseText)
 *            responseText中返回执行命令的内容，如果发生错误，则传入NULL
 */
function asynExecCmds(commands, mode, callbackfun) {
    __asynExecCmds(commands, mode, callbackfun, 4);
}

/**
 *异步访问设备。
 *@commands 访问命令数组，如[["wr","y"]]
 *@mode 访问模式，如MODE_EN
 *@callbackfun 访问返回后的回掉函数，格式: function (responseText)
 *            responseText中返回执行命令的内容，如果发生错误，则传入NULL
 */
function asynSendCmds(commands, mode, callbackfun) {
    __asynExecCmds(commands, mode, callbackfun, 1);
}

/**
 *异步访问设备。
 *@commands 访问命令数组，如[["wr","y"]]
 *@mode 访问模式，如MODE_EN
 *@callbackfun 访问返回后的回掉函数，格式: function (responseText)
 *            responseText中返回执行命令的内容，如果发生错误，则传入NULL
 */
function __asynExecCmds(commands, mode, callbackfun, readyState) {
    var xmlhttp = __XmlHttpPool__.__requestObject();

    if (!xmlhttp) {
        alert(getMessage("STR_ERROR_CREATE_XMLHTTP_FAIL"));
        callbackfun("command send success.");
        return;
    }
    try {
        xmlhttp.open("GET", EXCU_SHELL_URL + "?" + new Date().getTime(), true);
    }
    catch (E) {
        alert(getMessage("STR_ERROR_XMLHTTP_OPEN") + E.message);
        if (typeof callbackfun == "function") {
            callbackfun(null);
        } else if (typeof callbackfun == "object" && callbackfun != null) {
            callbackfun.func.call(callbackfun.scope, null);
        }
        return;
    }
    xmlhttp.setRequestHeader("mode", mode);
    xmlhttp.setRequestHeader("cmdnum", commands.length);

    for (var i = 1; i <= commands.length; i++) {
        xmlhttp.setRequestHeader("command" + i, (commands[i - 1][0]));
        xmlhttp.setRequestHeader("confirm" + i, (commands[i - 1][1]));
    }

    if ("Netscape" == navigator.appName) {
        xmlhttp.ownerVar = {callbackfun: callbackfun};
    }

    xmlhttp.onreadystatechange = function () {
        //命令已经下发成功。
        var callbackfunLocal = callbackfun;
        if ("Netscape" == navigator.appName) {
            callbackfunLocal = this.ownerVar.callbackfun;
        }
        if ((readyState == 1) && (xmlhttp.readyState == 1)) {
            if (typeof callbackfunLocal == "function") {
                callbackfunLocal(null);
            } else if (typeof callbackfunLocal == "object" && callbackfunLocal != null) {
                callbackfunLocal.func.call(callbackfunLocal.scope, null);
            }
        }
        //命令执行结束。
        if ((readyState == 4) && ((xmlhttp.readyState == 4 || xmlhttp.readyState == 'complete'))) {
            if (window.parent.currentTreeID != currentTreeID) {
                return;
            }
            if (typeof callbackfunLocal == "function") {
                if (xmlhttp.responseText && (xmlhttp.responseText != ""))
                    callbackfunLocal(replaceErrorMessage(xmlhttp.responseText));
                else {
                    callbackfunLocal(null);
                }
            } else if (typeof callbackfunLocal == "object" && callbackfunLocal != null) {
                if (xmlhttp.responseText && (xmlhttp.responseText != ""))
                    callbackfunLocal.func.call(callbackfunLocal.scope, replaceErrorMessage(xmlhttp.responseText));
                else
                    callbackfunLocal.func.call(callbackfunLocal.scope, null);
            }
        }
    }

    try {
        xmlhttp.send(null);
    }
    catch (E1) {
        if (window.parent.currentTreeID == currentTreeID) {
            alert(getMessage("STR_ERROR_XMLHTTP_ACCESSERROR") + getMessage("STR_ERROR_XMLHTTP_SEND") + E1.message);
        }
        if (typeof callbackfun == "function") {
            callbackfun(null);
        } else if (typeof callbackfun == "object" && callbackfun != null) {
            callbackfun.func.call(callbackfun.scope, null);
        }
        return;
    }
}


/*
 *同步请求URL
 */
function syncRequestURL(url) {
    var xmlhttp = __getXmlhttp(syncXmlhttp);

    if (!xmlhttp) {
        alert(getMessage("STR_ERROR_CREATE_XMLHTTP_FAIL"));
        return null;
    }

    try {
        xmlhttp.open("GET", url, false);
    }catch (E) {
        alert(getMessage("STR_ERROR_XMLHTTP_OPEN") + E.message);
        return null;
    }

//  xmlhttp.setRequestHeader("mode", "mode");
// xmlhttp.setRequestHeader("cmdnum", 0);

    try {
        xmlhttp.send(null);
    }catch (E) {
        if (window.parent.currentTreeID == currentTreeID) {
            alert(getMessage("STR_ERROR_XMLHTTP_ACCESSERROR") + getMessage("STR_ERROR_XMLHTTP_SEND") + E.message);
        }
        return null;
    }

    return replaceErrorMessage(xmlhttp.responseText);
}

/*
 *异步请求URL
 */
function asynRequestURL(url, callbackfun) {
    var xmlhttp = __XmlHttpPool__.__requestObject();

    if (!xmlhttp) {
        alert(getMessage("STR_ERROR_CREATE_XMLHTTP_FAIL"));
        callbackfun(null);
        return;
    }
    try {
        xmlhttp.open("GET", url, true);
    }catch (E) {
        alert(getMessage("STR_ERROR_XMLHTTP_OPEN") + E.message);
        if (typeof callbackfun == "function") {
            callbackfun(null);
        } else if (typeof callbackfun == "object" && callbackfun != null) {
            callbackfun.func.call(callbackfun.scope, null);
        }
        return;
    }
//  xmlhttp.setRequestHeader("mode", "mode");
//  xmlhttp.setRequestHeader("cmdnum", 0);

    if ("Netscape" == navigator.appName) {
        xmlhttp.ownerVar = {callbackfun: callbackfun};
    }
    xmlhttp.onreadystatechange = function () {
        var callbackfunLocal = callbackfun;
        if ("Netscape" == navigator.appName) {
            callbackfunLocal = this.ownerVar.callbackfun;
        }
        if (xmlhttp.readyState == 4 || xmlhttp.readyState == 'complete') {
            if (window.parent.currentTreeID != currentTreeID) {
                return;
            }
            if (typeof callbackfunLocal == "function") {
                if (xmlhttp.responseText)
                    callbackfunLocal(replaceErrorMessage(xmlhttp.responseText));
                else {
                    callbackfunLocal(null);
                }
            } else if (typeof callbackfunLocal == "object" && callbackfunLocal != null) {
                if (xmlhttp.responseText)
                    callbackfunLocal.func.call(callbackfunLocal.scope, replaceErrorMessage(xmlhttp.responseText));
                else
                    callbackfunLocal.func.call(callbackfunLocal.scope, null);
            }
        }
    }

    try {
        xmlhttp.send(null);
    }catch (E) {
        if (window.parent.currentTreeID == currentTreeID) {
            alert(getMessage("STR_ERROR_XMLHTTP_ACCESSERROR") + getMessage("STR_ERROR_XMLHTTP_SEND") + E.message);
        }
        if (typeof callbackfun == "function") {
            callbackfun(null);
        } else if (typeof callbackfun == "object" && callbackfun != null) {
            callbackfun.func.call(callbackfun.scope, null);
        }
        return;
    }
}

/*
 *功能：通用的下发SHELL命令函数
 *参数：
 *	cmdArr       : （必选）命令数组
 *	callbackFunc : （可选）实例对象的函数（用于回调。如果指定，不管命令执行成功与否都会调用）
 *	messages     : （可选）自定义提示消息（messages[0]为执行失败提示，messages[1]为执行成功提示，messages[2]为未知错误提示。）
 *	tipsIgnore   : （可选）需要被程序忽略的信息或者测试信息的RegExp对象的数组（见“说明”）
 *  alertMsg     : （可选）执行该函数时是否弹出消息（默认弹出消息。针对批量执行时，可以设置为false，禁止弹出消息）
 *返回：
 *	成功返回true，失败返回false；如果指定了回调函数，则无返回值。
 *说明：
 *	如果下发的命令返回有提示信息而并非报错信息，也会被判定为执行失败，
 *	而为了解决这个问题，就需要传递一个字符串或RegExp对象的数组 tipsIgnore，
 *  tipsIgnore 数组里面的元素将被用来(或用来创建一个RegExp对象)将设备返回内容中匹配的内容去除掉。
 */

//存放常用的需要忽略掉的消息或RegExp对象
var commIgnoreTips =
    [
        /\s*Please wait[\s.]+Done.\s*/
    ];
function comm_executeCommand(cmdArr, callbackFunc, messages, tipsIgnore, alertMsg) {
    var executeSuccess;
    var ret = excuteShellCommand(cmdArr, MODE_CONF);
    var vlanCfgFlag;
    if (ret == null) {
        executeSuccess = false;
    } else {
        //过滤掉需要忽略的内容
        var ignoreArr = tipsIgnore instanceof Array ? commIgnoreTips.concat(tipsIgnore) : commIgnoreTips;
        for (var i = 0, loops = ignoreArr.length; i < loops; i++) {
            ret = ret.replace(ignoreArr[i], "");
        }

        for (var i = 0, loops = cmdArr.length; i < loops; i++) {
            if (cmdArr[i].indexOf("switch") != 0) {
                vlanCfgFlag = 1;
                break;
            }
        }

        var p = ret.lastIndexOf(CMD_SEPERATOR);

        if (p == (cmdArr.length - 1) * CMD_SEPERATOR.length) {
            executeSuccess = true;
        } else if (vlanCfgFlag == 1) {
            executeSuccess = true;
        } else {
            if (false != alertMsg) {
                //命令执行失败的提示消息
                var errorMsg = (messages && messages[0]) ? messages[0] + ret : MPLang.RES_CONFIGERROR + ret;
                alert(clearCmdSeperator(errorMsg));
            }
            executeSuccess = false;
        }
    }

    //如果命令执行成功并有回调函数
    if (executeSuccess) {
        if (false != alertMsg) {
            //操作成功的提示消息
            var tipMsg = (messages && messages[1]) ? messages[1] : "配置成功！";
            alert(clearCmdSeperator(tipMsg));
        }
    }

    if (typeof callbackFunc == "function") {
        callbackFunc(null);
    } else if (typeof callbackFunc == "object" && callbackFunc != null) {
        callbackFunc.call(callbackFunc.scope, null);
    }

    return executeSuccess;
}

/*
 *配置信息批量下发
 *
 *参数：
 *	arr             : （必须）原生数组/命令数组
 *	batchSize       : （可选）每批下发配置对象个数（默认为objArr数组的长度，即一次下发。） 
 *	generateCmdFunc : （可选）命令生成函数（如果为空，则arr应为命令数组）
 *	execCmdFunc     : （可选）命令执行函数（默认为comm_executeCommand）
 *	caller          : （可选）generateCmdFunc和execCmdFunc函数调用者（如果generateCmdFunc或execCmdFunc里面有this出现时，此参数很必要）
 *
 *返回：
 *	全部下发成功返回true，否则返回false。 
 *
 */
function batchExec(arr, batchSize, generateCmdFunc, execCmdFunc, caller) {
    if (null == batchSize) {
        batchSize = arr.length;
    }

    var batchObj = new Paging(batchSize);
    batchObj.setCount(arr.length);
    var batches = batchObj.getPages();
    var executeCount = 0, successCount = 0;

    do {
        batchObj.setCurrentPage(executeCount + 1);
        var indexFrom = batchObj.getIndexFrom();
        var indexTo = batchObj.getIndexTo();
        var cmds = __getBatchCmds(indexFrom, indexTo);

        if (typeof execCmdFunc == "function" && execCmdFunc.apply(caller, [cmds])) {
            successCount++;
        } else if (comm_executeCommand(cmds, null, null, null, false)) {
            successCount++;
        }

        executeCount++;
    } while (batchObj.getCurrentPage() < batches);

    //return (successCount == executeCount);
    return 1;

    //从arr数组获得批量的命令数组
    function __getBatchCmds(ifrom, ito) {
        return (typeof generateCmdFunc == "function") ? generateCmdFunc.apply(caller, [arr.slice(ifrom, ito + 1)]) : arr.slice(ifrom, ito + 1);
    }
}

function excuteYesShellCommand(commands, mode) {
    return syncExecCmds(getYesConfirmCmds(commands), mode);
}

function getYesConfirmCmds(commands) {
    var aryNoConfirmCmds = new Array(commands.length);
    for (var i = 0; i < commands.length; i++) {
        aryNoConfirmCmds[i] = [commands[i], "y"];
    }
    return aryNoConfirmCmds;
}

function asynExcuteCommand(data) {
    if (data.cmd) {
        var comm = getNoConfirmCmds(data.cmd);
        $.ajax({
            url: EXCU_SHELL_URL + new Date().getTime(),
            type: 'GET',
            timeout: data.timeout ? data.timeout : "",
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("mode", (data.mode || MODE_EN));
                xhr.setRequestHeader("cmdnum", comm.length);

                for (var i = 1; i <= comm.length; i++) {
                    xhr.setRequestHeader("command" + i, (comm[i - 1][0]));
                    xhr.setRequestHeader("confirm" + i, (comm[i - 1][1]));
                }
                if (typeof(data.before) == "function") {
                    data.before();
                }
            },
            success: function (d) {
                if (typeof(data.success) == "function") {
                    data.success(d);
                }
            },
            error: function (e) {
                if (typeof(data.error) == "function") {
                    data.error(e);
                }
            }
        })
    }
}
/**
 * 同步获取数据
 * @param data
 */
function synExcuteCommand(options) {
    if (options.cmd) {
        var backdata = null;
        var comm = getNoConfirmCmds(options.cmd);
        var defaults = {
            type: "GET",
            async: false,
            before: function (xhr) {
                xhr.setRequestHeader("mode", (options.mode || MODE_EN));
                xhr.setRequestHeader("cmdnum", comm.length);

                for (var i = 1; i <= comm.length; i++) {
                    xhr.setRequestHeader("command" + i, (comm[i - 1][0]));
                    xhr.setRequestHeader("confirm" + i, (comm[i - 1][1]));
                }
            },
            success: function (data) {
                backdata = data;
            }
        };
        var opts = $.extend(defaults, options);
        $.ajax({
            url: EXCU_SHELL_URL + new Date().getTime(),
            type: 'GET',
            async: false,
            beforeSend: function (xhr) {
                opts.before(xhr);
            },
            success: function (d) {
                opts.success(d);
            },
            error: function (e) {
                opts.error(e)
            }
        })
        return   backdata;
    }
}

