import index from '../index';
import fs from 'fs';

describe('index export tests', () => {
	it('should export', () => {
		expect(index).toBeDefined();
	});

	it('should have all category exports flattened into individual exports', () => {
		// makes huge assumption tests are being run from root
		const behavioralItems = fs.readdirSync('src/patterns/behavioral');
		const creationalItems = fs.readdirSync('src/patterns/creational');
		const structuralItems = fs.readdirSync('src/patterns/structural');

		// add one for default export
		const ln = behavioralItems.length + creationalItems.length + structuralItems.length - 3 + 1;
		expect(ln).toEqual(Object.keys(index).length);
	});
});
