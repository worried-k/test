---
layout: post
title:  "关于JavaScript的同源策略"
date:   2016-03-26 18:52:00 +0800
categories: myblog
---
**同源策略，它是由Netscape提出的一个著名的安全策略，现在所有的可支持javascript的主流浏览器都会使用这个策略（注意关键字：“浏览器” 使用的 “安全策略”）**


#### 同源
* 同domain（或ip）,同端口，同协议视为同一个域，一个域内的脚本仅仅具有本域内的权限，可以理解为本域脚本只能读写本域内的资源，而无法访问到其它域的资源。

#### 源继承
* 来自about:blank，javascript:和data:URLs中的内容，继承了将其载入的文档所指定的源，因为它们的URL本身未指定任何关于自身源的信息。
（一些恶趣味的攻击脚本就是利用了源继承，如：在 浏览器导航栏输入：javascript:while(true){alert("你上当了！");} 还可以操作你的当前页面呦^_^）

#### 跨域脚本API访问
* Javascript的APIs中，如 iframe.contentWindow, window.parent, window.open 和 window.opener 允许文档间直接相互引用。
* 当两个文档的源不同时，这些引用方式将对 Window 和 Location对象的访问添加限制。
* 可以使用window.postMessage() 作为替代方案，提供跨域文档间的通讯。除了IE6、IE7之外的所有浏览器都支持这个功能。

#### 跨域数据存储访问
* 存储在浏览器中的数据，如localStorage和IndexedDB，以源进行分割。每个源都拥有自己单独的存储空间，一个源中的Javascript脚本不能对属于其它源的数据进行读写操作。
* window.name属性可以用来临时存储数据，可以跨域访问。
* Cookies使用不同的源定义方式。一个页面可以为本域和任何父域设置cookie，只要是父域不是公共后缀（public suffix）即可。
* Firefox和Chrome使用Public Suffix List决 定一个域是否是一个公共后缀（public suffix）。不管使用哪个协议（HTTP/HTTPS）或端口号，浏览器都允许给定的域以及其任何子域名(sub-domains)来访问 cookie。
* 设置cookie时，你可以使用Domain，Path，Secure，和Http-Only标记来限定其访问性。读取cookie时，不会知晓它的出处。尽管使用安全的https连接，任何可见的cookie都是使用不安全的连接设置的。

#### 跨域网络访问,同源策略控制了不同源之间的交互，例如在使用XMLHttpRequest 或 标签时则会受到同源策略的约束。交互通常分为三类：
1. “通常允许”进行跨域“写”操作（Cross-origin writes）。例如链接（links），重定向以及表单提交。特定少数的HTTP请求需要添加 preflight。
2. “通常允许“跨域资源“嵌入”（Cross-origin embedding）。之后下面会举例说明。
3. “通常不允许”跨域“读”操作（Cross-origin reads）。但常可以通过内嵌资源来巧妙的进行读取访问，也可以通过在服务端向HTTP Header 添加Access-Control-Allow-Origin：hosts或*
来使此资源可以被读取（FireFox 3.6+, Safari 4+, Chrome 4+, Edge, and IE 10+ 均支持此特性）也叫作 跨域资源共享（CORS ）。（所以在我们使用XMLHttpRequest跨域操作时，
浏览器是可以发出请求并获得到response的，只是限制了我们使用那些其他域的资源）
 <a href="http://caniuse.com/#feat=cors" target="_blank">![CORS浏览器支持情况]({{ site.baseurl }}/images/assets/cors.png)</a>


#### 以下是一些可以跨域内嵌的资源示例：
1. 标签嵌入跨域脚本。语法错误信息只能在同源脚本中捕捉到。
2. 标签嵌入CSS。由于CSS的松散的语法规则，CSS的跨域需要一个设置正确的Content-Type消息头。不同浏览器有不同的限制： IE, Firefox,Chrome, Safari (跳至CVE-2010-0051)部分 和 Opera。
3. 嵌入图片。支持的图片格式包括PNG,JPEG,GIF,BMP,SVG,...
4. 嵌入多媒体资源
5. iframe

#### 由于 “跨域” 是 “同源策略” 的衍生产物，初期各大浏览器的表现也不尽相同，也存在着 各种千奇百怪的 解决方案，上面是我所了解到的常用解决方案！如有问题请帮忙指正！

