import { createResolvingFunctions } from './helpers/createResolvingFunctions';
import { enqueueJob } from './helpers/enqueueJob';
import { newPromiseCapability } from './helpers/newPromiseCapability';
import { PromiseReactionJob } from './helpers/PromiseReactionJob';
import { throwWhenCallingOnNonObject, isFunction, isObject, set, throwTypeError, forEach, UNDEFINED, AggregateError } from './helpers/utils';


export default class ES6PromiseImpl<T> implements ES6Promise<T> {
    _state: PromiseState
    _fulfillReactions: PromiseReaction<T>[]
    _rejectReactions: PromiseReaction<T>[]
    _result: T
    _isHandled: boolean


    constructor(executor: PromiseExecutor<T>) {
        const promise = this;
        if (!(promise instanceof ES6PromiseImpl)) {
            throwTypeError("call Promise constructor without 'new'");
        }
        if (!isFunction(executor)) {
            throwTypeError('argument is not a function');
        }
        set(promise, '_state', PromiseState.Pending);
        set(promise, '_fulfillReactions', []);
        set(promise, '_rejectReactions', []);
        set(promise, '_result', UNDEFINED);
        set(promise, '_isHandled', false);
        const { resolve, reject } = createResolvingFunctions(promise);
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }


    then<U, V>(
        onFulfilled?: (value: T) => U | ES6Promise<U>,
        onRejected?: (reason: T) => V | ES6Promise<V>
    ): ES6Promise<U | V> {
        const promise = this;
        if (!(promise instanceof ES6PromiseImpl)) {
            throwTypeError('Promise.prototype.then called on incompatible object');
        }
        const resultCapability = newPromiseCapability<U | V>(ES6PromiseImpl);
        const fulfillReaction: PromiseReaction<T, U | V> = {
            Capability: resultCapability,
            Type: 'Fulfill',
            Handler: isFunction(onFulfilled) ? onFulfilled : UNDEFINED,
        };
        const rejectReaction: PromiseReaction<T, U | V> = {
            Capability: resultCapability,
            Type: 'Reject',
            Handler: isFunction(onRejected) ? onRejected : UNDEFINED,
        };
        if (promise._state === PromiseState.Pending) {
            promise._fulfillReactions.push(fulfillReaction);
            promise._rejectReactions.push(rejectReaction);
        } else if (promise._state === PromiseState.Fulfilled) {
            enqueueJob(PromiseReactionJob, [fulfillReaction, promise._result]);
        } else {
            if (!promise._isHandled) {
                // TODO: unhandledrejection
            }
            enqueueJob(PromiseReactionJob, [rejectReaction, promise._result]);
        }
        set(promise, '_isHandled', true);
        return resultCapability.Promise;
    }
    

    catch<U>(onRejected?: (reason: T) => U | ES6Promise<U>): ES6Promise<U> {
        return this.then(UNDEFINED, onRejected);
    }


    finally(onFinally?: () => void): ES6Promise<T> {
        let thenFinally, catchFinally;
        const context = this;
        if (isFunction(onFinally)) {
            thenFinally = value => {
                const result = onFinally();
                const promise = (<ES6PromiseConstructor> context.constructor).resolve(result);
                return promise.then(() => value);
            };
            catchFinally = reason => {
                const result = onFinally();
                const promise = (<ES6PromiseConstructor> context.constructor).resolve(result);
                return promise.then(() => { throw reason });
            };
        } else {
            thenFinally = onFinally;
            catchFinally = onFinally;
        }
        return context.then(thenFinally, catchFinally);
    }


    toString(): string {
        return '[object Promise]';
    }


    toLocaleString(): string {
        return '[object Promise]';
    }


    static resolve<U>(value?: U | ES6Promise<U>): ES6Promise<U> {
        const context = this;
        if (!isObject(context)) {
            throwWhenCallingOnNonObject('resolve');
        }
        if (isObject(value) && value instanceof context) {
            return value;
        }
        const capability = newPromiseCapability<U>(context); 
        capability.Resolve(value);
        return capability.Promise;
    }
    

    static reject<U>(reason?: U): ES6Promise<U> {
        if (!isObject(this)) {
            throwWhenCallingOnNonObject('reject');
        }
        const capability = newPromiseCapability<U>(this);
        capability.Reject(reason);
        return capability.Promise;
    }

    
    static all<U>(iterable: Iterable<U | ES6Promise<U>>): ES6Promise<U[]> {
        const context = this;
        if (!isObject(context)) {
            throwWhenCallingOnNonObject('all');
        }
        const capability = newPromiseCapability<U[]>(context);
        try {
            let count = 0;
            const result: U[] = [];
            forEach(iterable, (element, i) => {
                count++;
                context.resolve(element).then(value => {
                    result[i] = value;
                    if (!--count) {
                        capability.Resolve(result);
                    }
                }, capability.Reject);
            });
            if (count) {
                result.length = count;
            } else {
                capability.Resolve(result);
            }
        } catch (error) {
            capability.Reject(error);
        }
        return capability.Promise;
    }


    static race<U>(iterable: Iterable<U | ES6Promise<U>>): ES6Promise<U> {
        const context = this;
        if (!isObject(context)) {
            throwWhenCallingOnNonObject('race');
        }
        const capability = newPromiseCapability<U>(context);
        try {
            forEach(iterable, element => {
                context.resolve(element).then(capability.Resolve, capability.Reject);
            });
        } catch (error) {
            capability.Reject(error);
        }
        return capability.Promise;
    }


    static allSettled<U>(iterable: Iterable<U | ES6Promise<U>>): ES6Promise<PromiseSettledResult<U>[]> {
        const context = this;
        if (!isObject(context)) {
            throwWhenCallingOnNonObject('allSettled');
        }
        const capability = newPromiseCapability<PromiseSettledResult<U>[]>(context);
        try {
            let count = 0;
            const result: PromiseSettledResult<U>[] = [];
            forEach(iterable, (element, i) => {
                count++;
                context.resolve(element).then(value => {
                    result[i] = {
                        status: PromiseState.Fulfilled,
                        value,
                    };
                    if (!--count) capability.Resolve(result);
                }, reason => {
                    result[i] = {
                        status: PromiseState.Rejected,
                        reason,
                    };
                    if (!--count) capability.Resolve(result);
                });
            });
            if (count) {
                result.length = count;
            } else {
                capability.Resolve(result);
            }
        } catch (error) {
            capability.Reject(error);
        }
        return capability.Promise;
    }


    static any<U>(iterable: Iterable<U | ES6Promise<U>>): ES6Promise<U> {
        const context = this;
        if (!isObject(context)) {
            throwWhenCallingOnNonObject('any');
        }
        const capability = newPromiseCapability<U>(context);
        try {
            let count = 0;
            const errors = [];
            const message = 'All Promises rejected';
            forEach(iterable, (element, i) => {
                count++;
                context.resolve(element).then(capability.Resolve, reason => {
                    errors[i] = reason;
                    if (!--count) {
                        capability.Reject(new AggregateError(errors, message));
                    }
                });
            });
            if (count) {
                errors.length = count;
            } else {
                capability.Reject(new AggregateError(errors, message));
            }
        } catch (error) {
            capability.Reject(error);
        }
        return capability.Promise;
    }

}
