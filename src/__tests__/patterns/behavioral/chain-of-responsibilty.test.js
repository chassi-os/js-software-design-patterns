import ChainOfResponsibility from '../../../patterns/behavioral/chain-of-responsibility';

class TestChainItem extends ChainOfResponsibility {
	constructor(number = 0) {
		super();
		this.number = number;
	}

	executeOn = (number = 0) => this.number + number;
}

describe('Chain of responsibility tests', () => {
	let testOne;
	let testTwo;
	let testThree;

	beforeEach(() => {
		testOne = new TestChainItem(1);
		testTwo = new TestChainItem(2);
		testThree = new TestChainItem(3);
	});

	it('should construct with an empty chain', () => {
		const testChain = new TestChainItem();
		expect(testChain.next).toBeNull();
	});

	it('should appendNext', () => {
		testOne.appendNext(testTwo);
		testTwo.appendNext(testThree);
		expect(testOne.next).toBe(testTwo);
		expect(testTwo.next).toBe(testThree);
		expect(testThree.next).toBeNull();
	});

	it('should execute', () => {
		testOne.appendNext(testTwo);
		testTwo.appendNext(testThree);
		const resultOne = testOne.execute();
		expect(resultOne).toBe(1 + 2 + 3);
		const resultTwo = testTwo.execute();
		expect(resultTwo).toBe(2 + 3);
		const resultThree = testThree.execute();
		expect(resultThree).toBe(3);
	});
});
