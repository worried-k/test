---
layout: post
title:  "关于javascript中this的那些事"
date:   2016-03-18 14:51:27 +0800
categories: myblog
---

**this是Javascript语言中的一个关键字!（不是变量，也不是属性）**它是面向对象编程范例的核心之一。this没有作用域的限制，嵌套函数不会从调用它的函数中继承到this!

## this运用的6种场景：

### 1.如果this所位于的函数被作为方法调用，此时this的值指向调用这个函数的对象
<pre class="brush:js;">
var demo = {
    speak: "my name is demo!",
    test: function() {
        console.log(this.speak);
    }
};
demo.test();//my name is demo!
</pre>

### 2.如果this所位于的嵌套函数中被作为函数调用，在非严格模式下，此时this指向全局对象！（运行于浏览器时，指向Windows）
<pre class="brush:js;">
var demo = {
    test: function() {
        function inner_test() {
            console.log(this);
        }
        inner_test();
    }
};
demo.test();//windows
</pre>

### 3.如果this所位于的嵌套函数中被作为函数调用，在严格模式下，此时this指向undefined
<pre class="brush:js;">
"use strict";
var demo = {
    test: function() {
        function inner_test() {
            console.log(this);
        }
        inner_test();
    }
};
demo.test();//undefined
</pre>

### 4.如果this所位于的嵌套函数中被作为构造函数调用，此时this指向这个新生成的对象
<pre class="brush:js;">
var goble_num = 1;
function demo() {
    this.goble_num = 2;
}
demo();
console.log(goble_num);//2,此时this指向全局对象
goble_num = 1;//恢复全局变量goble_num
var d = new demo();
console.log(d.goble_num);//2
console.log(goble_num);//1
</pre>

### 5.如果this所位于的嵌套函数调用了apply或call函数，此时this指向apply或call函数的第一个参数
<pre class="brush:js;">
var num = 1;
function demo() {
    console.log(this.num);
}
var o = {};
o.num = 2;
o.demo = demo;
o.demo.apply();//1,apply()的参数为空时，默认调用全局对象
o.demo.apply(o);//2
</pre>

### 6.如果this在HTML的标签中被当做事件绑定回调函数的参数传入 ，此时this指向触发事件的对象,如：[object HTMLInputElement]
