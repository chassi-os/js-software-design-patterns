import bridge from '../../../patterns/behavioral/bridge';

class TV {
	constructor(name) {
		this.name = name;
	}
	setChannel(channel) {
		return `${this.name} had its channel changed to ${channel}`;
	}
}

class Remote {
	constructor() {
		this.channel = 0;
	}

	channelUp() {
		this.channel++;
		return this.channel;
	}

	channelDown() {
		this.channel--;
		return this.channel;
	}

	jumpToChannel(channel) {
		this.channel = channel;
		return this.channel;
	}
}

describe('Bridge tests', () => {
	let remote;
	let tv;

	beforeEach(() => {
		remote = new Remote();
		tv = new TV('Bedroom TV');
	});

	it('should return a function to execute', () => {
		const callable = bridge(remote, remote.channelUp).to(tv, tv.setChannel);
		expect(typeof callable).toEqual('function');
	});

	it('should bridge function calls, returning correct value', () => {
		const channelUp = bridge(remote, remote.channelUp).to(tv, tv.setChannel);
		const channelDown = bridge(remote, remote.channelDown).to(tv, tv.setChannel);
		expect(channelUp()).toBe('Bedroom TV had its channel changed to 1');
		expect(channelDown()).toBe('Bedroom TV had its channel changed to 0');
	});

	it('should accept arguments with return callable function', () => {
		const changeTo = bridge(remote, remote.jumpToChannel).to(tv, tv.setChannel);
		expect(changeTo(20)).toBe('Bedroom TV had its channel changed to 20');
	});
});
