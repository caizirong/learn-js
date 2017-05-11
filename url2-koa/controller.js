const fs = require('fs');
function addController(router, dir) {
    var files = fs.readdirSync(__dirname + '/' + dir);
    var js_files = files.filter((f) => {
        return f.endsWith('.js');  // 找出controllers目录下所有js文件
    })
    for (var f of js_files) {
        console.log(`Process controllers: ${f}...`);
        let mapping = require(__dirname + '/' + dir + '/' + f); // mapping：controllers下每个js文件就是一个模块，暴露出的接口就是mapping，所以mapping是一个对象
        addMapping(router, mapping);
    }
}

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
        } else {
            console.log(`invalid url: ${url}`);
        }
    }
}
module.exports = function (dir) {
    let controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    addController(router, controllers_dir);
    return router.routes(); // 启动koa-router
}