export default (klass = {}) => {
	const properties = Object.getOwnPropertyNames(klass.prototype).filter(name => name !== 'constructor');
	const functions = properties.filter(prop => typeof klass.prototype[prop] === 'function');
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
