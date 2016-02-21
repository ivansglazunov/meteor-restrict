Tinytest.add('Check native restictions', function(test) {
    var collection = new Mongo.Collection(null);

    collection.deny({
        insert: function(userId, document) {
            if (userId == 123) return false;
            else return true;
        }
    });

    collection.validateRestrictions('insert', 123, {});
    test.throws(function() {
        collection.validateRestrictions('insert', 666, {});
    });
});
Tinytest.add('Check custom restictions', function(test) {
    var collection = new Mongo.Collection(null);

    collection.attachRestriction('test');
    
    collection.deny({
        test: function(userId, document) {
            if (userId == 123) return false;
            else return true;
        }
    });

    collection.validateRestrictions('test', 123, {});
    test.throws(function() {
        collection.validateRestrictions('test', 666, {});
    });
});
