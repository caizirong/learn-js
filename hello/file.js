// 'use strict';
// var fs = require('fs');
// var data = '\nHi, Node.js.';
// // fs.writeFile('sample.txt', data, function (err) {
// //     if (err) {
// //         console.log(err);
// //     } else {
// //         console.log('ok');
// //     }
// // })
// fs.appendFile('sample.txt', data, 'utf-8', function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('ok');
//     }
// })

// fs.stat('sample.txt', function(err,stat) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('isFile: ' + stat.isFile());
//         console.log('isDirectory: ' + stat.isDirectory());
//         if (stat.isFile()) {
//             console.log('size: ' + stat.size);
//             console.log('birth time: ' + stat.birthtime);
//             console.log('modified time:' + stat.mtime);
//         }
//     }
// })
// var stats = fs.statSync('sample.txt');
// console.log(stats.isFile());
// console.log(stats.isDirectory());
// if (stats.isFile()) {
//     console.log(stats.size);
//     console.log('birth time:' + stats.birthtime);
//     console.log('modified time: ' + stats.mtime);
// }
// 'use strict';
// var fs = require('fs');
// var rs = fs.createReadStream('sample.txt', 'utf-8');

// rs.on('data', function (chunk) {
//     console.log('DATA:');
//     console.log(chunk);
// })
// rs.on('end', function () {
//     console.log('END');
// })
// rs.on('error', function () {
//     console.log('ERROR:' + err);
// })

// var ws1 = fs.createWriteStream('output1.txt', 'utf-8');
// ws1.write('写入文本数据。。。\n');
// ws1.write('END.');
// ws1.end();
// var fs = require('fs');
// var ws2 = fs.createWriteStream('output2.txt', 'utf-8');
// ws2.write('写入二进制数据\n');
// ws2.write('end.');
// ws2.end('e');
// fs.readFile('output2.txt', function(err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(data);
//         console.log(data.toString('utf-8'))
//     }
// })

var fs = require('fs');
var ws = fs.createWriteStream('copied.txt', 'utf-8');
var rs = fs.createReadStream('sample.txt','utf-8');
rs.pipe(ws); // 写入流关闭了吗
ws.write('a');