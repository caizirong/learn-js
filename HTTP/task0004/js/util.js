/**
 * Created by Caizirong on 16/10/17.
 */
// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    // return arr instanceof Array;  // 不够准确
    return Object.prototype.toString.call(arr) === '[object Array]';
}

/*
 *或者这样也可以
function isArray(arr) {
    return Array.isArray(arr);
}
*/

// 判断日期
function isDate(date) {
    return Object.prototype.toString.call(date) === '[object Date]';
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    // chrome下,'function' == typeof /a/ 为true.
    return Object.prototype.toString.call(fn) === '[object Function]';
}

// 判断正则
function isRegExp(arg) {
    return Object.prototype.call(arg) === '[object RegExp]';
}

/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
 *
 * 事实上来说，在Javascript语言中，任何判断都一定会有漏洞，因此本方法只针对一些最常用的情况进行了判断
 *
 * @returns {Boolean} 检查结果
 */
function isPlain(obj){
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        key;
    if ( !obj ||
         //一般的情况，直接用toString判断
         Object.prototype.toString.call(obj) !== "[object Object]" ||
         //IE下，window/document/document.body/HTMLElement/HTMLCollection/NodeList等DOM对象上一个语句为true
         //isPrototypeOf挂在Object.prototype上的，因此所有的字面量都应该会有这个属性(Object.prototype isPrototypeOf(obj) === true)
         //对于在window上挂了isPrototypeOf属性的情况，直接忽略不考虑
         !('isPrototypeOf' in obj)
       ) {
        return false;
    }

    //判断new fun()自定义对象的情况
    //constructor不是继承自原型链的
    //并且原型中有isPrototypeOf方法才是Object
    if ( obj.constructor &&
        !hasOwnProperty.call(obj, "constructor") &&
        !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
        // hasOwnProperty.call(obj.constructor.prototype,"isPrototypeOf" === obj.constructor.prototype.hasOwnProperty("isPrototyeOf"))
        return false;
    }
    //判断有继承的情况
    //如果有一项是继承过来的，那么一定不是字面量Object
    //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
    for ( key in obj ) {}
    return key === undefined || hasOwnProperty.call( obj, key );
}



// 将对象及其名称作为参数传入时，显示对象的属性
function showProps(obj, objName) {
  var result = "";
  for (var i in obj) {  // 遍历obj的key
    console.log(i);
    console.log(obj[i]);
    if (obj.hasOwnProperty(i)) {  // 过滤继承来的属性
        result += objName + "." + i + " = " + obj[i] + "\n";
    }
  }
  return result;
}

/*
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};

console.log(showProps(srcObj,'srcObj'));
-->srcObj.a = 2
-->srcObj.b = [object Object]
*/

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject1(src) {
    var newValue;
    if (!src
        || src instanceof Number
        || src instanceof String
        || src instanceof Boolean) {
        newValue = src; // 基本数据类型
    } else if (isDate(src)) {
        newValue = new Date(src);   // 日期
    } else if (isArray(src) || isPlain(src)) {
        newValue = isArray(src) ? [] : {};
        for (var item in src) {
            // for in 遍历数组或对象是为了访问扩展的属性（不是通过索引，类似对象属性）
            // 过滤继承来的属性
            if (src.hasOwnProperty(item)
                && !isFunction(src[item]
                && !isRegExp(src[item]))) {
                newValue[item] = arguments.callee(src[item]);
            }
        } // end for
    } // end else
    return newValue;
}

// 用JSON来克隆
function cloneObject2(src) {
    var trans = JSON.stringify(obj);
    var newValue = JSON.parse(trans);
    return newValue;
}

// review中的用法
function cloneObject (source) {
    var result = source, i, len;
    if (!source
        || source instanceof Number
        || source instanceof String
        || source instanceof Boolean) {   // 基本数据类型
        return result;
    } else if (isArray(source)) {          // 数组
        result = [];
        var resultLen = 0;
        for (i = 0, len = source.length; i < len; i++) {
            result[resultLen++] = cloneObject(source[i]);
        }
    } else if (isPlain(source)) {           // 对象
        result = {};
        for (i in source) {
            if (source.hasOwnProperty(i)) {
                result[i] = cloneObject(source[i]);
            }
        }
    }
    return result;
}
// 克隆数组和对象这中Object时，要用到递归，因为对象可能里面的元素会不止一个，对每个元素都要进行一次判断该元素是基本数据类型还是对象
// 深度克隆的深度体现在源对象改变，克隆的新对象也随之改变

/*
// 测试用例：
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);

srcObj.a = 2;
srcObj.b.b1[0] = "Hello";

console.log(abObj.a);  // 2
console.log(abObj.b.b1[0]); // "Hello"

console.log(tarObj.a);      // 1
console.log(tarObj.b.b1[0]);    // "hello"
*/

//数组去重
function uniqArray(arr) {
    var len = arr.length,
        i,
        datum,
        result = arr.slice(0);
    // 从后往前循环比较，相同时删除后一个
    while (--len) {
        datum = result[len]; // 初始值为数组最后一个
        i = len; // 初始值为索引最大值
        while (i--) {
            if (datum === result[i]) {
                result.splice(len, 1);
                break;
            }
        }
    }
    return result;
    // 原数组不变，最后返回一个去重后的新数组
}

// hash
function uniqArray1(arr) {
    var obj = {}; // 存储键值对，键位数组元素，值为true
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i];
        if (!obj[key]) {
            result.push(key);
            obj[key] = true;
        }
    }
    return result;
}

// hash + es5(最快)
function uniqArray2(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    return Object.keys(obj);
}

// 新建空列表，比较新列表与原列表，利用indexof查找
function uniqArray3(arr) {
    var newArr = [];
    for (var i in arr) {
        if (newArr.indexOf(arr[i]) === -1) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

// 使用示例
var a = [1, 3, 5, 7, 5, 3];
var b = uniqArray(a);
// console.log(b) // [1, 3, 5, 7]

var a1 = 10000;
var a = [];
while (a1--) {
    a.push(a1%2);
}
// console.log(a);

// // use chrome dev tools
// console.time('uniqArray')
// console.log(uniqArray(a).length);   // 2 -->[0,1]
// console.timeEnd('uniqArray')    // 7.76ms

// console.time('uniqArray1')
// console.log(uniqArray1(a).length);
// console.timeEnd('uniqArray1') // 1.04ms

// console.time('uniqArray2')
// console.log(uniqArray2(a).length);
// console.timeEnd('uniqArray2') // 0.82ms

// console.time('uniqArray3')
// console.log(uniqArray3(a).length);
// console.timeEnd('uniqArray3') // 2.447ms

// 中级班同学跳过此题
// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串

//自己的方法
// pos初始值为头部第一个空格的索引（只考虑 >-1 即有空格）

// function simpleTrimW(str) {
//     var newStr = "";
//     var pos_front = str.indexOf(" ");
//     while(pos_front > -1) {
//         // 从前往后查
//         var pos_pre = pos_front;
//         pos_front = str.indexOf(" ", pos_front + 1);
//         if (pos_front != pos_pre +1 ) {  //说明中间隔了非空格字符
//             break;
//         }
//     }
//     // 从后往前查
//     var pos_end = str.lastIndexOf(" ");
//     while(pos_end > -1) { // 存在空格符
//         var pos_pre = pos_end;
//         pos_end = str.lastIndexOf(" ", pos_end - 1);
//         if (pos_end != pos_pre - 1) {
//             break;
//         }
//     }
//     return(str.slice(pos_pre + 1, pos_pre));
// }
// var str = "    hi ed  ";
// console.log(simpleTrim(str)); //hi ed

//去除所有空格和制表符
function simpleTrim1(str) {
    var newStr = "";
    for (var i = 0; i < str.length; i++) {
        if (str[i] != " " && str [i] != "\t") {
           newStr = newStr.concat(str[i]); //中间出现的也会被去除
        }
    }
    console.log(newStr);
}
var str = "   h i           io  \t o";
// console.log(str);
// simpleTrim1(str); // hiioo

function simpleTrim(str) {
    var newStr = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) != " " && str.charAt(i) != "\t") {
            break;
        }
    }
    for (var j = str.length - 1; j >= 0; j--) {
        if (str.charAt(j) != " " && str.charAt(j) != "\t") {
            break;
        }
    }
    newStr = str.slice(i, j+1);
    console.log(newStr);
}
/*
var str = "  hel  log     ";
simpleTrim(str); //hel  log
*/

function simpleTrim2(str) {
    function isEmpty(c) {
        return /\s/.test(c);
    }

    for (var i = 0; i < str.length; i++) {
        if (!isEmpty(str.charAt(i))) {
            break;
        }
    }

    for (var j = str.length - 1; j >= 0; j--) {
        if (!isEmpty(str.charAt(j-1))) {
            break;
        }
    }

    if (i > j) {
        return '';
    }

    return str.substring(i, j);
}

 // 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
function trim(str) {

    var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");

    return String(str).replace(trimer, "");

}


function trim1(str) {
    return str.replace(/^\s+|\s+$/g, '');
}
//var str = '   hi!  ';
//str = trim(str);
//console.log(str); // 'hi!'

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    for( var i=0; i < arr.length; i++ ) {
        fn(arr[i], i);
    }
}
// 其中fn函数可以接受两个函数：item和index
/*
var arr = ['java', 'c', 'php', 'html'];
function output(item) {
    console.log(item) //java c php html
}
each(arr, output);

var arr = ['java', 'c', 'php', 'html'];
function output(item, index) {
    console.log(index + ': ' + item)
}
each(arr, output);// 0: java
                  // 1: c
                  // 2: php
                  // 3: html

*/
function eachA(arr, fn) {
    arr.forEach(fn);
}
//var arr = ['java', 'c++', 'php', 'html'];
function output(item, index) {
    console.log(index + ': ' + item)
}
//eachA(arr, output); //0: java, 1: c++, 2: php, 3: html

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    var n = 0;
    for (var key in obj) {
      //  console.log(key); //a, b, c
        n++;
    }
    return n;
}

// 更简单的方法
function getObjectLength1(obj) {
    return Object.keys(obj).length;
}

// Object.keys兼容老式浏览器
var getObjectLength2 = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({
            toString: null
        }).propertyIsEnumerable('toString'),
        dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
            throw new TypeError('getObjectLength called on non-object');
        }

        var result = [],
            prop, i;

        for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
                result.push(prop);
            }
        }

        if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
                if (hasOwnProperty.call(obj, dontEnums[i])) {
                    result.push(dontEnums[i]);
                }
            }
        }
        // return result;  --> will return Object.keys
        return result.length; //--> will return Object.keys.length
    };
}());
// 简单点的兼容
function getObjectLength3(obj) {
    if (!Object.keys) {
        Object.keys = function (o) {
            if (o !== Object(o)) {
                throw new TypeError('Object.keys called on a non-object');
                var k = [], p;
                for (p in o) {
                    if (Object.prototype.hasOwnProperty.call(o, p)) {
                        k.push(p);
                    }
                // return k; --> will return Object.keys
                return k.length;
                } // end for
            } // end o !== Object(o)
        } // end function
    } // end !Object.keys
    return Object.keys(obj).length;
}

// // 使用示例
// var obj = {
//     a: 1,
//     b: 2,
//     c: {
//         c1: 3,
//         c2: 4
//     }
// };
// console.log(Object.keys(obj));  // ['a', 'b', 'c']
// console.log(getObjectLength(obj)); // 3
// console.log(getObjectLength3(obj)); // 3


// 判断是否为邮箱地址
function isEmail(emailStr) {
    // math_phys.d.d@VIP.163.com
    // 用户名必须以字母开头，不能以点结尾
    // 考虑域名的级联
    var pattern = /^(\w+\.)*\w+@\w+(\.\w+)+$/;
    return pattern.test(emailStr);
}

// 判断是否为手机号
function isMobilePhone(phone) {
    var pattern = /^(\+\d{1,4})?\d{7,11}$/;
    return pattern.test(phone);
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    var oldClassName = element.className;
    element.className = oldClassName === "" ? newClassName : oldClassName + " " + newClassName;
}

function hasClass(tagStr,classStr){
    var arr=tagStr.className.split(/\s+/ ); //这个正则表达式是因为class可以有多个,判断是否包含
    for (var i=0;i<arr.length;i++){
        if (arr[i]==classStr){
            return true ;
        }
    }
    return false ;
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    var originalClassName = element.className; // 取原来的所有类名
    var pattern = new RegExp("\\b" + oldClassName + "\\b"); // 匹配指定类名
    element.className = originalClassName.replace(pattern,''); // 移除样式
}


// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNode.parentNode;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var pos = {};
    pos.x = element.getBoundingClientRect(element).left + Math.max(document.documentElement.scrollLeft,
        document.body.scrollLeft);
    pos.y = element.getBoundingClientRect(element).top + Math.max(document.documentElement.scrollTop,
        document.body.scrollTop);
    return pos;
}

// 实现一个简单的Query
// function $(selector) {
//     if (!selector) {
//         return null;
//     }

//     if (selector == document) {
//         return document;
//     }

//     selector = selector.trim(); //去除首尾空格
//     if (selector.indexOf(" ") !== -1) {    // 存在空格，即组合查询
//         var selectorArr = selector.split(/\s+/);

//         var rootScope = myQuery(selectorArr[0]);  // 找出在第一个查询条件下的所有子节点，作为第二次查询的范围
//         var i = null;
//         var j = null;
//         var result = [];

//         for (i = 1; i < selectorArr.length; i++) {  // i从1开始，rootScope即i=0时
//             for (j = 0; j < rootScope.length; j++) {
//                 result.push(myQuery(selectorArr[i], rootScope[j]));
//             }
//         }
//         return result[0][0];
//     } else {  // 单一查询
//         return myQuery(selector,document)[0];
//     }

// }
function $(selector) {

    var selItem = selector.split(" ");

    if ( selItem.length === 1 ) {
        var aitem = selItem.toString();
        switch ( aitem.substr(0, 1) ) {
            case "#":
                return document.getElementById( aitem.substr(1) );
                break;
            case ".":
                if (document.getElementsByClassName) {
                    return document.getElementsByClassName(aitem.substr(1))
                }else {
                    var nodes = document.getElementsByTagName("*"),ret = [];
                    for(i = 0; i < nodes.length; i++) {
                        if(hasClass(nodes[i],aitem.substr(1))){
                            ret.push(nodes[i])
                        }
                    }
                    return ret;
                }
                break;
            case "[":
                if ( aitem.charAt( aitem.length - 1 ) === "]" ) {

                    var item = aitem.substring( 1, aitem.length - 1 );
                    var elements = document.getElementsByTagName("*");

                    if ( item.indexOf("=")  != -1 ) {
                        var items = item.split("=");
                        for ( var j = 0; j < elements.length; j++) {
                            if ( elements[j].getAttribute( items[0] ) === items[1] ) {
                                return elements[j];
                            }
                        }
                    }
                    else {
                        for ( var i=0; i < elements.length; i++ ) {
                            if ( elements[i].hasAttribute( item ) ) {
                                return elements[i];
                            }
                        }
                    }
                }
                else
                {
                    throw Error( "']' is missing !" );
                }
                break;
            default :
                return document.getElementsByTagName( aitem );
        }
    }
    else {
        for ( var k = 1; k < selItem.length; i++ ) {

            if ( selItem[0].substr(0, 1) == "#" ) {
                var itemId = document.getElementById( selItem[0].substr(1) );
                switch ( selItem[k].substr(0,1) ) {
                    case ".":
                        return itemId.getElementsByClassName( selItem[k].substr(1) )[0];
                        break;
                    default :
                        return itemId.getElementsByTagName( selItem[k] );
                }
            }
            else if ( selItem[0].substr(0, 1) == "." ) {
                var itemClass = document.getElementsByClassName( selItem[0].substr(1) );
                switch ( selItem[k].substr(0, 1) ) {
                    case "#":
                        return itemClass.getElementById( selItem[k].substr(1) );
                        break;
                    default :
                        return itemId.getElementsByTagName( selItem[k] );
                }
            }
        }
    }
}
/**
 * 针对一个内容查找结果 success
 * @param  {String} selector 选择器内容
 * @param  {Element} root    根节点元素
 * @return {NodeList数组}    节点列表，可能是多个节点也可能是一个
 */
function myQuery(selector, root) {
    var signal = selector[0]; //
    var allChildren = null;
    var content = selector.substr(1);
    var currAttr = null;
    var result = [];
    root = root || document; //若没有给root，赋值document
    switch (signal) {
        case "#":
            result.push(document.getElementById(content));
            break;
        case ".":
            allChildren = root.getElementsByTagName("*");
            // var pattern0 = new RegExp("\\b" + content + "\\b");
            for (i = 0; i < allChildren.length; i++) {
                currAttr = allChildren[i].getAttribute("class");
                if (currAttr !== null) {
                    var currAttrsArr = currAttr.split(/\s+/);
                    console.log(currAttr);
                    for (j = 0; j < currAttrsArr.length; j++) {
                        if (content === currAttrsArr[j]) {
                            result.push(allChildren[i]);
                            console.log(result);
                        }
                    }
                }
            }
            break;
        case "[": //属性选择
            if (content.search("=") == -1) { //只有属性，没有值
                allChildren = root.getElementsByTagName("*");
                for (i = 0; i < allChildren.length; i++) {
                    if (allChildren[i].getAttribute(selector.slice(1, -1)) !== null) {
                        result.push(allChildren[i]);
                    }
                }
            } else { //既有属性，又有值
                allChildren = root.getElementsByTagName("*");
                var pattern = /\[(\w+)\s*\=\s*(\w+)\]/; //为了分离等号前后的内容
                var cut = selector.match(pattern); //分离后的结果，为数组
                var key = cut[1]; //键
                var value = cut[2]; //值
                for (i = 0; i < allChildren.length; i++) {
                    if (allChildren[i].getAttribute(key) == value) {
                        result.push(allChildren[i]);
                    }
                }
            }
            break;
        default: //tag
            result = root.getElementsByTagName(selector);
            break;
    }
    return result;
}

/*
// 可以通过id获取DOM对象，通过#标示，例如
$("#adom"); // 返回id为adom的DOM对象

// 可以通过tagName获取DOM对象，例如
$("a"); // 返回第一个<a>对象

// 可以通过样式名称获取DOM对象，例如
$(".classa"); // 返回第一个样式定义包含classa的对象

// 可以通过attribute匹配获取DOM对象，例如
$("[data-log]"); // 返回第一个包含属性data-log的对象

$("[data-time=2015]"); // 返回第一个包含属性data-time且值为2015的对象

// 可以通过简单的组合提高查询便利性，例如
$("#adom .classa"); // 返回id为adom的DOM所包含的所有子节点中，第一个样式定义包含classa的对象
*/

// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener) {
    if (element.addEventListener) {   // IE8+
        element.addEventListener(event,listener);
    } else if (element.attachEvent) {  // IE8以下
        element.attachEvent("on" + event, listener);
    } else {
        element["on" + event] = listener;  // dom0级
    }
}

// 例如：
//function clicklistener(event) {
//    ...
//}
//addEvent($("#doma"), "click", a);

// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener) {
    if (element.removeEventListener) {
        element.removeEventListener(event,listener);
    } else if (element.detachEvent) {
        element.detachEvent("on" + event, listener);
    } else {
        element["on" + event] = null;
    }
}

// 实现对click事件的绑定
function addClickEvent(element, listener) {
    addEvent(element, "click", listener);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    addEvent(element, "keydown", function(event) {
        event = event || window.event;
        if (event.keyCode === 13) {
            listener();
        }
    })
}

//接下来我们把上面几个函数和$做一下结合，把他们变成$对象的一些方法

$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;
// task 4.2
// 对一个列表里所有的<li>增加点击事件的监听
function clickListener(event) {
    console.log(event);
}

/*
$.click($("#item1"), clickListener);
$.click($("#item2"), clickListener);
$.click($("#item3"), clickListener);
*/


// 我们通过自己写的函数，取到id为list这个ul里面的所有li，然后通过遍历给他们绑定事件。这样我们就不需要一个一个去绑定了。
function clickListener(event) {
    console.log(event);
}

function renderList() {
    $("#list").innerHTML = '<li>new item</li>';
}

function init() {
    /*
    each($("#list").getElementsByTagName('li'), function(item) {
        $.click(item, clickListener);
    });
    */

    $.click($("#btn"), renderList);
}

function delegateEvent(element,tag,eventName,listener){
    addEvent(element, eventName, function(event){
        var target = event.target || event.srcElement;
        if(target.tagName.toLowerCase() == tag.toLowerCase()) {
            listener.call(target, event);
        }
    });
}

$.delegate = delegateEvent;
//$.delegate($("#list"), "li", "click", clickHandle);



//判断是否为IE浏览器，返回-1或者版本号
function isIE() {
    var s = navigator.userAgent.toLowerCase();
    console.log(s);
    //ie10的信息：
    //mozilla/5.0 (compatible; msie 10.0; windows nt 6.2; trident/6.0)
    //ie11的信息：
    //mozilla/5.0 (windows nt 6.1; trident/7.0; slcc2; .net clr 2.0.50727; .net clr 3.5.30729; .net clr 3.0.30729; media center pc 6.0; .net4.0c; .net4.0e; infopath.2; rv:11.0) like gecko
    var ie = s.match(/rv:([\d.]+)/) || s.match(/msie ([\d.]+)/);
    if (ie) {
        return ie[1];
    } else {
        return -1;
    }
}


function setCookie(cookieName, cookieValue, expiredays) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate + expiredays);

    // 兼容IE
    oDate.toGMTString();  // typeof oDate === string

    document.cookie = cookieName + '=' + encodeURI(cookieValue) + ';expires=' + oDate;
}

function getCookie(cookieName) {
    var arr = document.cookie.split("; ");
    for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split("=");
        if (arr2[0] === cookieName) {
            return decodeURI(arr2[1]);
        }
    }
    return "";
}


function removeCookie(cookieName) {
    setCookie(cookieName, "1", -1);
}

//AJAX
function ajax(url, options) {
    // 创建对象
    xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    // 处理data
    if (options.data) {
        var dataArr = [];
        for (var item in options.data) {
            dataArr.push(item + "=" + options.data[item]);
        }
        var newData = dataArr.join("&");
    }
    // 处理type
    if (!options.type) {
        options.type = "GET";
    }
    options.type = options.type.toUpperCase();
    // 发送请求
    if (options.type = "GET") {
        var newUrl = '';
        if (options.data) {
            newUrl = url + "?" + newData;
        } else {
            newUrl = url;
        }
        xhr.open("GET", newUrl, true);
        xhr.send();
    } else if (options.type = "POST") {
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }
    // onreadystatechange 事件
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (options.success) {
                    options.success(xhr.responseText, xhr.responseXML);
                }
            } else {
                if (options.onfail) {
                    options.onfail();
                }
            }
        }
    }
}
