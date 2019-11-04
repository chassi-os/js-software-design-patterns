const bridge = (keyScope, keyFunc) => ({
	to: (toScope, toFunc) => (...args) => toFunc.apply(toScope, [keyFunc.apply(keyScope, args)]),
});

export default bridge;
