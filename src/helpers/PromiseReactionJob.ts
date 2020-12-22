
export function PromiseReactionJob<T, U>(reaction: PromiseReaction<T, U>, value: T) {
    const capability = reaction.Capability;
    const handler = reaction.Handler;
    try {
        let result: U | ES6Promise<U>;
        if (handler) {
            result = handler(value);
        } else if (reaction.Type === 'Reject') {
            throw value;
        } else {
            result = <U><unknown> value;
        }
        capability.Resolve(result);
    } catch (error) {
        capability.Reject(error);
    }
}
