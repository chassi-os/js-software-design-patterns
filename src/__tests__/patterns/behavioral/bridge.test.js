import Bridge from '../../../patterns/behavioral/bridge';

class TV {
	constructor(name) {
		this.name = name;
	}
	setChannel = channel => `${this.name} had its channel changed to ${channel}`;
}

class Remote {
	channel = 0;
	channelUp = () => {
		this.channel++;
		return this.channel;
	};

	channelDown = () => {
		this.channel--;
		return this.channel;
	};
}

describe('Bridge tests', () => {
	let bridge;
	let remote;
	let tv;

	beforeEach(() => {
		bridge = new Bridge();
		remote = new Remote();
		tv = new TV('Bedroom TV');
	});

	it('should construct with empty mappings', () => {
		// uses a weak map, so checking to make sure that is the case
		expect(bridge.functionMappings instanceof WeakMap).toBe(true);
	});

	it('should bridge 2 class instances functions', () => {
		bridge.join(remote.channelUp, tv.setChannel);
		expect(bridge.functionMappings.get(remote.channelUp)).toBe(tv.setChannel);
	});

	it('should return a function to execute', () => {
		const callable = bridge.join(remote.channelUp, tv.setChannel);
		expect(typeof callable).toEqual('function');
	});

	it('should bridge function calls, returning correct value', () => {
		const channelUp = bridge.join(remote.channelUp, tv.setChannel);
		const channelDown = bridge.join(remote.channelDown, tv.setChannel);
		expect(channelUp()).toBe('Bedroom TV had its channel changed to 1');
		expect(channelDown()).toBe('Bedroom TV had its channel changed to 0');
	});
});
