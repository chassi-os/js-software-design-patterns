import Factory from '../../../patterns/creational/factory';

class Dog {}
class Cat {}
class Parrot {
	constructor(breed, age) {
		this.breed = breed;
		this.age = age;
	}
}

describe('Factory tests', () => {
	let factory;
	beforeEach(() => (factory = new Factory()));

	it('should construct with an empty map and enum', () => {
		expect(factory.mappings.size).toBe(0);
		expect(factory.names.length).toBe(0);
	});

	it('should accept enums', () => {
		factory.setEnums(['DOG', 'CAT']);
		expect(factory.names).toEqual(['DOG', 'CAT']);
	});

	it('should set a line', () => {
		factory.setEnums(['DOG', 'CAT']);
		factory.setLine('DOG', Dog);
		expect(factory.mappings.get('DOG')).toEqual(Dog);
	});

	it('should throw an error on no enum name in list when calling setLine', () => {
		factory.setEnums(['CAT']);
		let thrown = false;
		try {
			factory.setLine('DOG', Dog);
		} catch (e) {
			thrown = true;
		}

		expect(thrown).toBe(true);
	});

	it('should get and instance', () => {
		factory.setEnums(['DOG', 'CAT']);
		factory.setLine('DOG', Dog);
		factory.setLine('CAT', Cat);

		const dog = factory.get('DOG');
		const cat = factory.get('CAT');
		expect(dog instanceof Dog).toBe(true);
		expect(cat instanceof Cat).toBe(true);
	});

	it('should get an instance with passing properties', () => {
		factory.setEnums(['PARROT']);
		factory.setLine('PARROT', Parrot);
		const bird = factory.get('PARROT', 'cockatoo', '6 years old');
		expect(bird.breed).toEqual('cockatoo');
		expect(bird.age).toEqual('6 years old');
	});

	it('should throw an exception when no enum name on get', () => {
		let thrown = false;
		try {
			factory.get('FOOBAR');
		} catch (e) {
			thrown = true;
		}
		expect(thrown).toBe(true);
	});

	it('should throw an exception when trying to create an instance of a non-class', () => {
		factory.setEnums(['foobar']);
		factory.setLine('foobar', () => {});
		let thrown = false;
		try {
			factory.get('foobar');
		} catch (e) {
			thrown = true;
		}

		expect(thrown).toBe(true);
	});
});
