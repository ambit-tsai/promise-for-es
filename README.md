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
✨ A ES6 Promise implementation based on **ES3**, support almost all browsers at present, comply with ECMA-262 and Promises/A+, include ES2021.


> The best way to learn `Promise` is to implement it.


## Support
|Feature|Support|
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


## Install
```
npm i -S promise-for-es
```


## Usage
1. As po**l**yfill
```javascript
// ES Module
import 'promise-for-es/polyfill';
```
```javascript
// CommonJS
require('promise-for-es/polyfill');
```
2. As po**n**yfill
```javascript
// ES Module
import Promise from 'promise-for-es';
```
```javascript
// CommonJS
const Promise = require('promise-for-es');
```


## Test
1. `npm run test:aplus` to run Promises/A+ compliance test;
1. `npm run test:es6` to run <a href="https://github.com/promises-es6/promises-es6" target="_blank">promises-es6-tests</a>;
1. `npm run test:core-js` to run the <a href="https://github.com/zloirock/core-js/tree/master/tests/pure" target="_blank">core-js</a> tests about Promise;



## Reference
1. <a href="https://www.ecma-international.org/ecma-262/11.0/index.html#sec-promise-objects" target="_blank">ECMA-262</a>
1. <a href="https://promisesaplus.com/" target="_blank">Promises/A+</a>
