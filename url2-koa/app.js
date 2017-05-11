/*模块化
处理多种请求
处理请求的函数卸载controllers目录里，分多个文件，然后暴露出接口，这样就避免了在同一个文件里写router.get('/', async(ctx, next)=>{..}以及router.post（）等情况)，把router.get写在controller.js的addmapping中
之后要更改方法只需要更改controllers目录下的文件即可
app.js及controller.js不用更改
*/


// 定义模块
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const app = new Koa();

// log request url:
console.log(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
})

// parse request body:
app.use(bodyParser());

// add controllers:
app.use(controller()); // 启动koa-router

app.listen(3000);

console.log('app started at port 3000...');