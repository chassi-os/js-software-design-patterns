const bridge = (keyScope, keyFunc) => (toScope, toFunc) => (...args) => toFunc.apply(toScope, [keyFunc.apply(keyScope, args)]);

export default bridge;
