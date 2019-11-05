export default class Momento {
	save(obj) {
		if (!this._compare) {
			this._compare = compareInstances(obj);
		}
		const same = this._compare(obj);
		if (!same) throw new Error('This momento does not belong to this instance.');
		else if (!this._getState) this._getState = same;
		if (!Object.isFrozen(this)) Object.freeze(this);
	}

	recover(obj) {
		if (!this._compare) throw new Error('This momento has not been saved');
		if (!this._compare(obj, false)) throw new Error('This momento does not belong to this instance');
		const state = this._getState();
		const propertyNames = getProperties(obj);
		propertyNames.forEach(propertyName => {
			if (state[propertyName] === undefined) delete obj[propertyName];
			obj[propertyName] = state[propertyName];
		});
		Object.keys(state).forEach(key => {
			if (obj[key]) return;
			obj[key] = state[key];
		});
	}
}

const getProperties = (instance, propertyNames = []) => {
	const names = Object.getOwnPropertyNames(instance).filter(name => typeof instance[name] !== 'function');
	if (instance.__proto__.constructor.name === 'Object') return [...propertyNames, ...names];
	return getProperties(instance.__proto__, [...propertyNames, ...names]);
};

const compareInstances = instance => {
	let state = {};
	return (compareTo, update = true) => {
		const same = instance === compareTo;
		if (same && update) {
			const propertyNames = getProperties(instance);
			state = propertyNames.reduce((state, name) => {
				return {
					...state,
					[name]: instance[name],
				};
			}, state);
		}
		if (same) return () => ({ ...state });
	};
};
