# JS Software Patterns

## Usage
```javascript
import * as patterns from '@chassi-os/js-software-patterns';
```


## Categories

### Creational
Well known creational patterns

#### Builder Pattern
Used to build classes that have minor changes from instance to instance efficiently. Any class that has a `set[A-Z][a-zA-Z0-9]*` method, will have that method extracted and used to build the instance. Setters should only every have one property passed.

```javascript
import { Builder} from '@chassi-os/js-software-patterns/Creational'

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
