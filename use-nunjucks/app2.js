const nunjucks = require('nunjucks');

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwUndefined = opts.throwUndefined || false,
        env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path, {
            watch: watch,
            noCache: noCache
        }), {
            autoescape: autoescape,
            noCache: noCache,
            watch: watch,
            throwOnUndefined: throwUndefined
        });

    if (opts.filters) {

        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }

    return env;
    
}

var env = createEnv('views', {
    autoescape: true,
    noCache: false,
    filters: {
        hex: function (n) {
            return n+1;
        },
        sayhi: function () {return 'Hello'}
    }
})

var s = env.render('hello.html', {
    name: 'caizirong',
    fruits: ['apple', 'pear', 'banana', 'potato'],
    count: 10,
    firstword: 'Good Morning!'
})

console.log(s)