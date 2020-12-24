<a href="https://promisesaplus.com/">
    <img
        title="Promises/A+ 1.1.1 compliant"
        alt="Promises/A+ logo"
        src="https://promisesaplus.com/assets/logo-small.png"
        align="right"
    />
</a>


[简体中文](https://gitee.com/ambit/promise-for-es) | English


# Promise For ES
✨ A ES2021 Promise implementation based on ES3 has high compatibility, and comply with ECMA-262 and Promises/A+

> The best way to learn `Promise` is to implement it.


## Feature
1. Base on ES3, almost all browsers are supported;
1. Comply with ECMA-262 and Promises/A+, pass the Promises/A+ compliance test, and other related tests;
1. Implement the new features about Promise of ES2018、ES2020、ES2021;


## Support
|Ability|Version|Support|
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


## Install
```
npm i -S promise-for-es
```


## Usage
1. As a po**l**yfill
```javascript
// ES Module
import 'promise-for-es/polyfill';
```
```javascript
// CommonJS
require('promise-for-es/polyfill');
```
2. As a po**n**yfill
```javascript
// ES Module
import Promise from 'promise-for-es';
```
```javascript
// CommonJS
const Promise = require('promise-for-es');
```


## Core logic
Using the example below:
```javascript
const executor = (resolutionFunc, rejectionFunc) => {
    // business logic
};
const p1 = new Promise(executor);
p1.then(onFulfilled, onRejected);
```

### p1.then(onFulfilled, onRejected)
1. Create a new Promise object `p2` ;
1. Check the state of `p1` :
    1. If "**pending**", push `onFulfilled` into the **fulfill list** of `p1`, and push `onRejected` into the **reject list**;
    1. If "**fulfilled**", create a micro task with `onFulfilled`, `p2` and the **result** of `p1` ;
    1. If "**rejected**", create a micro task with `onRejected`, `p2` and the **result** of `p1` ;
1. return `p2` ;

### new Promise(executor)
1. Create the resolving functions: `resolutionFunc`, `rejectionFunc` ;
2. Call `executor` with `resolutionFunc` and `rejectionFunc` as the arguments;

### resolutionFunc(value)
1. If any resolving function has been called, return;
1. If `value` is **thenable**, create a micro task with `value`, return;
1. Change the state of `p1` to "**fulfilled**";
1. Create a micro task for each element of **fulfill list**;

### rejectionFunc(reason)
1. If any resolving function has been called, return;
1. Change the state of `p1` to "**rejected**";
1. Create a micro task for each element of **reject list**;


## Test
1. `npm run test:aplus` to run Promises/A+ compliance test;
1. `npm run test:es6` to run <a href="https://github.com/promises-es6/promises-es6" target="_blank">promises-es6-tests</a>;
1. `npm run test:core-js` to run the <a href="https://github.com/zloirock/core-js/tree/master/tests/pure" target="_blank">core-js</a> tests about Promise;


## Reference
1. <a href="https://www.ecma-international.org/ecma-262/11.0/index.html#sec-promise-objects" target="_blank">ECMA-262</a>
1. <a href="https://promisesaplus.com/" target="_blank">Promises/A+</a>
