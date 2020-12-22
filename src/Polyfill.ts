import { globalObject } from "./helpers/utils";
import ES6PromiseImpl from "./ES6PromiseImpl";


if (globalObject.Promise) {
    for (const key in ES6PromiseImpl) {
        if (!(key in Promise)) {
            Promise[key] = ES6PromiseImpl[key];
        }
    }
    for (const key in ES6PromiseImpl.prototype) {
        if (!(key in Promise.prototype)) {
            Promise.prototype[key] = ES6PromiseImpl.prototype[key];
        }
    }
} else {
    // @ts-ignore
    globalObject.Promise = ES6PromiseImpl;
}