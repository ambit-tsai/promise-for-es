import { isFunction, isObject, throwTypeError } from "./utils";


export function newPromiseCapability<T>(constructor: ES6PromiseConstructor): PromiseCapability<T> {
    if (!(isFunction(constructor) && isObject(constructor.prototype))) {
        throwTypeError('call on non-constructor');
    }
    const capability = <PromiseCapability<T>> {};
    capability.Promise = new constructor<T>((resolve, reject) => {
        capability.Resolve = resolve;
        capability.Reject = reject;
    });
    if (!isFunction(capability.Resolve) || !isFunction(capability.Reject)) {
        throwTypeError('Promise resolve or reject function is not callable');
    }
    return capability;
}
