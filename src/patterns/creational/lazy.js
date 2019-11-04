export default (klass = {}) => {
	const functions = helper(klass.prototype);
	let instance;

	return functions.reduce((obj, next) => {
		return {
			...obj,
			[next]: () => {
				if (!instance) {
					try {
						instance = new klass();
					} catch (e) {
						throw new Error('The passed "class" is not a class');
					}
				}
				return instance[next](...arguments);
			},
		};
	}, {});
};

const helper = (prototype, methods = []) => {
	if (prototype.constructor.name === 'Object') return methods;
	const properties = Object.getOwnPropertyNames(prototype).filter(name => name !== 'constructor');
	const functions = properties.filter(prop => typeof prototype[prop] === 'function');
	const nextMethods = [...methods, ...functions];
	return helper(prototype.__proto__, nextMethods);
};
