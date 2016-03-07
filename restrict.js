// collection.attachRestriction(action: String)
Mongo.Collection.prototype.attachRestriction = function(action) {
	var collection = this;
	if (typeof collection._validators[action] === 'undefined') {
		collection._validators[action] = { allow: [], deny: [] };
	} else return undefined;
	
	lodash.each(['allow', 'deny'], function(method) {
		var _super = Mongo.Collection.prototype[method];
		
		Mongo.Collection.prototype[method] = function(rules) {
			var collection = this;
			
			if (rules[action]) {
				if (!(rules[action] instanceof Function)) {
					throw new Error(method + ': Value for `' + name + '` must be a function');
				}
				if (typeof collection._validators[action] === 'undefined') {
					collection._validators[action] = { allow: [], deny: [] };
				}
				collection._validators[action][method].push(rules[action]);
				collection._restricted = true;
			}
			
			// Pass on valid meteor rules
			return _super.call(collection, _.omit(rules, action));
		};
	});
};

// collection.validateRestrictions(action: String, args...)
Mongo.Collection.prototype.validateRestrictions = function(action) {
	var collection = this;
	
	if (!(action in collection._validators)) {
		throw new Meteor.Error('Restriction '+action+' is not defined');
	}
	
	var args = Array.prototype.slice.call(arguments, 1);
	
	lodash.each(collection._validators[action].allow, function(method) {
		var result = method.apply({}, args);
		if (!result) throw new Meteor.Error(action+' failed: Access denied');
	});
	
	lodash.each(collection._validators[action].deny, function(method) {
		var result = method.apply({}, args);
		if (result) throw new Meteor.Error(action+' failed: Access denied');
	});
};

// collection.checkRestrictions(action: String, args...)
Mongo.Collection.prototype.checkRestrictions = function() {
	try {
		this.validateRestrictions.apply(this, arguments);
	} catch(error) {
		return false;
	}
	return true;
};