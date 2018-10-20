---
layout: post
title:  "关于javascript中的那些Timers"
date:   2016-03-19 14:51:27 +0800
categories: myblog
---

**setTimeout()和setInterval()可以用来注册在指定的时间之后单次或重复调用的函数。**

### setTimeout()和setInterval()相同点
1. 都是客户端JavaScript中的全局对象Window对象下的方法。
2. 它们在执行后都会返回一个值，这个值用于给clearTimout()等方法来取消回调函数的执行。
3. 由于历史原因，它们的第一个参数都可以作为字符串传入。
4. 第二个参数的单位都为 毫秒。

### setTimeout()和setInterval()的特点
* 如果以0毫秒的超时来调用setTimeout(),那么指定的函数不会立刻执行。相反，会把它放到队列中（Event Loop），等到前面处于等待状态的事件处理程序全部执行完后，再“立刻”去调用它。
(来自 JavaScript权威指南)
* JavaScript属于“单线程”的“事件驱动”机制！我可以认为js有一个 事件回调函数 的执行队列，当加载完js并完成解析后，
此前解析过中发生的事件的“回调函数”已经按照原事件触发的时间为顺序形成了一个执行队列！当js完成解析后，浏览器会去查看 js的事件执行队列，并将按照事件队列的顺序挨个执行！
* 如果js线程在解析过程中遇到setTimeout函数，则会将所需要等待的时间和回调函数提交给浏览器，当时钟到达所需要等待的时间时，
浏览器会将“setTimeout的回调函数执行事件”添加到事件队列中，等待js线程去处理！所以setTimeout(function() {}, 0);并不是立即执行！
它执行开始的时间取决于js还没有解析的那部分代码的执行时间和它所处的事件队列的顺序。
* 回调函数开始执行的时间 = js解析完成setTimeout或setInterval的时间 + 剩余js代码的执行时间 + 排在其回调函数执行事件前代码执行需要的时间！
* setInterval在解析完成后，每当时钟达到所需要等待的时间时，浏览器就会向“js回调事件执行队列中”添加一条信息！
在添加“setInterval回调执行事件时”，如果之前添加的“setInterval回调执行事件“还没有被执行，则不再向队列中添加此事件！将直接跳过，等待下个时钟！！！
如果，利用setInterval的回调做 数秒计时 的话，可能结果会有所偏差！所以计时累的操作会里有 系统时间 + timer 去做！！！
* javascript事件处理图例： ![javascript事件处理图例]({{ site.baseurl }}/images/assets/Timers.png)

* 详情请参照：http://ejohn.org/blog/how-javascript-timers-work/#postcomment