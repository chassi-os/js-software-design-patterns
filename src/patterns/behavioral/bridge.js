class Bridge {
	functionMappings = new Map();

	join = (keyFunc, nextFunc) => {
		this.functionMappings.set(keyFunc.name, nextFunc);
		const me = this;
		return (...args) => {
			const value = keyFunc(args);
			return me.functionMappings.get(keyFunc.name)(value);
		};
	};

	_apply = keyFunc => {
		const me = this;
		return (...args) => {
			const value = keyFunc(args);
			return me.functionMappings.get(keyFunc.name)(value);
		};
	};
}

export default Bridge;
