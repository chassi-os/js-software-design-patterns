import Factory from '../creational/factory';

class Publisher {
	constructor(name, ...channels) {
		this.name = name;
		this.channels = channels;
	}

	publish = (channel, data) => this.pubsub.publish(this, channel, data);

	createChannel = channel => this.pubsub.createChannel(this, channel);
}

class Subscriber {
	constructor(name, subscriptions) {
		this.name = name;
		this.subscriptions = subscriptions;
		this.onPublish = () => {};
	}

	subscribe = (publisher, channel) => {
		this.pubsub.subscribe(this, publisher, channel);
	};

	unsubscribe = (publisher, channel) => {
		this.pubsub.unsubscribe(this, publisher, channel);
	};

	setOnPublish = func => {
		this.onPublish = func;
	};
}

const pubSubFactory = new Factory();
pubSubFactory.setEnums(['PUBLISHER', 'SUBSCRIBER']);
pubSubFactory.setLine('PUBLISHER', Publisher);
pubSubFactory.setLine('SUBSCRIBER', Subscriber);

export default class PubSub {
	publishers = new Map();

	subscribe = (subscriber, publisher, channel) => {
		if (!this.publishers.has(publisher)) throw new Error('The publisher provided does not have any channels published.');
		if (!this.publishers.get(publisher).has(channel)) throw new Error(`The publisher provided has not created the channel ${channel}.`);
		this.publishers
			.get(publisher)
			.get(channel)
			.add(subscriber);
	};

	unsubscribe = (subscriber, publisher, channel) => {
		if (!this.publishers.has(publisher)) throw new Error('The publisher provided does not have any channels published.');
		if (!this.publishers.get(publisher).has(channel)) throw new Error(`The publisher provided has not created the channel ${channel}.`);
		this.publishers
			.get(publisher)
			.get(channel)
			.delete(subscriber);
	};

	publish = (publisher, channel, data) => {
		if (!this.publishers.has(publisher)) throw new Error('The publisher provided does not have any channels published.');
		if (!this.publishers.get(publisher).has(channel)) throw new Error(`The publisher provided has not created the channel ${channel}.`);
		this.publishers
			.get(publisher)
			.get(channel)
			.forEach(subscriber => subscriber.onPublish(publisher.name, channel, data));
	};

	createChannel = (publisher, channel) => {
		if (!this.publishers.has(publisher)) this.publishers.set(publisher, new Map([[channel, new Set()]]));
		else this.publishers.get(publisher).set(channel, new Set());
	};

	getPublisher = (name, ...channels) => get(this, 'PUBLISHER', [name, ...channels]);

	getSubscriber = (name, subscriptions = {}) => get(this, 'SUBSCRIBER', [name, subscriptions]);
}

const get = (pubsub, enumName, args = []) => {
	if (enumName === 'PUBLISHER') {
		const [name, ...channels] = args;
		let publisher = [...pubsub.publishers.keys()].find(publisher => publisher.name === name);
		if (publisher) return publisher;
		publisher = pubSubFactory.get(enumName, ...args);
		publisher.pubsub = pubsub;
		publisher.channels.forEach(channel => pubsub.createChannel(publisher, channel));
		return publisher;
	} else if (enumName === 'SUBSCRIBER') {
		const subscriber = pubSubFactory.get(enumName, ...args);
		subscriber.pubsub = pubsub;
		const subscriptionTransactions = new Map();
		Object.keys(subscriber.subscriptions).forEach(name => {
			const publisher = [...pubsub.publishers.keys()].find(publisher => publisher.name === name);
			try {
				subscriber.subscriptions[name].forEach(channel => {
					pubsub.subscribe(subscriber, publisher, channel);
					if (!subscriptionTransactions.has(publisher)) subscriptionTransactions.set(publisher, new Set());
					subscriptionTransactions.get(publisher).add(channel);
				});
			} catch (e) {
				[...subscriptionTransactions.keys()].forEach(publisher => {
					subscriptionTransactions.get(publisher).forEach(channel => {
						pubsub.unsubscribe(subscriber, publisher, channel);
					});
				});
				throw e;
			}
		});
		return subscriber;
	}
};
