import makeLazy from '../../../patterns/creational/lazy';

class Dog {
	bark() {}
	growl() {}
	setAge(age) {
		this.age = age;
	}
	getAge() {
		return this.age;
	}
	set color(color) {
		this._color = color;
	}
	get color() {
		return this._color;
	}
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

	it('should handle setters and getter methods', () => {
		const dog = makeLazy(Dog);
		dog.setAge(5);
		const age = dog.getAge();
		expect(age).toEqual(5);
	});

	it('should handle setter/getter sugar helpers', () => {
		const dog = makeLazy(Dog);
		dog.color = 'blue';
		const color = dog.color;
		expect(color).toEqual('blue');
	});
});
