class Factory {
	constructor() {
		this.mappings = new Map();
		this.names = [];
	}

	setEnums = (enumNames = []) => {
		this.names = [...enumNames];
	};

	setLine = (enumName, className) => {
		if (!this.names.includes(enumName)) throw new Error(`${enumName} is not well defined in the list provided: ${this.names.join(', ')}`);
		this.mappings.set(enumName, className);
	};

	get = (enumName, args = []) => {
		if (!this.names.includes(enumName)) throw new Error(`${enumName} is not well defined in the list provided: ${this.names.join(', ')}`);
		if (!this.mappings.has(enumName)) throw new Error(`${enumName} isnt mapped to a class`);
		const className = this.mappings.get(enumName);
		let instance;
		try {
			instance = new className(args);
		} catch (e) {
			throw new Error(`${className} doesnt appear to be a class`);
		}
		return instance;
	};
}

export default Factory;
