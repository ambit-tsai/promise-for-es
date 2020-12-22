import { globalObject, UNDEFINED } from "./utils";


// @ts-ignore: the property "WebKitMutationObserver" is unrecognized
let MutationObserver = globalObject.MutationObserver || globalObject.WebKitMutationObserver;
export let enqueueJob: (callback: Function, args: unknown[]) => void;


if (MutationObserver) {
    enqueueJob = (callback, args) => {
        const observer = new MutationObserver(() => {
            callback.apply(UNDEFINED, args);
            observer.disconnect();
        });
        const el = document.createElement('a');
        observer.observe(el, { attributes: true });
        el.setAttribute('b', '');
    };
} else {
    enqueueJob = (callback, args) => {
        setTimeout(() => callback.apply(UNDEFINED, args));
    };
}
