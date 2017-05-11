// 模板
// 目的是使 ctx.response.body = env.render(view,model)
// 所以自定义方法ctx.render
const nunjucks = require('nunjucks');
function createEnv(path, opts) {
    var 
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path || 'views', {
                noCache: noCache,
                watch: watch
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            }
        );
    
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }

    return env;
}

// 给ctx绑定一个render方法来渲染模板
// 之前一开始的是ctx.response.body = 'html代码'
// 后来nunjucks是s=env.render()
// ctx.render实际上就是构造出 ctx.response.body = env.render()
function templating(path, opts) {
    // 创建nunjucks的env对象
    var env = createEnv(path, opts);
    return async (ctx, next) => {
        // 给ctx绑定render函数
        ctx.render = function (view, model) {
            // Object.assign返回一个对象
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
            // 设置content-type
            ctx.response.type = 'text/html';
        };
        // 继续处理请求
        await next();
    };
}

module.exports = templating;