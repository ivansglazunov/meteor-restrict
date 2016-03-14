# Restrict

```
meteor add ivansglazunov:restrict
```

It allows you to easily add their own restrictions into allow or deny.
Methods for the easy validation.

## Usage

```js
Collection = new Mongo.Collection(null);
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

### validateRestrictions
> collection.validateRestrictions(action: String, args...)

Call all restrictions with name `action` and thrown error if exists.

#### checkRestrictions
> collection.checkRestrictions(action: String, args...) => Boolean

Call `validateRestrictions` and if thrown error, returns `false`, else returns `true`.

### attachRestrictions
> collection.attachRestrictions();

Imitation server validation on client for any collection.

```js
if (Meteor.isClient) collection.attachRestrictions();
```

## Versions

### 0.0.7
* Addad `attachRestrictions` for imitation server validation on client for any collection.

### 0.0.4
* Remove need for `attachRestriction`.

### 0.0.3
* Attach multiple restrictions.