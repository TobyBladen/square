import { Builder } from './builder.class';

type Person = Readonly<{
    age: number;
    name: string;
}>;

const defaultPerson: Person = {
    age: 30,
    name: 'Simon',
};

class PersonBuilder extends Builder<Person> {
    constructor() {
        super();

        this.target = defaultPerson;
    }

    removeTarget(): PersonBuilder {
        this.target = undefined;
        return this;
    }
}

class BrokenBuilder extends Builder<Person> {}

describe('builder', () => {
    it('should build a person', () => {
        const person = new PersonBuilder().build();

        expect(person).toEqual({
            age: 30,
            name: 'Simon',
        });
    });

    it('should build a person with a different name', () => {
        const person = new PersonBuilder().with('name', 'John').build();

        expect(person).toEqual({
            age: 30,
            name: 'John',
        });
    });

    it('should build a person with a different age', () => {
        const person = new PersonBuilder().with('age', 40).build();

        expect(person).toEqual({
            age: 40,
            name: 'Simon',
        });
    });

    it('should throw an error if the target is not initialized', () => {
        expect(() => {
            new BrokenBuilder().with('name', 'Linda').build();
        }).toThrowError('Builder target is uninitialized');
    });
});
