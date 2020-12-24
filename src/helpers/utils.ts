
export const globalObject = typeof window === 'object'
    ? window
    : typeof global === 'object' ? global : self;


export const UNDEFINED = undefined;


export let forEach: <T>(
    iterable: Iterable<T>,
    callback: (element: T, index: number, iterable: Iterable<T>) => void
) => void;
try {
    forEach = <any> Function('iterable', 'callback', 
        'var i = 0;' +
        'for (var element of iterable) {' +
        '  callback(element, i++, iterable);' +
        '}'
    );
} catch (error) {
    forEach = function (array: [], callback: Function) {
        for (let i = 0, len = array.length; i < len; ++i) {
            callback(array[i], i++, array);
        }
    };
}


export function isFunction(value: unknown): boolean {
    return typeof value === 'function';
}


export function isObject(value: unknown): boolean {
    return value ? typeof value === 'object' || isFunction(value) : false;
}


export function throwTypeError(msg: string): never {
    throw new TypeError(msg);
}


export function throwWhenCallingOnNonObject(method: string): never {
    throwTypeError(`Promise.${method} called on non-object`);
}


export let AggregateError;
if (isFunction(globalObject.AggregateError)) {
    AggregateError = globalObject.AggregateError;
} else {
    AggregateError = function AggregateError(errors, message) {
        this.errors = errors;
        this.message = message;
    };
    AggregateError.prototype = Error.prototype;
}


export let set: (obj: object, key: PropertyKey, val: unknown, readonly?: boolean) => void;
try {
    // In IE 8, `Object.defineProperty` is only effective on `Element` object, 
    // `document` and `window`. The program will throw an exception when 
    // `Object.defineProperty` works with others.
    Object.defineProperty({}, '', {});
    
    set = (obj, key, val, readonly = false) => {
        Object.defineProperty(obj, key, {
            configurable: !readonly,
            value: val,
        });
    };
} catch (error) {
    set = (obj, key, val) => obj[key] = val;
}
