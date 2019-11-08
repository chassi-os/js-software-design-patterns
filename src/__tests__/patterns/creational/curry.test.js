import curry from '../../../patterns/creational/curry';

describe('curry tests', () => {
	it('should do basic currying', () => {
		const fn = jest.fn();
		const curried = curry(fn, 'foobar');
		expect(typeof curried).toEqual('function');
		curried();
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('foobar');
	});

	it('should continually curry', () => {
		const fn = jest.fn();
		const initial = curry(fn, 'foo');
		const next = initial('bar');
		const full = next('foobar');
		full();
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('foo', 'bar', 'foobar');
	});

	it('should pass a sanity test', () => {
		const add = (...nums) => nums.reduce((sum, next) => sum + next, 0);
		const addToOne = curry(add, 1);
		const sum = addToOne(2, 3)(4)(5, 6)(7, 8, 9)(10)();
		expect(sum).toBe(1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10);
	});

	it('should just work gracefully if no initial function was passed', () => {
		const fail = curry();
		let crashed = false;
		try {
			fail();
		} catch (e) {
			crashed = true;
		}

		expect(crashed).toBe(false);
	});
});
