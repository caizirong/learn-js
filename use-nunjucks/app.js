const nunjucks = require('nunjucks');

function createEnv(path, opts) {
    var // 设置参数默认值
        autoescape = opts.autoescape === undefined ? true : opts.autoescape, // 转义处理
        noCache = opts.noCache || false, // 解决性能问题，render模板后有缓存
        watch = opts.watch || false, // 系统自动刷新模板，true时需要依赖包chokidar
        throwOnUndefined = opts.throwOnUndefined || false,

        // env就表示Nunjucks模板引擎对象
        env = new nunjucks.Environment( // (loader, opts)
            new nunjucks.FileSystemLoader(path, { // 文件系统加载器，path就是函数createEnv里的参数path
                noCache: noCache,
                watch:watch
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            }
        );

    // filter就是一个函数,用 | 调用
    // env.addFilter(name, func, [async])

    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }

    return env;
}

var env = createEnv('views', {
    watch:true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(2);
        },
        sayhi: function () {
            return 'Hello';
        }
    }
});

var s = env.render('hello.html', {
    name: '<nunjucks>',
    fruits: ['苹果', '梨子', '香蕉', '车厘子'],
    count: 8,
    firstword: 'greet'
});

console.log(s);

console.log(env.render('extend.html', {
    header: 'Hello',
    body: 'bla bla bla...'
    // footer: 'copyright'
}))