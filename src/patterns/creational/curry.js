export default (fn = () => {}, ...args) => {
	let curriedArgs = [...args];
	const curry = (...nextArgs) => {
		if (!nextArgs.length) return fn(...curriedArgs);
		curriedArgs = [...curriedArgs, ...nextArgs];
		return curry;
	};
	return curry;
};
