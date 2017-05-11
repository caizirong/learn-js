// 即将退出时的回调函数
process.on('exit', function(code) {
    console.log('about to exit with code: ' + code);
})

// 下一次事件循环
process.nextTick(function () {
    console.log('b');
})

// 直接运行
console.log('a');


// 判断执行环境
// 浏览器还是node
if (typeof window === 'undefined') {
    console.log('node.js')
} else {
    console.log('browser');
}

// 异步读文件
// 读取文本文件
'use strict';
var fs = require('fs');
fs.readFile('sample.txt', 'utf-8', function(err, data){
    if(err) {
        console.log(err);
    } else {
        console.log(data);
    }
});
// 读取二进制文件
'use strict';
var fs = require('fs');
fs.readFile('sample.png', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        console.log(data.length + 'bytes');

    }
});
// 同步读取文件
'use strict';
var fs = require('fs');
try {
    var data = fs.readFileSync('sample.txt', 'utf-8');
    console.log(data);
} catch (err){
    console.log('wrong');
}


/*
async and await
async异步执行，碰到await先暂停，执行await后的对象，再返回来继续
*/
// (async() => {
//     console.log('1');
//     await two();
//     console.log('1.1');
// })();

// async function two() {
//     console.log('2');
//     await next();
//     console.log('2.1');
// }
// //two();

// async function next() {
//     console.log('3');
//     console.log('3.1');
// }
// //next();
/*1
2
3
3.1
2.1
1.1*/


// (function a() {
//     console.log('1');
//     two();
//     console.log('2');
// })()
// function two() {
//     console.log('3');
// 1
// 3
// 2
