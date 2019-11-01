class ChainOfResponsibility {
	constructor() {
		this.next = null;
	}

	appendNext(next) {
		this.next = next;
	}

	executeOn = () => {};

	execute = previousValues => {
		const val = this.executeOn(previousValues);
		if (!this.next) return val;
		return this.next.execute(val);
	};
}

export default ChainOfResponsibility;
