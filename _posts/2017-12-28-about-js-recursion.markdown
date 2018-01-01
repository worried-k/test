---
layout: post
title:  "有趣的递归"
date:   2017-12-30 11:29:00 +0800
categories: myblog
---
**本文起源于一个为什么？而在尝试解释它的过程中，了解到了很多在日常使用过程中刻意淡化的很多问题的答案。本文加入了很多自身的理解，并不十分严谨，请从优汲取**

> 备注：本文的语言场景为JavaScript

### 名词解析
##### [递归](https://zh.wikipedia.org/wiki/%E9%80%92%E5%BD%92)
  英文称“Recursion”，又译为“递回”，指在函数的定义中使用函数自身的过程

##### [函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions)
  一般来说，一个函数是可以通过在其之外的代码调用的一个“子程序”（或在递归的情况下由内部函数调用）。像程序本身一样，一个函数由称为函数体的一系列语句组成（也称为，可复用的代码执行块）。值可以传递给一个函数，函数必将返回一个值，在没有使用return语句的情况下，它的默认返回值为undefined

##### [JavaScript为解释型语言](https://zh.wikipedia.org/wiki/%E7%9B%B4%E8%AD%AF%E8%AA%9E%E8%A8%80)
  这种类型的编程语言，会将代码一句一句直接运行。不需要像编译语言（Compiled language）一样（如：java），经过编译器先行全部编译为机器码，之后再运行  
  这种编程语言需要利用解释器（如：js引擎v8,也称JavaScript虚拟机），在运行期，动态将代码逐句解释（interpret）为机器码，或是已经预先编译为机器码的的子程序，之后再运行。每个引擎都有自己独特的优化特性，以便更好的处理js动态脚本，使其更快的执行。

##### [调用栈](https://zh.wikipedia.org/wiki/%E5%91%BC%E5%8F%AB%E5%A0%86%E7%96%8A)
  英文称“Call stack”，港台称“呼叫堆叠”，英文直接简称为“栈”（the stack））别称有：执行栈（execution stack）、控制栈（control stack）、运行时栈（run-time stack）与机器栈（machine stack），是计算机科学中存储有关正在运行的子程序的消息的栈。有时仅称“栈”，但栈中不一定仅存储子程序消息。几乎所有计算机程序都依赖于调用栈，然而高级语言一般将调用栈的细节隐藏至后台

##### [Stack的三种含义（抽象的定义）](http://www.ruanyifeng.com/blog/2013/11/stack.html)
  1. 数据结构: 一组数据的存放方式，特点为LIFO，即后进先出（Last in, first out）
  2. 代码运行方式(调用栈)：表示函数或子例程像堆积木一样存放，以实现层层调用
  3. 内存区域：程序运行的时候，需要内存空间存放数据。一般来说，系统会划分出两种不同的内存空间：一种叫做stack（栈），另一种叫做heap（堆）
      * stack是有结构的，每个区块按照一定次序存放，可以明确知道每个区块的大小；heap是没有结构的，数据可以任意存放。因此，stack的寻址速度要快于heap
      * 一般来说，每个线程分配一个stack，每个进程分配一个heap，也就是说，stack是线程独占的，heap是线程共用的。此外，stack创建的时候，大小是确定的，数据超过这个大小，就发生stack overflow错误，而heap的大小是不确定的，需要的话可以不断增加

##### [单线程模型](http://javascript.ruanyifeng.com/advanced/single-thread.html)
  JavaScript引擎拥有有多个线程，但脚本（也称代码列表）只能在一个线程上运行（即主线程），其他线程都是在后台配合。(H5提出的Web Worker衍生的子进程也可以执行脚本，但完全受主线程控制)

##### [JavaScript解析器中的调用栈](https://developer.mozilla.org/zh-CN/docs/Glossary/Call_stack)
  * 由于JavaScript是解释型语言，代码列表会被JS引擎优化处理后，并依书写的线性顺序逐句执行
  * 代码列表在逐句执行时，当执行到**函数调用**时，解析器则把该函数和参数添加到栈中并且执行这个函数（依然是阻塞式逐句执行）
  * 任何被这个函数调用的函数都会进一步的添加到调用栈中，形成若干个栈帧(frame）
  * 栈帧存在的意义：当调用函数时逻辑栈帧被压入栈顶, 当函数返回时逻辑栈帧被从栈顶弹出(逻辑栈帧存放着函数参数，局部变量及恢复前一栈帧脚本执行所需要的数据等)
  * 伴随着内部函数的执行完毕，调用栈中的栈帧被逐个弹出，调用栈为空时，函数执行完毕
  * 当函数运行结束后，解释器将返回地址从栈中取出，并继续执行在主代码列表中其后面的代码
  * 如果栈占用的空间比分配给它的空间还大，那么则会导致“堆栈溢出”错误

### 递归过程分析
<pre class="brush:js;">
// 计算累加的递归函数
function recsum(num) {
    return num > 1 ? num + recsum(num - 1) : num
}

var sum = recsum(5)
console.log(sum)  // 15
</pre>

##### 过程解读
1. 当代码执行到recsum(5)时，js解析器发现recsum是一个已定义的函数，则把recsum(5)添加到调用栈中并执行
2. 在函数体语句的执行过程中，又进一步的调用了另一个函数（自身函数），则把这个函数（以及**恢复当前脚本执行**所需要的一切信息）放到原栈的顶部形成新的一帧，并开始执行新函数，执行完新函数后如果存在上-帧，则恢复上一帧里函数的执行
3. ...重复上面的第2步，直到num的值为1后，调用栈的长度才随着语句的执行慢慢变短，直到为空
4. 当调用栈为空后，recsum调用所得到的值会赋给变量sum
5. 主代码列表继续执行，控制台输出15

##### 栈的长度变化及分析过程
<pre class="brush:js;">
===> recsum(5)
===> 5 + recsum(4)
===> 5 + (4 + recsum(3))
===> 5 + (4 + (3 + recsum(2)))
===> 5 + (4 + (3 + (2 + recsum(1))))
===> 5 + (4 + (3 + (2 + 1)))
===> 5 + (4 + (3 + 3))
===> 5 + (4 + 6)
===> 5 + 10
===> 15
</pre>

### 递归的另类解读
##### 为了便于理解，我将递归这样理解(类等同调用栈的过程)
1. 程序编写就是一个 由繁入简的一个过程，而程序执行由简入繁 的一个推理过程
2. 以递归的方式去编写累加的程序的时候，其实就是一个由繁入简的一个体现，同样也可以将其反推理成一个繁琐的执行过程
3. 将上面的递归可以理解成，解释器会将递归函数解释成这样的方式，而后去执行
<pre class="brush:js;">
// var sum = recsum(5) 会被解释成下面的代码
var recsum_1 = 1 > 1 ? recsum(1) : 1// 1的累加 = 1
var recsum_2 = 2 + recsum_1         // 2的累加 = 2 + 1的累加
var recsum_3 = 3 + recsum_2         // 3的累加 = 3 + 2的累加
var recsum_4 = 4 + recsum_3         // 4的累加 = 4 + 3的累加
var recsum_5 = 5 + recsum_4         // 5的累加 = 5 + 4的累加

var sum = recsum_5
</pre>
**注意：return 关键字，仅会使函数完成执行，并完成结果的赋值**
##### 去掉return关键字的执行过程(类等同调用栈的过程)
<pre class="brush:js;">
// var sum = recsum(5) 会被解释成下面的代码
1 > 1 ? recsum(1) : 1
var recsum_1 = undefined

2 + recsum_1
var recsum_2 = undefined

3 + recsum_2
var recsum_3 = undefined

4 + recsum_3
var recsum_4 = undefined

5 + recsum_4
var recsum_5 = undefined

var sum = recsum_5
</pre>

**建议：从头到尾 通篇阅读，便于理解，如发现问题欢迎指正 ^_^**
