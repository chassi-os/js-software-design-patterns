import makeLazy from '../../../patterns/creational/lazy';

class Dog {
	bark() {}
	growl() {}
}

describe('Lazy test', () => {
	it('should return all methods of passed class', () => {
		const lazyDog = makeLazy(Dog);
		expect(lazyDog.bark).toBeDefined();
		expect(lazyDog.growl).toBeDefined();
	});

	it('should call constructor once on first fuction call', () => {
		const mock = jest.fn();
		mock.prototype.bark = Dog.prototype.bark;
		mock.prototype.growl = Dog.prototype.growl;
		const lazyDog = makeLazy(mock);
		expect(mock.mock.instances).toHaveLength(0);
		lazyDog.bark();
		expect(mock.mock.instances).toHaveLength(1);
		lazyDog.growl();
		lazyDog.bark();
		expect(mock.mock.instances).toHaveLength(1);
	});

	it('should throw error if it is passed an object with prototype in it', () => {
		let thrown = false;
		const lazyDog = makeLazy({ prototype: {} });
		try {
			lazyDog.bark();
		} catch (e) {
			thrown = true;
		}
		expect(thrown).toBe(true);
	});

	it('should be able to handle subclassing', () => {
		class Poodle extends Dog {}
		const lazyPoodle = makeLazy(Poodle);
		expect(lazyPoodle.bark).toBeDefined();
		expect(lazyPoodle.growl).toBeDefined();
	});
});
