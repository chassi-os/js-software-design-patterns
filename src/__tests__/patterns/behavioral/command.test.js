import Commander from '../../../patterns/behavioral/command';

describe('Commander tests', () => {
	let commander;

	beforeEach(() => {
		commander = new Commander();
	});

	it('should regesiter something to be commanded', () => {
		const fn = jest.fn();
		commander.register('start', fn);
		expect(commander.commands.size).toBe(1);
		expect(commander.commands.get('start').has(fn)).toBe(true);
	});

	it('should be able to register another execute function under same command', () => {
		const fn1 = jest.fn();
		const fn2 = jest.fn();
		commander.register('start', fn1);
		commander.register('start', fn2);
		expect(commander.commands.size).toBe(1);
		expect(commander.commands.get('start').has(fn1)).toBe(true);
		expect(commander.commands.get('start').has(fn2)).toBe(true);
	});

	it('should be able to register mulitple commands', () => {
		const fn = jest.fn();
		commander.register('a', fn);
		commander.register('b', fn);
		expect(commander.commands.size).toBe(2);
		expect(commander.commands.get('a').has(fn)).toBe(true);
		expect(commander.commands.get('b').has(fn)).toBe(true);
	});

	it('should be able to execute a command', () => {
		const run = jest.fn();
		const dontRun = jest.fn();
		commander.register('a', run);
		commander.register('b', dontRun);
		commander.execute('a', 'foo', 'bar');
		expect(run).toHaveBeenCalledTimes(1);
		expect(run).toHaveBeenCalledWith('foo', 'bar');
		expect(dontRun).toHaveBeenCalledTimes(0);
		const nowRun = dontRun;
		commander.execute('b');
		expect(nowRun).toHaveBeenCalledTimes(1);
		expect(run).toHaveBeenCalledTimes(1);
	});

	it('should have the scope of the passed', () => {
		class Test {
			getScope() {
				this.scope = this;
			}
		}
		const t = new Test();
		commander.register('scopeTest', t.getScope, t);
		commander.execute('scopeTest');
		expect(t.scope).toBe(t);
	});

	it('should have the scope of the commander if no scope is passed', () => {
		const c = new Commander();
		class Test {
			getScope() {
				this.scope = 'commander';
			}
		}
		const t = new Test();
		c.register('scopeTest', t.getScope);
		c.execute('scopeTest');
		expect(c.scope).toEqual('commander');
	});
});
