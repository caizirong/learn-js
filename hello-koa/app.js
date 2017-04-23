// 导入koa，是一个class，大写
const Koa = require('koa');

// 创建一个Koa对象表示web app本身
const app = new Koa();

app.use(async(ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印url
    await next();
});
app.use(async(ctx, next) => {
    const start = new Date().getTime();
    await next();
    const ms = new Date().getTime() - start;
    // 打印耗费时间
    console.log(`${ctx.request.method} ${ctx.request.url}: ${ms}ms`);
    ctx.response.set('X-Response-Time', `${ms}ms`);
});

// 对于任何请求，app调用该异步函数处理请求
app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});

// app.use(async(ctx, next) => {
//     console.log('1');
//     await next();
//     console.log('1.1');
// });

// app.use(async(ctx, next) => {
//     console.log('2');
//     await next();
//     console.log('2.1');
// })

// app.use(async(ctx, next) => {
//     console.log('3');
//     await next();
//     console.log('3.1');
// })

// 在端口3000监听
app.listen(3000);
console.log('app started at port 3000...');
