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
} catch {
    console.log('wrong');
}
