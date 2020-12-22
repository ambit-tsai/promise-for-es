const ES6Promise = require('../../');


describe("Promises/A+ Tests", () => {
    require("promises-aplus-tests").mocha({
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
    });
});
