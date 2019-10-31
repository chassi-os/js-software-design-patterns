import index from '../../../patterns/structural/index';
import fs from 'fs';

describe('structural index export tests', () => {
	it('should export', () => {
		expect(index).toBeDefined();
	});

	it('should have all category exports', () => {
		// makes huge assumption tests are being run from root
		const structuralItems = fs.readdirSync('src/patterns/structural');
		const ln = structuralItems.length - 1;
		expect(ln).toEqual(Object.keys(index).length);
	});
});
