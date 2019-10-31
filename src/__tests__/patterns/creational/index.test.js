import index from '../../../patterns/creational/index';
import fs from 'fs';

describe('creational index export tests', () => {
	it('should export', () => {
		expect(index).toBeDefined();
	});

	it('should have all category exports', () => {
		// makes huge assumption tests are being run from root
		const creationalItems = fs.readdirSync('src/patterns/creational');
		const ln = creationalItems.length - 1;
		expect(ln).toEqual(Object.keys(index).length);
	});
});
