'use strict';

var fs = require('fs'), // 创建流
    http = require('http'), // 创建服务器
    path = require('path'), // 获取本地文件路径
    url = require('url'); // 解析urlj

// 从命令行参数获取root目录，默认当前目录
var root = path.resolve(process.argv[2] || '.');

console.log('Static root dir: ' + root);

// 创建服务器
var server = http.createServer(function (request, response) {
    // 获得URL的path
    var pathname = url.parse(request.url).pathname;
    console.log(pathname);
    // 搜索目录
    // 文件本地路径
    var filepath;
    // url后面没有路径，即在目录下寻找index.html，再没有就寻找default.html
    if (pathname === '/') {
        filepath = path.join(root, '/index.html') || path.join(root, 'default.html');
    } else {
        filepath = path.join(root, pathname);
    }
    console.log(filepath);
    // 查看文件状态
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {  // 没有出错并且文件存在

            console.log('200' + request.url);
            // 响应写入状态码200
            response.writeHead(200);
            // 打开文件流，流向response（copy了找到的本地文件的html）
            fs.createReadStream(filepath).pipe(response);
        } else {
            // 404 not found
            console.log('404' + request.url);
            response.writeHead(404);
            response.end('404 NOT Found')
        }
    })
});

server.listen(8080);
console.log('Server is running at http://127.0.0.1:8080/');