<a href="https://promisesaplus.com/" target="_blank">
    <img
        title="Promises/A+ 1.1.1 compliant"
        alt="Promises/A+ logo"
        src="https://promisesaplus.com/assets/logo-small.png"
        align="right"
    />
</a>


简体中文 | [English](https://github.com/ambit-tsai/promise-for-es)


# Promise For ES
✨ ES2021 Promise 的实现，使用 ES3 语法拥有超高兼容性，并遵从 ECMA-262 与 Promises/A+ 标准

> 学习 `Promise` 的最佳方式是实现它。

Almost all browsers are supported
基于 ES3 实现的 ES6 Promise 支持几乎所有的浏览器，遵从 ECMA-262 与 Promises/A+ 标准，包含 ES2021 特性。
## 特性
1. 基于 ES3，几乎所有浏览器都受支持；
1. 遵从 ECMA-262 与 Promises/A+ 标准，并通过 Promises/A+ 合规性测试，以及其它相关测试；
1. 实现 ES2018、ES2020、ES2021 中关于 Promise 的新特性；


## 支持情况
|能力|版本|支持|
|-|:-:|:-:|
|**new** Promise(executor)|ES2015|✔|
|Promise.prototype.**then**(onFulfilled, onRejected)|ES2015|✔|
|Promise.prototype.**catch**(onRejected)|ES2015|✔|
|Promise.prototype.**finally**(onFinally)|ES2018|✔|
|Promise.**resolve**(value)|ES2015|✔|
|Promise.**reject**(reason)|ES2015|✔|
|Promise.**all**(iterable)|ES2015|✔|
|Promise.**race**(iterable)|ES2015|✔|
|Promise.**allSettled**(iterable)|ES2020|✔|
|Promise.**any**(iterable)|ES2021|✔|


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


## 核心逻辑
以下面的代码为例：
```javascript
const executor = (resolutionFunc, rejectionFunc) => {
    // 业务逻辑
};
const p1 = new Promise(executor);
p1.then(onFulfilled, onRejected);
```

### p1.then(onFulfilled, onRejected)
1. 创建一个新的 Promise 对象 `p2` ；
1. 检查 `p1` 的状态：
    1. 若是 "pending"，将 `onFulfilled` 添加到 `p1` 的 **fulfill list**，`onRejected` 添加到 **reject list** ；
    1. 若是 "fulfilled"，以 `onFulfilled`、`p2`、`p1` 的结果 新建一个微任务；
    1. 若是 "rejected"，以 `onRejected`、`p2`、`p1` 的结果 新建一个微任务；
1. 返回 `p2` ;

### new Promise(executor)
1. 创建解析函数：`resolutionFunc`、`rejectionFunc` ；
2. 以 `resolutionFunc`、`rejectionFunc` 作为参数调用 `executor`;

### resolutionFunc(value)
1. 若任意解析函数已被调用，返回；
1. 若 `value` 是 **thenable**，以 `value` 新建一个微任务，并返回；
1. 改变 `p1` 的状态为 "**fulfilled**"；
1. 为 **fulfill list** 的每个元素新建一个微任务；

### rejectionFunc(reason)
1. 若任意解析函数已被调用，返回；
1. 改变 `p1` 的状态为 "**rejected**"；
1. 为 **reject list** 的每个元素新建一个微任务；


## 测试
1. `npm run test:aplus` 运行 Promises/A+ 合规性测试；
1. `npm run test:es6` 运行 <a href="https://github.com/promises-es6/promises-es6" target="_blank">promises-es6-tests</a>；
1. `npm run test:core-js` 运行 <a href="https://github.com/zloirock/core-js/tree/master/tests/pure" target="_blank">core-js</a> 关于 Promise 的相关测试；


## 参考
1. <a href="https://www.ecma-international.org/ecma-262/11.0/index.html#sec-promise-objects" target="_blank">ECMA-262</a>
1. <a href="https://promisesaplus.com/" target="_blank">Promises/A+</a>
