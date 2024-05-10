// Constructs an immutable object for unit test data with fluent interface
export abstract class Builder<T> {
    protected target?: T;

    build(): T {
        if (!this.target) {
            throw new Error('Builder target is uninitialized');
        }

        return this.target;
    }

    with(key: keyof T, value: T[keyof T]): Builder<T> {
        if (!this.target) {
            throw new Error('Builder target is uninitialized');
        }

        this.target = {
            ...this.target,
            [key]: value,
        };

        return this;
    }
}
