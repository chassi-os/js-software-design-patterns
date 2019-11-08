class Commander {
	commands = new Map();
	scopes = new WeakMap();
	register = (command, executeFunc, scope) => {
		if (!this.commands.has(command)) {
			this.commands.set(command, new Set());
		}
		this.commands.get(command).add(executeFunc);
		const appliedScope = scope || this;
		this.scopes.set(executeFunc, appliedScope);
	};

	execute = (command, ...args) => {
		if (!this.commands.has(command)) throw new Error(`The command '${command}' you are trying to execute doesnt exist`);
		const funcs = this.commands.get(command);
		funcs.forEach(func => func.apply(this.scopes.get(func), args));
	};
}

export default Commander;
