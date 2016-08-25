# clean-decorators

`clean-decorators` is a small utility library to cleanup subscriptions from observables on a method call.

It takes any property that has a `unsubscribe` method. If the property is undefined/null or has no `unsubscribe` method at the time 
of the cleanup. Nothing will happen.

## @Cleanable()

`@Cleanable` defines a cleanable property.

## @Clean()

`@Clean` unsubscribes every property defined by the @Cleanable decorators.

## Example

```typescript
class MyClass {

  @Cleanable() myProperty: any;
  @Cleanable() myProperty2: any;

  constructor () {
    this.myProperty = /* observable.subscribe(() => {}) */
    this.myProperty2 = /* observable2.subscribe(() => {}) */
  }

  @Clean()
  clean () {
    // Now myProperty and myProperty2 are unsubscribed
  }
}
```

## Advanced use

`@Cleanable()` takes `CleanableMetadata` which is an object containing an id. By default, this id is an empty string.
The `@Clean()` decorator also takes an id in his `CleanMetadata` options.

It can be useful if you need two categories of subscriptions that you want to unsubscribe in different methods.

### Example

```typescript
class MyClass {

  @Cleanable({ id: 'a' }) myProperty: any;
  @Cleanable({ id: 'b' }) myProperty2: any;

  constructor () {
    this.myProperty = /* observable.subscribe(() => {}) */
    this.myProperty2 = /* observable2.subscribe(() => {}) */
  }

  @Clean({ id: 'a' })
  cleanA () {
    // Now myProperty is unsubscribed
  }

  @Clean({ id: 'b' })
  cleanB () {
    // Now myProperty2 is unsubscribed
  }
}
```

The `CleanMetadata` decorator also takes a `before` parameter which defines if the decorator runs before the original method or otherwise.
