<a href="https://promisesaplus.com/">
    <img
        title="Promises/A+ 1.1.1 compliant"
        alt="Promises/A+ logo"
        src="https://promisesaplus.com/assets/logo-small.png"
        align="right"
    />
</a>


简体中文 | [English](https://github.com/ambit-tsai/promise-for-es)


# Promise For ES
✨ 基于 ES3 实现的 ES6 Promise 支持几乎所有的浏览器，遵从 ECMA-262 与 Promises/A+ 标准，包含 ES2021 特性。


> 学习 `Promise` 的最佳方式是实现它。


## 支持
|特性|支持|
|-|:-:|
|new Promise(*executor*)|✔|
|Promise.prototype.then(*onFulfilled, onRejected*)|✔|
|Promise.prototype.catch(*onRejected*)|✔|
|Promise.prototype.finally(*onFinally*)|✔|
|Promise.resolve(*value*)|✔|
|Promise.reject(*reason*)|✔|
|Promise.all(*iterable*)|✔|
|Promise.race(*iterable*)|✔|
|Promise.allSettled(*iterable*)|✔|
|Promise.any(*iterable*)|✔|


## 安装
```
npm i -S promise-for-es
```


## 使用
1. 作为 po**l**yfill
```javascript
// ES Module
import 'promise-for-es/polyfill';
```
```javascript
// CommonJS
require('promise-for-es/polyfill');
```
2. 作为 po**n**yfill
```javascript
// ES Module
import Promise from 'promise-for-es';
```
```javascript
// CommonJS
const Promise = require('promise-for-es');
```


## 测试
1. `npm run test:aplus` 运行 Promises/A+ 合规性测试;
1. `npm run test:es6` 运行 <a href="https://github.com/promises-es6/promises-es6" target="_blank">promises-es6-tests</a>;
1. `npm run test:core-js` 运行 <a href="https://github.com/zloirock/core-js/tree/master/tests/pure" target="_blank">core-js</a> 关于 Promise 的相关测试;


## 参考
1. <a href="https://www.ecma-international.org/ecma-262/11.0/index.html#sec-promise" target="_blank">ECMA-262</a>
1. <a href="https://promisesaplus.com/" target="_blank">Promises/A+</a>
