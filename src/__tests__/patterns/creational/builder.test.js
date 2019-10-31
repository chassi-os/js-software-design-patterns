import Builder from '../../../patterns/creational/builder';

class Dog {
	setColor(color) {
		this.color = color;
	}
	setBreed(breed) {
		this.breed = breed;
	}
	getColor() {
		return this.color;
	}
	getBreed() {
		return this.breed;
	}
}

describe('Buider class', () => {
	it('should construct, automagically building a builder class for Class passed', () => {
		const builder = new Builder(Dog);
		builder.color = 'purple';
		expect(builder._color).toEqual('purple');
		expect(builder._className).toBe(Dog);
		expect(builder._setterMethods).toEqual(['setColor', 'setBreed']);
		expect(builder._classProps).toEqual(['color', 'breed']);
	});

	it('should build an instance of any instance passed', () => {
		const builder = new Builder(Dog);
		builder.breed = 'husky';
		builder.color = 'green';
		const dog = builder.build();
		expect(dog.getColor()).toEqual('green');
		expect(dog.getBreed()).toEqual('husky');
		builder.color = 'blue';
		const blueDog = builder.build();
		expect(blueDog.getColor()).toEqual('blue');
		expect(blueDog.getBreed()).toEqual('husky');
	});
});
