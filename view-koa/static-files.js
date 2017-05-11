// 处理静态资源
const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');


// url: 类似于 '/static'
// dir: 类似于 __dirname +'/static
// 这里的参数url是固定的，是扫描本地目录
// path是不固定的，是真正网页request请求中的href的path
function staticFiles(url, dir) {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        console.log('扫描的本地文件夹：' + url);
        console.log('ctx.url:' + ctx.url);
        console.log('ctx.href:' + ctx.href);
        console.log('request中的path路径：' + rpath);
        // 判断是否以指定的url开头
        if (rpath.startsWith(url)) {
            // 获取文件完整路径
            let fp = path.join(dir, rpath.substring(url.length)); // dir里已经有url，所以要从url后面开始拼接
            console.log('当前文件所在本地路径:' + dir);
            console.log('请求文件本地完整路径:' + fp);
            // 判断文件是否存在
            if (await fs.exists(fp)) {
                console.log('文件存在');
                // 查找文件的mime
                ctx.response.type = mime.lookup(rpath);
                // 读取文件内容并赋值给response.body
                ctx.response.body = await fs.readFile(fp);
            } else {
                // 文件不存在
                console.log('文件不存在');
                ctx.response.status = '404';
            }
        } else {
            // 不是指定前缀的URL，继续处理下一个middleware
            await next();
        }
    };
}

module.exports = staticFiles;