
declare interface ES6Promise<T> extends PromiseLike<T> {
    _state: PromiseState;
    _fulfillReactions: PromiseReaction<T>[];
    _rejectReactions: PromiseReaction<T>[];
    _result: T
    _isHandled: boolean;
    then<U, V>(
        onFulfilled?: (value: T) => U | ES6Promise<U>,
        onRejected?: (reason: T) => V | ES6Promise<V>
    ): ES6Promise<U | V>;
    catch<U>(onRejected?: (reason: T) => U | ES6Promise<U>): ES6Promise<U>;
    finally(onFinally?: () => void): ES6Promise<T>;
}

declare const enum PromiseState {
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected',
}

declare interface PromiseReaction<T, U = unknown> {
    Capability: PromiseCapability<U>;
    Type: 'Fulfill' | 'Reject';
    Handler: (value: T) => U | ES6Promise<U>;
}

declare interface PromiseCapability<T> {
    Resolve: PromiseResolveFunction<T>;
    Reject: PromiseRejectFunction;
    Promise: ES6Promise<T>;
}

declare type PromiseResolveFunction<T> = (value: T | ES6Promise<T>) => void;
declare type PromiseRejectFunction = (value: unknown) => void;
declare type PromiseExecutor<T> = (resolve?: PromiseResolveFunction<T>, reject?: PromiseRejectFunction) => void

declare interface ES6PromiseConstructor {
    new <T>(executor: PromiseExecutor<T>): ES6Promise<T>;
    resolve<T>(value?: T | ES6Promise<T>): ES6Promise<T>;
    reject<T>(reason?: T): ES6Promise<T>;
    all<T>(iterable: Iterable<T | ES6Promise<T>>): ES6Promise<T[]>;
    race<T>(iterable: Iterable<T | ES6Promise<T>>): ES6Promise<T>;
    allSettled<T>(iterable: Iterable<T | ES6Promise<T>>): ES6Promise<PromiseSettledResult<T>[]>;
    any<T>(iterable: Iterable<T | ES6Promise<T>>): ES6Promise<T>;
}
