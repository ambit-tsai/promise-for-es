const ES6Promise = require('../..');
const assert = require('assert');


describe("Promises ES6 Tests", () => {
    require("promises-es6-tests").mocha({
        resolved(value) {
            return ES6Promise.resolve(value);
        },
        rejected(reason) {
            return ES6Promise.reject(reason);
        },
        deferred() {
            const capability = {};
            capability.promise = new ES6Promise((resolve, reject) => {
                capability.resolve = resolve;
                capability.reject = reject;
            });
            return capability;
        },
        defineGlobalPromise(globalScope) {
            globalScope._Promise = globalScope.Promise;
            globalScope.Promise = ES6Promise;
            globalScope.assert = assert;
        },
        removeGlobalPromise(globalScope) {
            globalScope.Promise = globalScope._Promise;
            delete globalScope._Promise;
        },
    });
});
