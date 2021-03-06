---
layout: post
title:  "HTTP相关整理笔记"
date:   2016-04-23 18:10:00 +0800
categories: myblog
---
**超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是互联网上应用最为广泛的一种网络协议，本文作为常用知识的笔记**

#### <a href="https://github.com/for-GET/http-decision-diagram" target="_blank">GitHub相关文章：http-decision-diagram</a> 

#### HTTP报文简介

##### HTTP报文是简单的格式化数据块，每条报文都包含一条来自客户端的请求或服务端的响应，它由3部分组成：
1. 对报文进行描述的起始行（start line）：：HTTP/1.1 200 OK
2. 包含属性的首部（header）块 ：：Conten-type: text/html 和 Content-length: 20等 
3. 可选的、包含数据主体的（body）部分 ：： hello world!

##### HTTP报文可以分为两类：
1. 请求报文（request message）
2. 响应报文（response message）

##### 介绍下HTTP报文的几个部分：
* 方法（method）: 客户端希望服务器对资源执行的动作。比如GET 或 POST
* 请求URL(request-URL)：请求资源的路径（获取此篇文章 URL，就对应着github下的一个静态资源的路径）
* 版本（version）: HTTP 协议的版本号，目前比较常用并已用很多年的 HTTP 1.1 还有其首个更新版本 HTTp 2.0
* 状态码（status-code)：用3位数字描述请求过程中所发生的情况。常见的有 200、302、404、500
* 首部（header）：可以有0个或多个首部，每个首部都包含一个名字，后面跟着一个冒号（:）,然后是一个可选的空格，接着是一个值，最后是一个CRLF(回车换行)
* 实体的主体部分（entity-body）： 任意数据组成的数据块

#### 常用的HTTP方法
<div class="table-wrapper">
    <table class="alt">
        <thead>
            <tr>
                <th>Method</th>
                <th>Description</th>
                <th>Body</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>GET</td>
                <td>从服务器获取一份文档</td>
                <td>不包含</td>
            </tr>
            <tr>
                <td>POST</td>
                <td>向服务器发送需要处理的数据</td>
                <td>包含</td>
            </tr>
            <tr>
                <td>HEAD</td>
                <td>只从服务器获取文档的首部</td>
                <td>不包含</td>
            </tr>
            <tr>
                <td>PUT</td>
                <td>将请求的主体部分存储在服务器上</td>
                <td>包含</td>
            </tr>
            <tr>
                <td>TRACE</td>
                <td>对可能经过代理服务器传送到服务器上去的报文进行追踪</td>
                <td>不包含</td>
            </tr>
            <tr>
                <td>OPTIONS</td>
                <td>决定可以在服务器上执行哪些方法</td>
                <td>不包含</td>
            </tr>
            <tr>
                <td>DELETE</td>
                <td>从服务器上删除一份文档</td>
                <td>不包含</td>
            </tr>
        </tbody>
    </table>
</div>

#### 状态码分类
<div class="table-wrapper">
    <table class="alt">
        <thead>
            <tr>
                <th>整体范围</th>
                <th>已定义范围</th>
                <th>分类</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>100 ~ 199</td>
                <td>100 ~ 101</td>
                <td>信息提示</td>
            </tr>
            <tr>
                <td>200 ~ 299</td>
                <td>200 ~ 206</td>
                <td>成功</td>
            </tr>
            <tr>
                <td>300 ~ 399</td>
                <td>300 ~ 305</td>
                <td>重定向</td>
            </tr>
            <tr>
                <td>400 ~ 499</td>
                <td>400 ~ 415</td>
                <td>客户端错误</td>
            </tr>
            <tr>
                <td>500 ~ 599</td>
                <td>500 ~ 505</td>
                <td>服务器错误</td>
            </tr>
        </tbody>
    </table>
</div>

#### HTTP状态码速查（<a href="https://zh.wikipedia.org/wiki/HTTP%E7%8A%B6%E6%80%81%E7%A0%81" target="_blanks">维基百科</a>）

##### 1xx消息 (这一类型的状态码，代表请求已被接受，需要继续处理。这些状态码代表的响应都是信息性的，标示客户应该采取的其他行动。)
* 100 Continue
    客户端应当继续发送请求。这个临时响应是用来通知客户端它的部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应。服务器必须在请求完成后向客户端发送一个最终响应。
* 101 Switching Protocols
    服务器已经理解了客户端的请求，并将通过Upgrade消息头通知客户端采用不同的协议来完成这个请求。
* 102 Processing
    由WebDAV（RFC 2518）扩展的状态码，代表处理将被继续执行。
    
##### 2xx成功 （这一类型的状态码，代表请求已成功被服务器接收、理解、并接受。）
* 200 OK
    请求已成功，请求所希望的响应头或数据体将随此响应返回。
* 201 Created
    请求已经被实现，而且有一个新的资源已经依据请求的需要而创建，且其URI已经随Location头信息返回。
* 202 Accepted
    服务器已接受请求，但尚未处理。
* 203 Non-Authoritative Information
    服务器已成功处理了请求，但返回的实体头部元信息不是在原始服务器上有效的确定集合，而是来自本地或者第三方的拷贝。
* 204 No Content
    服务器成功处理了请求，但不需要返回任何实体内容，并且希望返回更新了的元信息。
* 205 Reset Content
    服务器成功处理了请求，且没有返回任何内容。但是与204响应不同，返回此状态码的响应要求请求者重置文档视图。
* 206 Partial Content
    服务器已经成功处理了部分GET请求。
* 207 Multi-Status
    由WebDAV(RFC 2518)扩展的状态码，代表之后的消息体将是一个XML消息，并且可能依照之前子请求数量的不同，包含一系列独立的响应代码。
    
##### 3xx重定向 （这类状态码代表需要客户端采取进一步的操作才能完成请求。）
* 300 Multiple Choices
    被请求的资源有一系列可供选择的回馈信息，每个都有自己特定的地址和浏览器驱动的商议信息。用户或浏览器能够自行选择一个首选的地址进行重定向。注意：对于某些使用HTTP/1.0协议的浏览器，当它们发送的POST请求得到了一个301响应的话，接下来的重定向请求将会变成GET方式。
* 302 Found
    请求的资源现在临时从不同的URI响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。
    注意：虽然RFC 1945和RFC 2068规范不允许客户端在重定向时改变请求的方法，但是很多现存的浏览器将302响应视作为303响应，并且使用GET方式访问在Location中规定的URI，而无视原先请求的方法。状态码303和307被添加了进来，用以明确服务器期待客户端进行何种反应。
* 303 See Other
    对应当前请求的响应可以在另一个URI上被找到，而且客户端应当采用GET的方式访问那个资源。
    注意：许多HTTP/1.1版以前的浏览器不能正确理解303状态。如果需要考虑与这些浏览器之间的互动，302状态码应该可以胜任，因为大多数的浏览器处理302响应时的方式恰恰就是上述规范要求客户端处理303响应时应当做的。
* 304 Not Modified
    如果客户端发送了一个带条件的GET请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码。
* 305 Use Proxy
    被请求的资源必须通过指定的代理才能被访问。只有原始服务器才能创建305响应。
    注意：RFC 2068中没有明确305响应是为了重定向一个单独的请求，而且只能被原始服务器建立。忽视这些限制可能导致严重的安全后果。
* 306 Switch Proxy
    在最新版的规范中，306状态码已经不再被使用。
* 307 Temporary Redirect
    请求的资源现在临时从不同的URI响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。
    
##### 4xx客户端错误 （这类的状态码代表了客户端看起来可能发生了错误，妨碍了服务器的处理。这些状态码适用于任何请求方法。浏览器应当向用户显示任何包含在此类错误响应中的实体内容。）
* 400 Bad Request
    由于包含语法错误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求。
* 401 Unauthorized
    当前请求需要用户验证。
* 402 Payment Required
    该状态码是为了将来可能的需求而预留的。
* 403 Forbidden
    服务器已经理解请求，但是拒绝执行它。与401响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。
* 404 Not Found
    请求失败，请求所希望得到的资源未被在服务器上发现。
* 405 Method Not Allowed
    请求行中指定的请求方法不能被用于请求相应的资源。
* 406 Not Acceptable
    请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体。
* 407 Proxy Authentication Required
    与401响应类似，只不过客户端必须在代理服务器上进行身份验证。
* 408 Request Timeout
    请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
* 409 Conflict
    由于和被请求的资源的当前状态之间存在冲突，请求无法完成。
* 410 Gone
    被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。这样的状况应当被认为是永久性的。
* 411 Length Required
    服务器拒绝在没有定义Content-Length头的情况下接受请求。
* 412 Precondition Failed
    服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个。
* 413 Request Entity Too Large
    服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。
* 414 Request-URI Too Long
    请求的URI长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。
* 415 Unsupported Media Type
    对于当前请求的方法和所请求的资源，请求中提交的实体并不是服务器中所支持的格式，因此请求被拒绝。
* 416 Requested Range Not Satisfiable
    如果请求中包含了Range请求头，并且Range中指定的任何数据范围都与当前资源的可用范围不重合，同时请求中又没有定义If-Range请求头，那么服务器就应当返回416状态码。
* 417 Expectation Failed
    在请求头Expect中指定的预期内容无法被服务器满足，或者这个服务器是一个代理服务器，它有明显的证据证明在当前路由的下一个节点上，Expect的内容无法被满足。
* 418 I'm a teapot
    本操作码是在1998年作为IETF的传统愚人节笑话, 在RFC 2324 超文本咖啡壶控制协议中定义的，并不需要在真实的HTTP服务器中定义。
* 421 There are too many connections from your internet address
    从当前客户端所在的IP地址到服务器的连接数超过了服务器许可的最大范围。
* 422 Unprocessable Entity
    请求格式正确，但是由于含有语义错误，无法响应。
* 423 Locked
    当前资源被锁定。
* 424 Failed Dependency
    由于之前的某个请求发生的错误，导致当前请求失败，例如PROPPATCH。
* 425 Unordered Collection
    在WebDav Advanced Collections草案中定义，但是未出现在《WebDAV顺序集协议》中。
* 426 Upgrade Required
    客户端应当切换到TLS/1.0。
* 449 Retry With
    由微软扩展，代表请求应当在执行完适当的操作后进行重试。
* 451 Unavailable For Legal Reasons
    由IETF核准，代表该访问因法律的要求而被拒绝。
    
##### 5xx服务器错误 （这类状态码代表了服务器在处理请求的过程中有错误或者异常状态发生，也有可能是服务器意识到以当前的软硬件资源无法完成对请求的处理。）
* 500 Internal Server Error
    服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理。一般来说，这个问题都会在服务器的程序码出错时出现。
* 501 Not Implemented
    服务器不支持当前请求所需要的某个功能。当服务器无法识别请求的方法，并且无法支持其对任何资源的请求。
* 502 Bad Gateway
    作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应。
* 503 Service Unavailable
    由于临时的服务器维护或者过载，服务器当前无法处理请求。
* 504 Gateway Timeout
    作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器（URI标识出的服务器，例如HTTP、FTP、LDAP）或者辅助服务器（例如DNS）收到响应。
    注意：某些代理服务器在DNS查询超时时会返回400或者500错误。
* 505 HTTP Version Not Supported
    服务器不支持，或者拒绝支持在请求中使用的HTTP版本。
* 506 Variant Also Negotiates
    由《透明内容协商协议》（RFC 2295）扩展，代表服务器存在内部配置错误：被请求的协商变元资源被配置为在透明内容协商中使用自己，因此在一个协商处理中不是一个合适的重点。
* 507 Insufficient Storage
    服务器无法存储完成请求所必须的内容。这个状况被认为是临时的。
* 509 Bandwidth Limit Exceeded
    服务器达到带宽限制。这不是一个官方的状态码，但是仍被广泛使用。
* 510 Not Extended
    获取资源所需要的策略并没有被满足。

#### HTTP首部

##### Content-Type
* 实体首部
* <a href="http://tool.oschina.net/commons" target="_blank">常用对照表</a>

##### Cache-Control
* 通用缓存首部
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=zh-cn" target="_blank">Google developer articles</a>
* <a href="http://blog.55minutes.com/2011/10/how-to-defeat-the-browser-back-button-cache/" target="_blank">How to Defeat the Browser Back Button Cache</a> 

##### Cookie
* 安全请求首部
* <a href="https://curl.haxx.se/rfc/cookie_spec.html" target="_blank">关于服务端设置cookie的文章</a> 
* js获取方式：document.cookie

##### Referer
* 请求首部
* 包含当前请求URI文档的URL
* 把引用地址纪录起来以便追踪用户的动态，可能会丢失
* Referer的正确英语拼法是referrer。由于早期HTTP规范的拼写错误，为了保持向下兼容就将错就错了。其它网络技术的规范企图修正此问题，使用正确拼法，所以目前拼法不统一

##### User-Agent
* 请求首部
* 代表用户行为的软件（软件代理程序）所提供的对自己的一个标识符---详情：<a href="https://zh.wikipedia.org/wiki/%E7%94%A8%E6%88%B7%E4%BB%A3%E7%90%86" target="_blank">维基百科</a>
* <a href="https://github.com/fex-team/userAgent" target="_blank">用于解析UA来得到用户终端信息的JS库</a>
* js获取浏览器UA的方式：window.navigator.userAgent

##### Date
* 通用信息性首部
* 表示消息发送的时间，缓存在评估响应的新鲜度时要用到，时间的描述格式由RFC822定义
* js获取方式："XMLHttpRequest".getResponseHeader('Date')

##### X-Requested-With
* 标识此Request来自Ajax请求

##### Access-Control-Allow-Origin
* 跨域资源共享(Cross-Origin Resource Sharing)时,服务器端需要返回的资源需要有一个 Access-Control-Allow-Origin 头信息
* Access-Control-Allow-Origin: 参数指定一个允许向该服务器提交请求的URI.对于一个不带有credentials的请求,可以指定为'*',表示允许来自所有域的请求.

##### Content-Security-Policy
* 内容安全策略 即 CSP，用来通知客户端 哪些规则的外部资源可以加载、执行
* 启用后不符合CSP的外部资源会被阻止加载，并在控制台报错 

##### <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta" target="_blank">关于响应头信息在HTML中的实现</a>
* meta 标签的 http-equiv 属性

##### 关于js可以干预的HTTP请求首部
* 通过XMLHttpRequest.setRequestHeader()  这个Web API 接口，js可以设置的HTTP请求首部。
* 谷歌浏览器是支持setRequestHeader的修改的，但是大多数的标准首部是无法修改的，Content-type例外。
* 也可以构造任意一个非标准的字段（注意大小写），通常自定义的字段都建议X-开头。