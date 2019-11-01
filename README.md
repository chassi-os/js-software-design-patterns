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
import { Builder} from 'js-software-design-patterns/creational'

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
import { Factory } from 'js-software-design-patterns/creational';
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
Provides a generic lazy initialization pattern function. Any class that has some `set[A-Z][a-zA-Z0-9]*` methods, will have those methods extracted and used to create a new instance the first time any of those methods are called.

```javascript
import { makeLazy } from 'js-software-design-patterns/creational';
import { Dog } from './my-animal-classes';

const lazyDog = makeLazy(Dog); // No instance of Dog created yet.
lazyDog.bark(); // Instance has not been created.
lazyDog.eat(); // Initial instance used, no additional instance created.
```

### Behavioral
Well known behavioral patterns


#### Chain of Responsibility
Implementation of a generic Chain of Responsibility class.

```javascript
import { ChainOfResponsibility } from 'js-software-design-patterns/behavioral';

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

#### Bridge
A take on the well known bridge pattern. Allows for any two methods of class instances to be joined, resulting in a return of an executable function.

```javascript
import { Bridge } from 'js-software-design-patterns/behavioral';

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
