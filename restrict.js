_.each(['allow', 'deny'], function(method) {
	var _super = Mongo.Collection.prototype[method];
	
	Mongo.Collection.prototype[method] = function(rules) {
		var collection = this;
		
		for (var r in rules) {
			if (!_.contains(['insert', 'update', 'remove', 'fetch', 'transform'], r)) {
				if (!(rules[r] instanceof Function)) {
					throw new Error(method + ': Value for `' + r + '` must be a function');
				}
				if (typeof collection._validators[r] === 'undefined') {
					collection._validators[r] = { allow: [], deny: [] };
				}
				collection._validators[r][method].push(rules[r]);
				collection._restricted = true;
			}
		}
		
		// Pass on valid meteor rules
		return _super.call(collection, _.pick(rules, ['insert', 'update', 'remove', 'fetch']));
	};
});

/**
 * Call all restrictions with name `action` and thrown error if exists.
 * @param {String} action - Name of restriction.
 * @param {...any} args - Any arguments for current restriction.
 * @throws {Error}
 */
Mongo.Collection.prototype.validateRestrictions = function(action) {
	var collection = this;
	
	if (!(action in collection._validators)) {
		return undefined;
	}
	
	var args = Array.prototype.slice.call(arguments, 1);
	
	_.each(collection._validators[action].allow, function(method) {
		var result = method.apply({}, args);
		if (!result) throw new Meteor.Error(action+' failed: Access denied');
	});
	
	_.each(collection._validators[action].deny, function(method) {
		var result = method.apply({}, args);
		if (result) throw new Meteor.Error(action+' failed: Access denied');
	});
};

/**
 * Call `validateRestrictions` and if thrown error, then return boolean result.
 * @param {String} action - Name of restriction.
 * @param {...any} args - Any arguments for current restriction.
 * @return {Boolean}
 */
Mongo.Collection.prototype.checkRestrictions = function() {
	try {
		this.validateRestrictions.apply(this, arguments);
	} catch(error) {
		return false;
	}
	return true;
};

/**
 * Imitation server validation on client for any collection.
 */
Mongo.Collection.prototype.attachRestrictions = function() {
	var collection = this;
	collection.before.insert(function() {
		collection.validateRestrictions('insert', ...arguments);
	});
	collection.before.update(function() {
		collection.validateRestrictions('update', ...arguments);
	});
	collection.before.remove(function() {
		collection.validateRestrictions('remove', ...arguments);
	});
};