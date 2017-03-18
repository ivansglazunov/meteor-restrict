export const ALLOWED_UPDATE_OPERATIONS = {
  $inc: 1, $set: 1, $unset: 1, $addToSet: 1, $pop: 1, $pullAll: 1, $pull: 1,
  $pushAll: 1, $push: 1, $bit: 1
};

export default function modifierToFields(modifier, ALLOWED_UPDATE_OPERATIONS = ALLOWED_UPDATE_OPERATIONS) {
  const fields = [];
  if (_.isEmpty(modifier)) {
    throw new Meteor.Error(403, noReplaceError);
  }
  _.each(modifier, function (params, op) {
    if (op.charAt(0) !== '$') {
      throw new Meteor.Error(403, noReplaceError);
    } else if (!_.has(ALLOWED_UPDATE_OPERATIONS, op)) {
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