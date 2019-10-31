class Builder {
	constructor(className) {
		this._className = className;
		const instance = new className();
		this._setterMethods = getMethods(instance);
		this._classProps = this._setterMethods.map(name => name.substr(3).toLowerCase());
		this._classProps.forEach(prop => {
			Object.defineProperty(this, prop, {
				set: function(val) {
					this[`_${prop}`] = val;
				},
			});
		});
	}

	build() {
		const instance = new this._className();
		this._setterMethods.forEach((funcName, key) => {
			const prop = this._classProps[key];
			const val = this[`_${prop}`];
			instance[funcName](val);
		});
		return instance;
	}
}

const getMethods = obj => {
	let properties = new Set();
	let currentObj = obj;
	do {
		Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
	} while ((currentObj = Object.getPrototypeOf(currentObj)));
	return [...properties.keys()].filter(item => typeof obj[item] === 'function').filter(func => /^set[A-Z][a-zA-Z0-9]*$/.test(func));
};

export default Builder;
