# Restrict

```
meteor add ivansglazunov:restrict
```

It allows you to easily add their own restrictions into allow or deny.
Methods for the easy validation.

## Usage

```js
Collection = new Mongo.Collection(null);
Collection.attachRestriction('jump');
Collection.deny({
    insert: function(userId, document) {
        Collection.validateRestrictions('jump', userId, document);
    },
    jump: function(userId, document) {
        if (document.jumping) return true;
        else return false;
    }
});
Collection.insert({});
Collection.insert({ jumping: true }); // jump failed: Access denied
Collection.validateRestrictions('insert', undefined, {});
Collection.validateRestrictions('insert', undefined, { jumping: true });  // jump failed: Access denied
Collection.validateRestrictions('jump', undefined, { jumping: true });  // jump failed: Access denied
Collection.validateRestrictions('jump', undefined, {});
Collection.checkRestrictions('insert', undefined, {}); // true
Collection.checkRestrictions('insert', undefined, { jumping: true }); // false
Collection.checkRestrictions('jump', undefined, { jumping: true }); // false
Collection.checkRestrictions('jump', undefined, {}); // true
```

### attachRestriction
> collection.attachRestriction(action: String)

### validateRestrictions
> collection.validateRestrictions(action: String, args...)

#### checkRestrictions
> collection.checkRestrictions(action: String, args...)