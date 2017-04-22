'use strict';
var s = 'Hello';

function greet(name) {
    console.log(s + ',' + name + '!');
}

function sayHi() {
    console.log('Hi');
}

module.exports = {
    greet,
    sayHi
} // 把函数greet作为模块的输出暴露出去