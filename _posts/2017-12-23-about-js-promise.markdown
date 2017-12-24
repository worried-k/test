---
layout: post
title:  "What`s Promise"
date:   2017-12-23 15:03:00 +0800
categories: myblog
---
**ES6原生提供了对Promise对象的支持,coder们再也不会在js异步编程中迷路了(告别了,可怕的回调地狱...)**

#### 关于Javascript异步编程历史
##### 前言
1. 在线程的层次上来说，js语言的执行环境是"单线程"的(single thread）
2. 在 服务 或 程序(例：浏览器) 的层次来说，它们被允许多个进程同时工作，而每个进程下又被允许多个线程同时工作
3. 在传统的同步任务中如果有一个任务耗时很长（一条臭鱼），如果在它后面的任务与它并没有特殊的前后逻辑因果关系，但又必须都排队等它处理完毕，那么“这条臭鱼”就拖慢了整个程序的执行。这时如果把“这条臭鱼”交给其他“兄弟”帮忙处理，处理完了再通知我一声,如此大大加快了的任务的处理速度，那么...异步编程应运而生
4. ECMAScript并没有从语言上约定其异步的特性，我们所探讨的“异步”都是由执行JavaScript的引擎(例：v8)所赋予的，而实现的机制就是我们所谓的  Event Loop --- “事件轮询”，如 <a href="/myblog/2016/03/19/timers-in-javascrpt.html" target="_blank">setTimeout</a> 的实现机制

##### <a href="http://www.ruanyifeng.com/blog/2014/10/event-loop.html" target="_blank">异步执行机制</a>
1. 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）
2. 主线程之外，还存在一个"任务队列"（task queue）。只要主线程执行过程中遇到“异步任务”，就将其交给其它线程执行（执行方式同主线程）。一旦异步任务有了运行结果，就会在"任务队列"之中PUSH一个事件（callback调用）
3. 一旦"执行栈"中所有的同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。当“任务队列”不为空时，则主线程结束等待状态，“任务队列”中的任务（对应的callback函数）将依次进入执行栈，开始在主线程中执行
4. 主线程中不断重复上面的第三步

##### <a href="http://callbackhell.com/" target="_blank">回调地狱</a>
1. 当你在编写js异步代码，或者用到了带有回调函数的js代码时，你会被整篇的"function" 和 "})" 以及 它们所附带的深不见底的代码层次结构所震撼，且这种“非线性”的执行模式会增加我们理解代码的难度。整篇代码不直观易懂，从而日趋难以维护，这就是我们 喜（坑）❤️（爹）的回调地狱
2. 代码示例：
<pre class="brush:js;">
fs.readdir(source, function (err, files) {
  if (err) {
    console.log('Error finding files: ' + err)
  } else {
    console.log('开始解析了')
    // 开始解析下个文件
    // fs.readdir(source, function (err, files) {...})
    // 继续下一个...
  }
})
</pre>

##### <a href="http://es6.ruanyifeng.com/#docs/promise" target="_blank">Promise</a>来解救我们了
1. Promise 是异步编程的一种解决方案，比传统的解决方案(回调函数和事件)更合理、更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象
2. 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。并提供统一的 API，使各种异步操作都可以用同样的方法进行处理
3. 代码示例：
<pre class="brush:js;">
const readdir = function (path) {
  return new Promise(function (resolve, reject) {
    resolve(path) // 异步操作执行成功后执行此代码
    // reject() 错误时执行此代码
  })
}

readdir('1').then(function (path) {
  console.log(path, ' ok')
  return readdir('2')
}).then(function (path) {
  console.log(path, ' ok')
}).catch(function (e) {
  console.log('错误输出：', e)
})

// 输出结果：
// 1  ok
// 2  ok
// 逻辑清晰清晰了很多不是吗？
</pre>

##### Promise对象的特点
1. 对象的状态不会受到外界的影响。Promise对象代表一个异步操作，共有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果
3. 无法取消Promise，一旦新建它就会立即执行，无法中途取消
4. 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部
5. 当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）

##### Promise的常用方法概述
1. Promise.then()方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）
2. Promise.catch()方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数
3. Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例,只有s所有的状态都变成fulfilled或rejected时才会执行响应的回调函数
4. Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例，只要其中有一个Promise对象状态发生改变，那个率先改变的 Promise 实例的返回值，就传递给Promise.race()的回调函数
5. Promise.resolve() 有时需要将现有对象转为 Promise 对象。如果参数是一个原始值或无参数，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。如果参数是个对象，方法会将这个对象转为 Promise 对象，然后就立即执行这个对象的then方法，状态为resolved。注意：回调函数会在本轮“事件循环”结束时执行
6. Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected，并原封不动地将reject的理由，变成后续方法的参数
7. Promise.done() 总是处于回调链的尾端，保证抛出任何可能出现的错误
8. Promise.finally()不管 Promise 对象最后状态如何，都会执行的操作.并接受一个普通的回调函数作为参数

##### 支持情况

* Node.js added native promise in stable version 0.12

| 浏览器 | Chrome | Edge | Firefox | 	Internet Explorer | Opera | Safari |
| ------| ------ | ------ | ------ | ------ | ------ | ------ |
| 支持情况 | 32 | Yes | 29 | No | 19 | 8 |