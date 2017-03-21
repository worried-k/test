---
layout: post
title:  "Single Page Web Applications 阅读思考笔记"
date:   2016-10-5 18:10:00 +0800
categories: myblog
---
**Single Page Web Applications 简称 SPA（单页Web应用），Web2.0时代的产物。它可能会提高开发成本，但那趋近于原生应用的效果还是令人心驰神往。**

#### 简介
* 《单页Web应用：JavaScript从前端到后端》· Michael S. Mikowski Josh C. Powell 著 · 包勇明 
* 本书讲解如何 设计、构建和测试全栈单页的web应用，写的很细但我并没有逐字逐句的全部看完，即使是这样还是吸收了些营养，我把它们记录在这里

#### 内容
* 推荐使用的：Object.create(proto, [ propertiesObject ])
    * 创建一个拥有指定原型和若干个指定属性的对象。
    * 可以用来实现类式继承
    * 可以用它来代替 **浅克隆** 来防止Object引用传递带来的负面影响
    * 当proto参数为数组时，函数会return一个丢失数组特性的一个对象
<pre class="brush:js;">
//es5关于此函数的实现，此函数的注释来自MDN
if (typeof Object.create != 'function') {
  Object.create = (function() {
    //为了节省内存，使用一个共享的构造器
    function Temp() {}
    // 使用 Object.prototype.hasOwnProperty 更安全的引用 
    var hasOwn = Object.prototype.hasOwnProperty;

    return function (O) {
      // 1. 如果 O 不是 Object 或 null，抛出一个 TypeError 异常。
      if (typeof O != 'object') {
        throw TypeError('Object prototype may only be an Object or null');
      }

      // 2. 使创建的一个新的对象为 obj ，就和通过
      //    new Object() 表达式创建一个新对象一样，
      //    Object是标准内置的构造器名
      // 3. 设置 obj 的内部属性 [[Prototype]] 为 O。
      Temp.prototype = O;
      var obj = new Temp();
      Temp.prototype = null; // 不要保持一个 O 的杂散引用（a stray reference）...

      // 4. 如果存在参数 Properties ，而不是 undefined ，
      //    那么就把参数的自身属性添加到 obj 上，就像调用
      //    携带obj ，Properties两个参数的标准内置函数
      //    Object.defineProperties() 一样。
      if (arguments.length > 1) {
        // Object.defineProperties does ToObject on its first argument.
        var Properties = Object(arguments[1]);
        for (var prop in Properties) {
          if (hasOwn.call(Properties, prop)) {
            obj[prop] = Properties[prop];
          }
        }
      }

      // 5. 返回 obj
      return obj;
    };
  })();
}

//创建对象，它有一个可写的,可枚举的,可配置的属性p
var o = Object.create({}, {
    p: {
        value: 42,
        writable: true,
        enumerable: true,
        configurable: true
    }
});
//如果省略了的属性特性（writable、enumerable、configurable）默认为false,所以属性p是不可写,不可枚举,不可配置的
o = Object.create({}, {
    p: {
        value: 42
    }
})
o.p = 24
o.p
//42

//此特性还可以通过Object.defineProperties(obj, props)来设置（在一个对象上添加或修改一个或者多个自有属性，并返回该对象）
</pre>
* Prototype跟Constructor关系介绍：
    * 每个函数对象都有名为“prototype”的属性(Function.prototype函数对象是个例外，没有prototype属性)，用于引用原型对象。
    * 原型对象又有名为“constructor”的属性，它反过来引用函数本身。
    * 这是一种循环引用（Animal.prototype.constructor === Animal）
* 锚接口模式
    * 当URL的其他字段（hash）发生变化时，引起了页面的重新渲染
    * 在有些个URI中的hash值处会出现 #!,这是告诉谷歌和其它搜索引擎，这个URI是可被搜索索引的
    * HTTP请求不会包含hash字段，这些字符都不会被发送到服务器端
    * 每一次改变hash字段，都会在浏览器的访问历史中增加一个记录，使用"后退"按钮，就可以回到上一个位置(>IE7)
    * onhashchange事件可以监听hash字段的变化(>IE8)
<pre class="brush:js;">
window.onhashchange = function(){
  alert(location.hash);
}
</pre>

* 函数推荐写法示例（demo函数为一个功能模块）：
<pre class="brush:js;">
function demo() {
  var initModule, removeSlider;
  initModule = function () {
     //...
  };
  removeSlider = function () {
     //...
  };
  return {
     initModule: initModule,
     removeSlider: removeSlider
  };
}
</pre>
* 公共模块的维护
    * 开发采用函数式编程，纯函数、无业务关系
    * 清晰的注释文档（使用过SmartDoc，依赖于YUIDoc，有些功能需要手动修改工具源码）
    * 采用单元测试（使用过qunit，简洁、方便）
    * 理想状态：注释文档中可以直接使用单元测试，并可以直接增删单元测试用例并进行单个多个测试---待搭建
* window.resize等window的事件最好全局只有一个
* js文件和css文件的命名应该是统一的，都应该有自己的命名空间呢a.b.c.d（来表示上下级依赖关系）
* 页面中所有需要配置的字段，最好存放在对象configMap中，***保证全局一致*** 
* 用jquery定义事件，返回true和false，会影响jquery对这个事件的下一步处理，返回false时会触发stopPropagation()等方法来阻止事件冒泡
* javascript的执行时分为2轮的，第一轮的执行步骤为：
    1. 声明并初始化函数参数
    2. 声明局部变量，包括将匿名函数赋值给一个局部变量，但并不初始化它们
    3. 声明并初始化函数
* JavaScript的函数作用域是词法作用域，但每当函数被调用的时候，就会产生一个新的执行对象（它不是一个对象，表示运行中的函数的意思）
* 在制作web应用的时候需要先制作整体的框架图，先区分模块，然后再将每个模块按照其为第三方模块的开发模式开发，保证每个页面模块之间相互不能有干扰
* 关于 “桩”，桩文件、桩文件夹、桩对象...这个词很好的表述了我们在开发过程中需要的“占位”操作
* 为什么自己的库要放在最后加载？ （我们希望自己的库的名字空间是最终声明）
* 团队开发时需要使用相同的代码风格，最好编辑器支持相关的规则自定义（目前使用vscode的jshint插件）

#### 关于数据驱动+单向数据流+模块化开发的几点心得与杂记
###### --源于一个已经用于生产环境的手写的小框架

1. 数据源唯一，所有的页面模块的渲染都是依赖这个数据源
2. 每一个“页面模块”的函数中只应该存在简单的if判断和dom操作（职责单一，我就管我这块的页面显示）
3. 需要保证当数据源中的数据对象发生变化时，使用这个数据对象的“页面模块”函数自动执行（需自动建立映射关系）
4. 所有的dom操作都应该都应该被封装在“页面模块”函数中
5. 所有需要调整页面展示的地方，都需要通过修改数据源中的数据，来通过因果关系，使数据“流”向具体“页面模块”
6. 每个页面模块都应该显式的对应“一块”dom元素
7. **数据源的设计决定了整个项目的结构**，数据源应遵循“类数据库式的设计范式”，扁平化无对象嵌套（危险的对象引用传递）
8. 我理解的框架就是“约定好的项目构建方式+公共模块类库+人为的约束”
9. 特点：以小部分性能的损失来换取开发的便捷，模块功能职责单一
10. 职责单一