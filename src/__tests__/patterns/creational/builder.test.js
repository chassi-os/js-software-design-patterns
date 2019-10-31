import Builder from '../../../patterns/creational/builder';

class Dog {
	setColor(color) {
		this.color = color;
	}
	getColor() {
		return this.color;
	}
}

describe('Buider class', () => {
	it('should construct, automagically building a builder class for Class passed', () => {
		const builder = new Builder(Dog);
		builder.color = 'purple';
		expect(builder._color).toEqual('purple');
		expect(builder._className).toBe(Dog);
		expect(builder._setterMethods).toEqual(['setColor']);
		expect(builder._classProps).toEqual(['color']);
	});

	it('should build an instance of any instance passed', () => {
		const builder = new Builder(Dog);
		builder.color = 'green';
		const dog = builder.build();
		expect(dog.getColor()).toEqual('green');
	});
});
