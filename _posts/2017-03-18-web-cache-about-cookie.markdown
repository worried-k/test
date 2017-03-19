---
layout: post
title:  "关于cookie的使用整理"
date:   2017-03-18 12:48:00 +0800
categories: myblog
---
**HTTP Cookie（也叫Web cookie或者浏览器Cookie），它保存在用户的浏览器端，并在发出符合设定条件的http请求时会默认携带的一段文本片段**

#### <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie" target="_blank">document.cookie</a> 

#### <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies" target="_blank">TTP Cookie</a> 

#### Cookie的实现
* Cookie是Web Server通过HTTP头信息下发给浏览器的任意的一段文本，浏览器将按照文本中包含的规则将信息缓存在浏览器中，在此后的请求中，浏览器会将可以携带Cookie带回给Web Server。同时在浏览器允许的情况下，Cookie是可以被JavaScript等脚本设置的。

#### Web Server 种植 Cookie 流程
1. 浏览器发起http请求到Server
    <pre>
    GET /index HTTP/1.1
    Host: worried-k.github.io
    (...这里是省去了User-Agent,Accept等字段)
2. 服务器返回HTTP Response中可以包含Cookie设置
    <pre>
    HTTP/1.1 200 OK
    Content-type: text/html
    Set-Cookie: token=1234
    Set-Cookie: test=webwebweb; Expires=Wed, 09 Jun 2019 14:18:14 GMT
    (...)
3. 后续访问worried-k.github.io的相关页面
    <pre>
    GET /spec.html HTTP/1.1
    Host: worried-k.github.io
    Cookie: token=1234; test=webwebweb
    (...)
    </pre>

#### javascript 设置 Cookie
* 设置cookie
<pre class="brush:js;">
    function setCookie(name, value, options) {
        if (value !== undefined && typeof value !== "function") {
            options = options || {};

            //过期时间（分）
            if (typeof options.expires === 'number') {
                var minute = options.expires || 120,
                    exp = options.expires = new Date();
                exp.setTime(exp.getTime() + minute * 60 * 1000);
            }

            return (document.cookie = [
                String(name), '=', window.escape(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '; path=/',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }
    }
    /**
    * ;path=path (例如 '/', '/mydir') 如果没有定义，默认为当前文档位置的路径。
    * ;domain=domain (例如 'example.com'， '.example.com' (包括所有子域名), 'subdomain.example.com') 如果没有定义，默认为当前文档位置的路径的域名部分。
    * ;expires=date-in-GMTString-format 如果没有定义，cookie会在对话结束时过期,这个值的格式参见Date.toUTCString() 
    * ;secure (cookie只通过https协议传输)
    */
</pre>
* 读取cookie
<pre class="brush:js;">
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        arr = document.cookie.match(reg);
        if (arr) {
            return window.unescape(arr[2]);
        } else {
            return null;
        }
    }
</pre>
* 删除cookie
<pre class="brush:js;">
    function delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval !== null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }
</pre>

#### 会话期Cookie
* 会话期Cookie是最简单的Cookie：**浏览器关闭之后它会被自动删除**，也就是它仅在会话期间有效。会话期Cookie不需要指定过期时间（Expires）或者有效期（Max-Age）。**需注意的是，有些浏览器提供了会话恢复的功能，这种情况下即便关闭了浏览器会话期Cookie也会被保存，就好像浏览器从来没有关闭一样**

#### 持久Cookie
* 和关闭浏览器便失效不同，持久Cookie可以指定一个特定的过期时间（Expires）或者有效期（Max-Age）

#### HttpOnly
* HTTP-only类型的Cookie不能使用Javascript通过Document.cookie属性来访问，从而能够在一定程度上阻止域脚本攻击（XSS）。当你不需要在JavaScript代码中访问你的Cookie时，可以将该Cookie设置成HttpOnly类型。**当你的Cookie仅仅是用于定义会话的情况下，最好给它设置一下HttpOnly标志**
<pre>
    HTTP/1.1 200 OK
    Content-type: text/html
    Set-Cookie: token=1234
    Set-Cookie: test=webwebweb; Expires=Wed, 09 Jun 2019 14:18:14 GMT; HttpOnly
    (...)
</pre>

#### Cookie的作用域
* Domain和Path指令定义了Cookie的作用域，即请求需要携带Cookie的URL集合。
* Domain指令规定了需要发送Cookie的主机名。如果没有指定，默认为当前的document上的主机名（但是不包含子域名）。如果指定了Domain，则一般包含子域名。 例：如果设置了Domain=mozilla.org，则Cookie包含在子域名中（如developer.mozilla.org）。
* Path指令表明需要发送Cookie的URL路径。字符%x2F (即"/")用做文件夹分隔符，子文件夹也会被匹配到。
* 如设置Path=/docs，则下面这些地址都将匹配到:
    * "/docs",
    * "/docs/Web/",
    * "/docs/Web/HTTP"

#### Cookie安全
* 只有在使用SLL和HTTPS协议向服务器发起请求时，才能确保Cookie被安全地发送到服务器。HttpOnly标志并没有给你提供额外的加密或者安全性上的能力，当整个机器暴露在不安全的环境时，**切记绝不能通过HTTP Cookie存储、传输机密或者敏感信息**
* **路径限制并不能阻止从其他路径访问cookie**， 使用简单的DOM即可轻易地绕过限制(比如创建一个指向限制路径的, 隐藏的iframe, 然后访问其 contentDocument.cookie 属性). 保护cookie不被非法访问的唯一方法是将它放在另一个域名/子域名之下, 利用同源策略保护其不被读取.

#### 注意
* Cookie的种植是以”;“分隔的，分析Cookie作用域时需追path等字段中是否含有“;”，切勿被迷惑
* 关于"client-only" 的数据不要利用Cookie存储，多余的Cookie会增加服务器的负担、浪费带宽
* 任何敏感的操作都应该被确认，cookie并不是那么可信
