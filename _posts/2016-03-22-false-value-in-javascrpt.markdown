---
layout: post
title:  "关于javascript中的假值"
date:   2016-03-22 19:18:00 +0800
categories: myblog
---
**JavaScript变量是无类型的（untyped）,变量可以被赋予任何类型的值，其中有6个值属于假值**

#### JavaScript中的6个值为“假”：
<pre class="brush:js;">
false       //布尔类型
null        //JavaScript语言关键字，可以认为null是一个特殊的对象
undefined   //预定义的全局变量，表达含义“未定义”
0           //数值0
''          //空字符串
NaN         //预定义的全局变量(not-a-nummber),用来表示没有意义的数字运算的结果
</pre>

#### 除了以上6个外，其它均为“真” ，包括对象、数组、正则、函数等。注意 '0'、'null'、'false'、{}、[]、function() {}等也都是真值

#### 虽然这六个值都为“假”，它们之间并非都相等“==”
<pre class="brush:js;">
console.log( false == null )      // false
console.log( false == undefined ) // false
console.log( false == 0 )         // true
console.log( false == '' )        // true
console.log( false == NaN )       // false

console.log( null == undefined ) // true “特殊”
console.log( null == 0 )         // false
console.log( null == '' )        // false
console.log( null == NaN )       // false

console.log( undefined == 0)   // false
console.log( undefined == '')  // false
console.log( undefined == NaN) // false

console.log( 0 == '' )  // true
console.log( 0 == NaN ) // false
</pre>

#### “==” 与 “===”
* 相同点：两个运算符允许任意类型的操作数，都返回boolean类型的true或false
* “==”称之为相等运算符（equality operator）
* “===”也称之为严格相等运算符（strict equality）或 恒等运算符（identity operator）
* 如果两个操作数的类型不同，“==”会进行类型转换，然后在做比较！“===”则不会进行任何类型转换
* “==” 比较中，**不同类型** 比较时，**字符串、boolean会先转换成数值类型再进行判断。对象会先转换为原始值在进行比较！**

#### JavaScript对象的比较是引用的比较，而非值的比较。对象和其本身是相等的，但和其它对象都不相等。
