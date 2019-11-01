class Bridge {
	functionMappings = new WeakMap();

	join = (keyFunc, nextFunc) => {
		this.functionMappings.set(keyFunc, nextFunc);
		return this._apply(keyFunc);
	};

	_apply = keyFunc => {
		const me = this;
		return function() {
			const value = keyFunc(...arguments);
			return me.functionMappings.get(keyFunc)(value);
		};
	};
}

export default Bridge;
