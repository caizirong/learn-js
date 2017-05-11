const Koa = require('koa');
const templating = require('./templating');
const controller = require('./controller');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const isProduction = process.env.NODE_ENV === 'production';

app.use(async(ctx,next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var 
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

if (!isProduction) {
    let staticFiles = require('./static-files');
    console.log('__dirname：' + __dirname);  // __dirname: C:\Users\zirong\Desktop\learn-js\view-koa
    console.log('dir:' + __dirname + '/static');      // C:\Users\zirong\Desktop\learn-js\view-koa/static <-- 这个是static-file.js里的dir
    app.use(staticFiles('/static', __dirname + '/static'));
}

app.use(bodyParser());
// 开发环境下关闭缓存，修改view就可以刷新浏览器直接看到效果
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

app.use(controller());

app.listen(3000);

console.log('app started at port 3000...');

/*__dirname：C:\Users\zirong\Desktop\learn-js\view-koa
dir:C:\Users\zirong\Desktop\learn-js\view-koa/static
Process controllers: index.js...
Process controllers: signin.js...
app started at port 3000...
Process GET /...
扫描的本地文件夹：/static
request中的path路径：/
Process GET /static/css/bootstrap.css...
扫描的本地文件夹：/static
request中的path路径：/static/css/bootstrap.css
当前文件所在本地路径:C:\Users\zirong\Desktop\learn-js\view-koa/static
请求文件本地完整路径:C:\Users\zirong\Desktop\learn-js\view-koa\static\css\bootstrap.css
文件存在
Process GET /static/js/bootstrap.js...
扫描的本地文件夹：/static
request中的path路径：/static/js/bootstrap.js
当前文件所在本地路径:C:\Users\zirong\Desktop\learn-js\view-koa/static
请求文件本地完整路径:C:\Users\zirong\Desktop\learn-js\view-koa\static\js\bootstrap.js
文件存在
Process GET /static/fonts/glyphicons-halflings-regular.woff2...
扫描的本地文件夹：/static
request中的path路径：/static/fonts/glyphicons-halflings-regular.woff2
当前文件所在本地路径:C:\Users\zirong\Desktop\learn-js\view-koa/static
请求文件本地完整路径:C:\Users\zirong\Desktop\learn-js\view-koa\static\fonts\glyphicons-halflings-regular.woff2
文件存在
Process GET /static/css/bootstrap.css.map...
扫描的本地文件夹：/static
request中的path路径：/static/css/bootstrap.css.map
当前文件所在本地路径:C:\Users\zirong\Desktop\learn-js\view-koa/static
请求文件本地完整路径:C:\Users\zirong\Desktop\learn-js\view-koa\static\css\bootstrap.css.map
文件存在*/
