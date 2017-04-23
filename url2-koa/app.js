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
app.use(controller());

app.listen(3000);

console.log('app started at port 3000...');