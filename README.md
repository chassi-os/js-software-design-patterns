# JS Software Design Patterns

## TOC
- [Usage](#usage)
- [Categories](#categories)
    - [Creational](#creational)
        - [Builder](#builder)
        - [Factory](#factory)
        - [makeLazy](#makeLazy)
    - [Behavioral](#behavioral)
        - [Chain of Responsibility](#chain-of-responsibility)
        - [Command](#command)
        - [Momento](#momento)
        - [PubSub/Observer](#pubSub-(observer-patter))
    - [Structural](#structural)
        - [Bridge](#bridge)

## Usage
```javascript
import * as patterns from 'js-software-design-patterns';
```

## Categories

### Creational
Well known creational patterns

#### Builder
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

// construct a generic factory
const animalFactory = new Factory();

// factory needs to be fed well defined production lines
animalFactory.setEnums(['CAT', 'DOG', 'PARROT'])

// link the production line keys to the Class that they will construct
animalFactory.setLine('CAT', Cat);
animalFactory.setLine('DOG', Dog);
animalFactory.setLine('PARROT', Parrot);

export default animalFactory;
```

```javascript
import AnimalFactory from './animal-factory'

// have factory construct basic classes
const dog = AnimalFactory.get('DOG');
const cat = AnimalFactory.get('CAT');

// have factory construct class with constructor arguments
const parrot = AnimalFactory.get('PARROT', 'Cockatoo', 6, 'Crackers')
```

#### makeLazy
Provides a generic lazy initialization pattern function. The methods of the class will act as a trigger to instantiate the class. This pattern is especially useful when you need objects in a wide scope but do not know when they will be used or by which instance methods to which the lazy object belongs. Note, methods must be instance methods when constructed; anonymous methods (arrow operators) will not be referenced. Static class methods are obviously spurious to an instance. Class instance properties will not trigger a construction of the instance; use `set` and `get` method instead.

```javascript
import { makeLazy } from 'js-software-design-patterns';

class Dog {
    bark(){ console.log('bark!!!') }
    eat(){ }
    sleep: () => {}
    set age(age){ this._age = age }
    get age(){ return this._age }
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


// example of failure where arrow operators will not work
const brokenLazyDog = makeLazy(Dog);
brokenLazyDog.sleep();
// expected output - sleep is not defined


// example of using set and get syntax
const blueDog = makeLazy(Dog);
blueDog.color = 'blue';
const color = blueDog.color;
console.log(color === 'blue');
// expected output - true


// example of getting the actual lazy instance if needed
const instance = lazyDog.getInstance();
console.log(instance instanceof Dog)
// expected output - true
```







### Behavioral
Well known behavioral patterns


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

#### Momento
Implementation of a momento pattern. The momento pattern allows you to save a state of an object or instance and then recover that previously saved state. This mutates the state of the object and will not work on frozen/immutable objects. A single momento instance, once used to save a momento of an originating object, is permanently bound to that originator of the momento and cannot be used by other originating instances.

```javascript
import { Momento } from 'js-software-design-patterns';

const fooBar = {
    foo: 'foo',
    bar: 'bar',
}

const foobarMomento = new Momento();

// Save the current state of fooBar
foobarMomento.save(fooBar);

fooBar.foo = 'bar';

// Now recover the previous state of fooBar
foobarMomento.recover(fooBar)
console.log(fooBar.foo);
// Expected output - foo

delete fooBar.bar;
foobarMomento.recover(fooBar);
console.log(fooBar.bar);
// Expected output - bar

fooBar.fooBar = 'fooBar';
foobarMomento.recover(fooBar);
console.log(fooBar.fooBar);
// Expected output - undefined

fooBar.fooBar = 'fooBar';
foobarMomento.save(fooBar);
foobarMomento.recover(fooBar);
console.log(fooBar);
// Expected output
// {
//      foo: 'foo'
//      bar: 'bar'
//      fooBar: 'fooBar'
// }
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


### Structural
Well known structural patterns

#### Bridge
A take on the well known bridge pattern. Allows for any two methods of class instances to be joined, resulting in a return of an executable function. The `bridge` function takes scope to be applied to a function and then returns a `to` function to join another scope and a function. The `to` function when called then returns an `execute` function that accepts the same argument parameters as the initial function passed to `bridge`. It then calls the first joined function and using its return value as arguments to the second joined function, calls the second, returning its return value.

```javascript
import { bridge } from 'js-software-design-patterns';

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

const to = bridge(remote, remote.changeChannelTo);
const execute = to(tv, tv.changeChannelTo);
execute(20);
// expected output -
//      Remote changing channel to 20.
//      TV set to channel 20.
```


## Change Log

### [NEXT]
    - updates description of how to use momento
    - adds TOC to readme

### v0.5.0
    - fixes export syntax for structural exports
    - adds momento pattern
