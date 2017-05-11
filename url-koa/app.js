// 改变url路径能改变输出的HTML：koa-router
// 可以区分post和get请求

// 导入koa，是一个class，大写
const Koa = require('koa');

// 返回一个函数
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');

// 创建一个Koa对象表示web app本身
const app = new Koa();

// log request url
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}`); // 打印url
    await next();
});

// parse request body:
app.use(bodyParser());

// add url-route:
router.get('/hello/:name', async(ctx, next) => {

    var name = ctx.params.name;

    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
})

router.get('/', async(ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"</p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="submit"></p>
        </form>`
})

router.post('/signin', async(ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login Failed</h1>
        <p><a href="/">Try again</a></p>`;
    }
})

// add router middleware
app.use(router.routes()); // 启动koa-router

// 在端口3000监听
app.listen(3000);
console.log('app started at port 3000...');

