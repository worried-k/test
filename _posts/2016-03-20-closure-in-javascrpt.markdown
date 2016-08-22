---
layout: post
title:  "关于javascript中的闭包"
date:   2016-03-20 12:15:00 +0800
categories: myblog
---
**函数对象可以通过作用域链相互关联起来，函数体内部的变量都可以保存在函数作用域内，这种特性在计算机科学文献中称之为“闭包”**

### 要了解闭包，首先要了解“词法作用域”与“作用域链”：

#### JavaScript使用的是函数作用域，而非块级作用域。（区别请自行google）

#### 每一段JavaScript代码（全局代码或函数）都有一个与之相关联的作用域链（scope chain）。这个作用域链是一个对象列表或者链表，这组对象定义了这段代码“作用域中”的变量。
<pre class="brush:js;">
var goble_num = 1;
function demo() {
     var local_num = 0;
     var a = 1;
     function add() {
          var b = 1;
          var c = 1;
         local_num = goble_num + c;
          return local_num ; 
     }
     return add;
}
var tools_add = demo();//返回add函数
var new_num = tools_add();//返回一个新的数
console.log(local_num);//undefined，函数作用域
</pre>
#### 内部函数add的作用域链（在解析时就决定了这个作用域链）为：
1. —add函数的私有变量对象(包含变量b和c)
2. ——demo函数的私有变量对象(包含变量a和local_num和函数add)
3. ———goble scope

#### 变量解析：
1. 当JavaScript执行到tools_add函数中的<code>local_num = goble_num + c;</code>时需要从add函数的作用域链上查找变量c、goble_num和local_num。
2. 它会从链表中的第一个对象（tools_add函数的私有变量对象）开始查找，它找到了变量c，但并没有找到goble_num和local_num。
3. 此时JavaScript会继续查找链上的下一个对象（demo函数的私有变量对象），它找到了变量local_num，但还是没有找到goble_num。
4. 此时JavaScript则会继续查找链上的下一个对象，以此类推。
5. 如果作用域链上没有任何一个对象含有属性goble_num,JavaScript就会认为这段代码的作用域链上不存在goble_num,并抛出引用错误（ReferenceError）异常。
6. 如果找到了goble_num则终止查找。


#### 闭包的特性“变量常驻内存”：

* 每次调用JavaScript函数的时候，都会为之创建一个新的对象用来来保存局部变量，把这个对象添加至作用域链中。
* 当函数返回的时候，就从作用域链中将这个绑定对象的变量删除。如果不存在嵌套函数，也没有其他引用指向这个变量绑定对象，它就会被当做垃圾回收掉。
（因为demo函数含有嵌套函数add，“demo函数的私有变量对象”就不会被当做垃圾回收）
* 如果定义了嵌套的函数，每个嵌套的函数都各自对应一条作用域链，并且这个作用域链都会指向一个共同的变量绑定对象。
(同时存在多个类add的函数，它们的作用域链都同时指向了“demo函数的私有变量对象”)
* 但如果这些嵌套的函数对象在外部函数中被保存了下来，那么它们也会和所指向的变量绑定对象一样当做垃圾回收。
（当执行到<code>var tools_add = demo();</code>时，嵌套函数add的变量绑定对象会被当做垃圾回收）
* 但如果这个嵌套函数被作为返回值返回或者储存在某处的属性里，这时就会有一个外部引用指向这个嵌套的函数。它就不会被当做垃圾回收，并且他所指向的变量绑定对象也不会被当做垃圾回收
<pre class="brush:js;">
function test1() {
    return demo();
}
//或
function test2() {
    this.add = demo();
    //...
}
//如果存在以上2种函数，则上面函数中的"add函数的私有变量对象"则不会被当做垃圾回收

//===分割线===

var tools_add = demo();
//demo函数的私有变量绑定对象,还能被引用的到！
var new_num = tools_add();
//demo函数的私有变量绑定对象,还能被引用的到！
new_num = tools_add();
//...
new_num = tools_add();
//所以它在此以前不会被垃圾回收机制回收，也就是所谓的“常驻内存”了
</pre>

#### 关于继承与作用域链 的外链 (proto两头各两条下划线！)：
* <a href="https://msdn.microsoft.com/en-us/magazine/ff852808" target="_blank">Prototypes and Inheritance in JavaScript</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object" target="_blank">Object</a>
* <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain" target="_blank">继承与原型链（中文的个人博客）</a>