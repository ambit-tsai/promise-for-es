
exports.createIterator = function (elements, methods) {
  let index = 0;
  const iterator = {
    called: false,
    next() {
      iterator.called = true;
      return {
        value: elements[index++],
        done: index > elements.length,
      };
    },
  };
  if (methods) for (const key in methods) iterator[key] = methods[key];
  return iterator;
}

exports.createIterable = function (elements, methods) {
  const iterable = {
    called: false,
    received: false,
    [Symbol.iterator]() {
      iterable.received = true;
      let index = 0;
      const iterator = {
        next() {
          iterable.called = true;
          return {
            value: elements[index++],
            done: index > elements.length,
          };
        },
      };
      if (methods) for (const key in methods) iterator[key] = methods[key];
      return iterator;
    },
  };
  return iterable;
}

exports.includes = function (target, wanted) {
  for (const element of target) if (wanted === element) return true;
  return false;
}

exports.is = function (a, b) {
  // eslint-disable-next-line no-self-compare
  return a === b ? a !== 0 || 1 / a === 1 / b : a != a && b != b;
}

exports.nativeSubclass = (() => {
  try {
    if (Function(`
      'use strict';
      class Subclass extends Object { /* empty */ };
      return new Subclass() instanceof Subclass;
    `)()) return Function('Parent', `
      'use strict';
      return class extends Parent { /* empty */ };
    `);
  } catch { /* empty */ }
})();


// This function is used to force RegExp.prototype[Symbol.*] methods
// to not use the native implementation.
exports.patchRegExp$exec = function (run) {
  return assert => {
    const originalExec = RegExp.prototype.exec;
    // eslint-disable-next-line no-extend-native
    RegExp.prototype.exec = function () {
      return originalExec.apply(this, arguments);
    };
    try {
      return run(assert);
    // In very old IE try / finally does not work without catch.
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      // eslint-disable-next-line no-extend-native
      RegExp.prototype.exec = originalExec;
    }
  };
}


exports.getIteratorMethod = function (it) {
  if (it != undefined) return it[Symbol.iterator]
    || it['@@iterator'];
}