class Commander {
	commands = new Map();

	register = (command, executeFunc) => {
		if (!this.commands.has(command)) this.commands.set(command, new Set());
		this.commands.get(command).add(executeFunc);
	};

	execute = (command, ...args) => {
		if (!this.commands.has(command)) throw new Error(`The command '${command}' you are trying to execute doesnt exist`);
		const funcs = this.commands.get(command);
		funcs.forEach(func => func.apply(this, args));
	};
}

export default Commander;
