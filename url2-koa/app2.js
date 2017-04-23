const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const app = new Koa();
app.use(bodyParser());

// 扫描controllers目录
// 使用sync是因为启动时只运行一次，不存在性能问题
var files = fs.readdirSync(__dirname + '/controllers');
// 找出所有js文件
var js_files = files.filter((f) => { // 箭头函数
    return f.endsWith('.js');
})

// 处理每个js文件
for (var f of js_files) {
    console.log(`process controller: ${f}...`);
    // 导入模块
    // mapping就是导入的模块暴露出的对象
    // url：'GET /' OR 'POST /signin' OR 'GET /hello/:name'
    // mapping[url]就是封装好的异步函数
    console.log(f);
    let mapping = require(__dirname + '/controllers/' + f);
    console.log(mapping);
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4); // '/' OR '/hello/:name'
            router.get(path, mapping[url]);
            console.log(`register URL mapping:GET ${path}`);
        } else if(url.startsWith('POST ')) {
            var path = url.substring(5); // '/signin'
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}
app.use(router.routes());
app.listen(3000);
console.log('app started at port 3000...');
