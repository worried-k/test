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
function demo(arg) {
    console.log(this.num, arg);
}
var o = {};
o.num = 2;
o.demo = demo;

// 用法1： 改变this指向
o.demo.apply();//1, apply()的参数为空时，默认调用全局对象
o.demo.apply(o, ['demo']);//2 ,apply传入 参数数组
o.demo.call(o, 'demo');//2 ， call传入 参数列表

// 用法2： 借用别的对象到方法
var Person1  = function () {
    this.name = 'demo';
}
var Person2 = function () {
    this.getname = function () {
        console.log(this.name);
    }
    Person1.call(this); // 借用Person1的属性和方法，来实现继承
}
var person = new Person2();
person.getname();       // demo

</pre>

### 6.如果this在HTML的标签中被当做事件绑定回调函数的参数传入 ，此时this指向触发事件的对象 [object HTMLElement]

### 7.ES5中的bind来为函数绑定this
<pre class="brush:js;">
var obj = {
    name: 'this demo'
}

function demo() {
    console.log(this.name);
}


var demo1 = demo.bind(obj); // 不立即执行demo，而返回一个以obj为this的新函数demo1
demo1(); // this demo

// 手写一个类bind函数的实现
function test (b) {
  console.log(this.a , b)
}

test.bind = function() {
  var testOld = this // 作为方法使用，此时this指向test函数
  var newThis = [].shift.call(arguments) // 借用数组的方法，获取第一个参数
  return function () {
    var args = [].slice.call(arguments) // 借用数组的方法，将arguments转换为数组
    testOld.apply(newThis, args)
  }
}

var test1 = test.bind({
  a: 'this a'
})

test1('no, this b') // this a no, this b
</pre>

### 8.ES6中的 箭头函数 ，默认绑定了执行环境的this，实现this继承
<pre class="brush:js;">
const obj = {
    a: function() {
        console.log(this) // 常规写法
    },
    b: () => {
        console.log(this) // 按箭头函数定义的方法
    },
    c: function() {
        let test = () => {
            console.log(this)
        }
        test() // 可以理解为：执行方式同下面的方法d,默认绑定了this
    },
    d: function() {
        let test = function () {
            console.log(this)
        }
        test.call(this)
    }
}
obj.a()  // obj
obj.b()  // window
obj.c()  // obj
obj.d()  // obj

// 特性：不能用call方法修改里面的this
obj.b.call('abc') // window
</pre>