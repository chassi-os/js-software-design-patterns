import index from '../../../patterns/behavioral/index';
import fs from 'fs';

describe('behavioral index export tests', () => {
	it('should export', () => {
		expect(index).toBeDefined();
	});

	it('should have all category exports', () => {
		// makes huge assumption tests are being run from root
		const behavioralItems = fs.readdirSync('src/patterns/behavioral');
		const ln = behavioralItems.length - 1;
		expect(ln).toEqual(Object.keys(index).length);
	});
});
