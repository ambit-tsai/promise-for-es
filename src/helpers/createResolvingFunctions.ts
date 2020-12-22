import { enqueueJob } from "./enqueueJob";
import { PromiseReactionJob } from "./PromiseReactionJob";
import { isFunction, isObject, set, throwTypeError, UNDEFINED } from "./utils";


export function createResolvingFunctions<T>(promise: ES6Promise<T>): {
    resolve: PromiseResolveFunction<T>,
    reject: PromiseRejectFunction,
} {
    let alreadyResolved = false;
    return {
        resolve(resolution) {
            if (alreadyResolved) return;
            alreadyResolved = true;
            try {
                if (resolution === promise) {
                    throwTypeError('Chaining cycle detected for promise');
                }
                if (isObject(resolution)) {
                    const then = (<any> resolution).then;
                    if (isFunction(then)) {
                        enqueueJob(PromiseResolveThenableJob, [promise, resolution, then]);
                        return;
                    }
                }
                fulfillPromise(promise, resolution as T);
            } catch (error) {
                rejectPromise(promise, error);
            }
        },

        reject(reason) {
            if (!alreadyResolved) {
                alreadyResolved = true;
                rejectPromise(promise, reason);
            }
        },
    };
}


function  fulfillPromise<T>(promise: ES6Promise<T>, value: T) {
    set(promise, '_state', PromiseState.Fulfilled, true);
    set(promise, '_result', value, true);
    const reactions = promise._fulfillReactions;
    set(promise, '_fulfillReactions', UNDEFINED, true);
    set(promise, '_rejectReactions', UNDEFINED, true);
    triggerPromiseReactions(reactions, value);
}


function rejectPromise<T>(promise: ES6Promise<T>, reason: unknown) {
    set(promise, '_state', PromiseState.Rejected, true);
    set(promise, '_result', reason, true);
    const reactions = promise._rejectReactions;
    set(promise, '_fulfillReactions', UNDEFINED, true);
    set(promise, '_rejectReactions', UNDEFINED, true);
    if (!promise._isHandled) {
        // TODO: rejectionhandled
    }
    triggerPromiseReactions(reactions, reason);
}


function triggerPromiseReactions<T>(reactions: PromiseReaction<T>[], value: T) {
    for (const reaction of reactions) {
        enqueueJob(PromiseReactionJob, [reaction, value]);
    }
}


function PromiseResolveThenableJob<T>(promise: ES6Promise<T>, thenable: PromiseLike<T>, then: Function) {
    const { resolve, reject } = createResolvingFunctions(promise);
    try {
        then.call(thenable, resolve, reject);
    } catch (error) {
        reject(error);
    }
}
