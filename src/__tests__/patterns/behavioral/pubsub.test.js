import PubSub from '../../../patterns/behavioral/pubsub';

describe('PubSub tests', () => {
	let pubsub;
	const publisherChannels = ['TNT', 'FX'];
	const channels = { TNT: publisherChannels };
	beforeEach(() => {
		pubsub = new PubSub();
	});

	it('should get a publisher (factory)', () => {
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		expect(publisher.constructor.name).toBe('Publisher');
		const other = pubsub.getPublisher('TNT');
		expect(other).toBe(publisher);
	});

	it('should get a subscriber (factory)', () => {
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		const subscriber = pubsub.getSubscriber('Tony', channels);
		expect(subscriber.constructor.name).toBe('Subscriber');
		expect(
			pubsub.publishers
				.get(publisher)
				.get('TNT')
				.has(subscriber)
		).toBe(true);
	});

	it('should throw error when you call get, for SUBSCRIBER, with un published channels', () => {
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		let thrown = false;
		try {
			pubsub.getSubscriber('Tony', { ...channels, FOX: ['FOX news'] });
		} catch (e) {
			thrown = true;
		}
		expect(thrown).toBe(true);
	});

	it('should clear transaction when you call get, for SUBSCRIBER, with un published channels', () => {
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		try {
			pubsub.getSubscriber('Tony', { ...channels, FOX: ['FOX news'] });
		} catch (e) {}
		expect(pubsub.publishers.get(publisher).get('TNT').size).toBe(0);
	});

	it('should create a channel with an existing publisher', () => {
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		pubsub.createChannel(publisher, 'newChannel');
		expect(pubsub.publishers.get(publisher).has('newChannel')).toBe(true);
	});

	it('should subscribe to a channel', () => {
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		const subscriber = pubsub.getSubscriber('Tony');
		expect(
			pubsub.publishers
				.get(publisher)
				.get('TNT')
				.has(subscriber)
		).toBe(false);
		pubsub.subscribe(subscriber, publisher, 'TNT');
		expect(
			pubsub.publishers
				.get(publisher)
				.get('TNT')
				.has(subscriber)
		).toBe(true);
	});

	it('should unsubscribe from a channel', () => {
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		const subscriber = pubsub.getSubscriber('Tony', { TNT: ['TNT'] });
		pubsub.unsubscribe(subscriber, publisher, 'TNT');
		expect(
			pubsub.publishers
				.get(publisher)
				.get('TNT')
				.has(subscriber)
		).toBe(false);
	});

	it('should publish to a channel', () => {
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		const subscriber = pubsub.getSubscriber('Tony', { TNT: ['TNT'] });
		const handler = jest.fn();
		subscriber.setOnPublish(handler);
		publisher.publish('TNT', 'MESSAGE');
		expect(handler).toBeCalledWith('TNT', 'TNT', 'MESSAGE');
		expect(handler).toHaveBeenCalledTimes(1);
		publisher.publish('TNT', 'message');
		expect(handler).toHaveBeenCalledTimes(2);
	});

	it('should publish through publisher', () => {
		const mock = jest.fn();
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		pubsub.publish = mock;
		publisher.publish('TNT', 'MESSAGE');
		expect(mock).toBeCalledWith(publisher, 'TNT', 'MESSAGE');
	});

	it('should createChannel through publisher', () => {
		const mock = jest.fn();
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		pubsub.createChannel = mock;
		publisher.createChannel('foobar');
		expect(mock).toBeCalledWith(publisher, 'foobar');
	});

	it('should subscribe through subscriber', () => {
		const mock = jest.fn();
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		const subscriber = pubsub.getSubscriber('Tony', { TNT: ['TNT'] });
		pubsub.subscribe = mock;
		subscriber.subscribe(publisher, 'FX');
		expect(mock).toBeCalledWith(subscriber, publisher, 'FX');
	});

	it('should subscribe through subscriber', () => {
		const mock = jest.fn();
		const publisher = pubsub.getPublisher('TNT', ...publisherChannels);
		const subscriber = pubsub.getSubscriber('Tony', { TNT: ['TNT'] });
		pubsub.unsubscribe = mock;
		subscriber.unsubscribe(publisher, 'TNT');
		expect(mock).toBeCalledWith(subscriber, publisher, 'TNT');
	});
});
