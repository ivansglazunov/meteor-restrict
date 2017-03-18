var ALLOWED_UPDATE_OPERATIONS = {
  $inc: 1, $set: 1, $unset: 1, $addToSet: 1, $pop: 1, $pullAll: 1, $pull: 1,
  $pushAll: 1, $push: 1, $bit: 1
};

const noReplaceError = "Access denied. In a restricted collection you can only" +
  " update documents, not replace them. Use a Mongo update operator, such " +
  "as '$set'.";
  
var modifierToFields = function(modifier, operations = ALLOWED_UPDATE_OPERATIONS) {
  const fields = [];
  if (_.isEmpty(modifier)) {
    throw new Meteor.Error(403, noReplaceError);
  }
  _.each(modifier, function (params, op) {
    if (op.charAt(0) !== '$') {
      throw new Meteor.Error(403, noReplaceError);
    } else if (!_.has(operations, op)) {
      throw new Meteor.Error(
        403, "Access denied. Operator " + op + " not allowed in a restricted collection.");
    } else {
      _.each(_.keys(params), function (field) {
        // treat dotted fields as if they are replacing their
        // top-level part
        if (field.indexOf('.') !== -1)
          field = field.substring(0, field.indexOf('.'));

        // record the field we are trying to change
        if (!_.contains(fields, field))
          fields.push(field);
      });
    }
  });
  return fields;
};

export {
  ALLOWED_UPDATE_OPERATIONS,
  modifierToFields,
};