# JS Software Patterns

## Usage
```javascript
import * as patterns from 'js-software-design-patterns';
```

## Categories

### Creational
Well known creational patterns

#### Builder Pattern
Used to build classes that have minor changes from instance to instance efficiently. Any class that has a `set[A-Z][a-zA-Z0-9]*` method, will have that method extracted and used to build the instance. Setters should only ever have one property passed.

```javascript
import { Builder} from 'js-software-design-patterns'

const Dog {
    setAge(age){ this.age = age }
    setBreed(breed){ this.breed = breed }
}

const builder = new Builder(Dog);
builder.breed = 'husky';
builder.age = .5;
const puppy = builder.build();
// expected { breed: 'husky', age: .5 }

buider.age = 10;
const adult = builder.build();
// expected { breed: 'husky', age: 10 }
```

#### Factory
Provides a generic factory pattern. Because this is generic and meant to set up another factory of enumerated class instances, a method of `setEnums` is required to make the class strict on what is can instantiate. Also, during setup, a method `setLine` is provided that will associate an item name in the enum list to reference which class it should construct.

```javascript
import { Factory } from 'js-software-design-patterns';
import { Cat, Dog, Parrot } from './my-animal-classes';

const animalFactory = new Factory();

animalFactory.setEnums(['CAT', 'DOG', 'PARROT'])
animalFactory.setLine('CAT', Cat);
animalFactory.setLine('DOG', Dog);
animalFactory.setLine('PARROT', Parrot);

export default animalFactory;
```

```javascript
import AnimalFactory from './animal-factory'
const dog = AnimalFactory.get('DOG');
const cat = AnimalFactory.get('CAT');
const parrot = AnimalFactory.get('PARROT')
```

#### makeLazy
Provides a generic lazy initialization pattern function. The methods of the class will act as a trigger to instantiate the class. This pattern is especially useful when you need objects in a wide scope but do not know when they will be used or by which instance methods to which the lazy object belongs.

```javascript
import { makeLazy } from 'js-software-design-patterns';

class Dog {
    bark: () => console.log('bark!!!')
    eat: () => {}
}

// lazily set up a reference to the constructor
const lazyDog = makeLazy(Dog);

// all Dog methods are available to the lazyDog wrapper. Dog has not been instantiated yet
lazyDog.bark();
// A Dog instance has been created
// Expected output
//  - bark!!!

// from this point on, all methods called belonging to Dog are called from the managed instance
lazyDog.eat();
```

### Behavioral
Well known behavioral patterns

#### Bridge
A take on the well known bridge pattern. Allows for any two methods of class instances to be joined, resulting in a return of an executable function.

```javascript
import { Bridge } from 'js-software-design-patterns';

class Remote {
    changeChannelTo = (channel) => {
        console.log(`Remote changing channel to ${channel}. `)
        return channel;
    }
}

class TV {
    changeChannelTo = (channel) => console.log(`TV set to channel ${channel}.`)
}

const remote = new Remote();
const tv = new TV();
const bridge = new Bridge();

const channelChanger = bridge.join(remote.changeChannelTo, tv.changeChannelTo);


channelChanger(20);
// expected output -
//      Remote changing channel to 20.
//      TV set to channel 20.
```

#### Chain of Responsibility
Implementation of a generic Chain of Responsibility class.

```javascript
import { ChainOfResponsibility } from 'js-software-design-patterns';

class Example extends ChainOfResponsibility {
    constructor(number = 0){
        super();
        this.number = number;
    }

    executeOn = (number = 0) => this.number + number;
}


const one = new Example(1);
const two = new Example(2);

one.appendNext(two);

console.log(one.execute());
// outputs 3

console.log(two.execute());
// outputs 2
```

#### Command Pattern
Implementation of the command pattern using function pointers rather than command objects.

```javascript
import Commander from 'js-software-design-patterns';

const commander = new Commander();

class LightSwitch {
    static turnOn = () => console.log('Turned on the light')
}

class Fan {
    static turnOn = () => console.warn('Turned on the fan')
}

class AC {
    static coolHouse = (temp) => console.log(`Turned down the AC to ${temp}`)
}

commander.register('turn on', LightSwitch.turnOn);
commander.register('turn on', Fan.turnOn);
commander.register('make cooler', AC.coolHouse);
commander.register('make cooler', Fan.turnOn);


// event driven execution
commander.execute('turn on');
// expected output
//  Turned on the light
//  Turned on the fan


// event drive execution
commander.execute('make cooler', 65);
// expected output
//  - Turned down the AC to 65
//  - Turned on the fan
```

#### PubSub (Observer Pattern)
A declarative namespaced pubsub pattern.

```javascript
import { PubSub } from 'js-software-design-patterns';

const pubSub = new PubSub();

const fox = pubSub.getPublisher('Fox Network', 'Fox Sports', 'Fox News');
const espn = pubSub.getPublisher('ESPN Network', 'ESPN College', 'ESPN 2', 'ESPN Ocho');

const subscriber = pubSub.getSubscriber('Sam Subscriber', {'Fox Network': ['Fox Sports'],'ESPN Network': ['ESPN Ocho']});
subscriber.setOnPublish( data => { console.log(data) });

// Positive case
fox.publish('Fox Sports', 'Bears win');
// Expect "Bears win" to be printed

// Negative case
espn.publish('ESPN College', 'Texas loses');
// Expect nothing to happen

// Add and subscribe to channel after it is created.
espn.createChannel('ESPN Golf');
subscriber.subscribe(espn, 'ESPN Golf');

// Unsubscribe from a channel
subscriber.unsubscribe(espn, 'ESPN Golf');

// Calling get publishers on an existing publisher returns the same publisher instance
const sportsChannel = pubSub.getPublisher('ESPN Network');
console.log(sportsChannel === espn);
// Expect true.

// Calling subscriber ALWAYS returns a new instance regardless of the name
const otherSubscriber = pubSub.getSubscriber('Sam Subscriber', {'Fox Network': ['Fox Sports'],'ESPN Network': ['ESPN Ocho']});
console.log(subscriber === otherSubscriber);
// Expect false.

```
