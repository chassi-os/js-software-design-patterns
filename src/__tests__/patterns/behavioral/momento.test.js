import Momento from '../../../patterns/behavioral/momento';

describe('Momento tests', () => {
	let momento;
	beforeEach(() => {
		momento = new Momento();
	});

	it('should save only properties of object', () => {
		const obj = {
			propA: 'A',
			funcA: function() {},
		};
		momento.save(obj);
		const state = momento._getState();
		expect(state.propA).toBeDefined();
		expect(state.propA).toBe('A');
		expect(state.funcA).not.toBeDefined();
		const prop = { test: 'test' };
		obj.propA = prop;
		momento.save(obj);
		const nextState = momento._getState();
		expect(nextState.propA).toBe(prop);
	});

	it('should save only properties of classes and subclasses', () => {
		class Parent {
			constructor() {
				this.parentProp = 'A';
			}
			parentFunc() {}
		}
		class Child extends Parent {
			constructor() {
				super();
				this.childProp = 'B';
			}
			childFunc() {}
		}
		const child = new Child();
		momento.save(child);
		const state = momento._getState();
		expect(state.parentProp).toBeDefined();
		expect(state.parentProp).toBe('A');
		expect(state.childProp).toBeDefined();
		expect(state.childProp).toBe('B');
		expect(state.parentFunc).not.toBeDefined();
		expect(state.childFunc).not.toBeDefined();
	});

	it('should not allow another momento to be saved from another instance', () => {
		class FooBar {}
		const foo = new FooBar();
		const bar = new FooBar();
		momento.save(foo);
		let thrown = false;
		try {
			momento.compare = null;
			momento.save(bar);
		} catch (e) {
			thrown = true;
		}
		expect(thrown).toBe(true);
	});

	it('should have momento instance frozen after first save', () => {
		const momento = new Momento();
		expect(Object.isFrozen(momento)).toBe(false);
		const foo = { foo: 'bar' };
		momento.save(foo);
		expect(Object.isFrozen(momento)).toBe(true);
		foo.foo = 'no foo';
		let thrown = false;
		try {
			momento.save(foo);
		} catch (e) {
			thrown = true;
		}
		expect(thrown).toBe(false);
	});

	it('should recover properties of saved object', () => {
		const foo = { foo: 'bar', bar: 'foo' };
		const result = { ...foo };
		momento.save(foo);
		foo.foo = 'no foo';
		delete foo.bar;
		foo.temp = 'temp';
		momento.recover(foo);
		expect(foo).toEqual(result);
	});

	it('should recover properties of an instance', () => {
		class Parent {
			constructor() {
				this.parentProp = 'A';
			}
		}
		class Child extends Parent {
			constructor() {
				super();
				this.childProp = 'B';
				this.foo = 'bar';
			}
		}
		const child = new Child();
		momento.save(child);
		child.childProp = 'C';
		child.parentProp = 'D';
		delete child.foo;
		child.bar = 'foo';
		momento.recover(child);
		expect(child.childProp).toEqual('B');
		expect(child.parentProp).toEqual('A');
		expect(child.foo).toEqual('bar');
		expect(child.bar).not.toBeDefined();
	});

	it('should throw error if retrieving properties of different object', () => {
		const foo = {};
		const bar = {};
		momento.save(foo);
		let thrown = false;
		try {
			momento.recover(bar);
		} catch (e) {
			thrown = e.toString() === 'Error: This momento does not belong to this instance';
		}
		expect(thrown).toBe(true);
	});

	it('should throw error if recovering before save', () => {
		const foo = {};
		let thrown;
		try {
			momento.recover(foo);
		} catch (e) {
			thrown = e.toString() === 'Error: This momento has not been saved';
		}
		expect(thrown).toBe(true);
	});
});
