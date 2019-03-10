---
layout: post
title:  "关于JavaScript的AJAX"
date:   2016-03-23 19:47:00 +0800
categories: myblog
---
**AJAX即“Asynchronous Javascript And XML”！它类似于DHTML或LAMP，AJAX不是指一种单一的技术，而是有机地利用了一系列相关的技术。**


#### 概念及特征
* AJAX在本质上是一个浏览器端的技术（依赖于window的相关函数对象），所以它也有很多浏览器的兼容性问题
* AJAX是用来描述基于用脚本操纵HTTP请求的Web应用架构。用脚本操纵HTTP和web服务器进行数据交换，但不会导致页面重载。

#### 相似产物Comet
* Comet也是使用脚本操纵HTTP的Web应用架构的相关术语。
* Comet是Web服务器发起通信并异步发送消息到客户端的技术。（服务端向客户端“推送”数据）
* 而AJAX是客户端从服务端“拉取”数据
* Comet和Ajax都是美国的洗涤日用品牌！！！
* Comet GitHub外链： https://github.com/wandenberg/nginx-push-stream-module

#### 底层实现 or "传输协议"
* "img"元素可以通过为其src属性设置特定URL，浏览器发起的HTTP GET请求会从这个URL上下载图片。虽然可以通过实例化HTMLImageElement对象即：
new Image()的方式创建一个"img"，并为其src属性设置带有查询字符串信息的URL，实现客户端发送数据到服务器，但在客户端却无法轻易的从服务器
响应的图片中提取出信息！所以此技术常用于前端log记录！(这种类型的图片也称之为“网页信标”)
<pre class="brush:js;">
var unique = (function () {
    //此方法也可用Math.random()代替
     var time = (new Date()).getTime() + "-",
         i = 1;
     return function () {
        return time + (i++);
     }
 })();

var imgLog = function (url) {
    if (typeof url !== "string" || !url) {
        return;
    }
    var uid = unique();
    var img_id = "_img_" + uid;
    var img = new Image();
    img.hidden = true;
    window[img_id] = img;
    img.onload = img.onerror = function () {//销毁一些对象
        img.onload = img.onerror = null;
        img = undefined;
        delete window[img_id];
    }
    url += url.indexOf("?") == "-1" ? '?_uid=' + uid : '&_uid=' + uid;
    img.src = url;
 };
</pre>
* "iframe"则相比“img”元素强大些，也能通过设置它的src属性从服务端获取HTML文档。可以直接显示给用户，也可隐藏起来通过使用脚本遍历获取
相关数据！但其受制于“同源策略”。
* "script"元素也能通过设置它的src属性发起携带查询字符串参数的HTTP GET请求，且并不受制于“同源策略”！通常服务器会使用JSON格式将数据
返回给客户端，JavaScript解析器能自动将其“解码”，此种AJAX传输协议也叫做“JSONP”。
<pre class="brush:js;">
function success(json) {
    //成功回调
}

//创建 script 标签并加入到页面中
var callbackName = ('jsonp_' + Math.random()).replace(".", "");
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
head.appendChild(script);
var timer = setTimeout(function() {
    window[callbackName] = undefined;
    //如果20s后还未能执行jsonp回调，则认为失败！...
}, 20000);

//创建jsonp回调函数
//response为jsonp_随机数({JSON数据})
window[callbackName] = function (json) {
    window.clearTimeout(timer);
    head.removeChild(script);
    window[callbackName] = undefined;
    //执行成功方法
    success(json);
};
//发送请求(callback是和服务端约定的获取回调函数名称的key，而“callback”为大多数情况下的默认值)
script.src = "" + "?callback=" + callbackName;
</pre>
* "XMLHttpRequest"更简单的异步交互技术！它定义了用脚本操作HTTP的API，并且所有的浏览器都支持XMLHttpRequest对象。虽然名字中含有XML
但它并没有限定只能使用XML文档，它能获取到任何类型的文本文档！
<pre class="brush:js;">
function createXHR(){
    if(typeof XMLHttpRequest != "undefined"){ // 非IE6浏览器
        return new XMLHttpRequest();
    }else if(typeof ActiveXObject != "undefined"){   // IE6浏览器
        var version = [
            "MSXML2.XMLHttp.6.0",
            "MSXML2.XMLHttp.3.0",
            "Microsoft.XMLHTTP",
        ];
        for(var i = 0; i < version.length; i++){
            try{
                return new ActiveXObject(version[i]);
            }catch(e){
                //异常处理
            }
        }
    }else{
        throw new Error("您的系统或浏览器不支持XHR对象！");
    }
}
// 封装ajax
function create_ajax(obj){
    obj = obj || {};
    var xhr = createXHR();
    obj.url = obj.url + "?rand=" + Math.random(); // 防止缓存
    if(obj.method === "get"){      // 判断使用的是否是get方式发送
        obj.url += obj.url.indexOf("?") == "-1" ? "?" + obj.data : "&" + obj.data;
    }

    // 异步的时候需要触发onreadystatechange事件，同步的省略...
    xhr.onreadystatechange = function(){
        // 执行完成
        if(xhr.readyState === 4){
            callBack();
        }
    }
    //open方法的3个参数(HTTP方法或动作, URL, 是否异步)
    xhr.open(obj.method, obj.url, true);

    //设置http头，但大多数的http头信息是无法改变的！
    //application/x-www-form-urlencoded 数据被编码为名称/值对 最常见的格式
    //multipart/form-data 使用表单上传文件时使用
    //application/json 用来告诉服务端消息主体是序列化后的 JSON 字符串
    //text/xml 使用XML作为编码方式的远程调用
    //text/plain 以纯文本形式进行编码

    if (obj.method === "post") {
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(obj.data);
    } else {
        xhr.send(null);
    }

    //返回数据
    //同步时，直接调用
    function callBack() {
        // 判断是否返回正确
        if (xhr.status === 200) {
            if (typeof obj.success === "function") {
              obj.success(xhr.response);
            }
        } else {
            if (typeof obj.error === "function") {
                obj.error(xhr.response);
            }
        }
        //xhr.status === 0请求失败
        //xhr.statusText === "abort" 请求被cancle
        //xhr.statusText === "timeout" 请求超时
    }
}

create_ajax({
    "method" : "get",
    "url" : "目的URI",
    "data" : '',
    "success" : function(data){
        //成功处理动作
    },
    "error" : function(data){
        //失败处理动作
    }
});

</pre>
