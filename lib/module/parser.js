// Regular expression that maches validation rules in the form of
// "name(options)" where options can be coma seperated list of sub
// rules.
var ruleRegExp = /^([A-Z0-9]+)(\((.*)\))?$/i;
// Other regular expressions for checking options type.
var arrayRegExp = /^\[(.+)\]$/i;
var stringRegExp = /^"(.+)"$/i;
var numberRegExp = /^(-?\d*(\.\d+)?)$/i;
var booleanRegExp = /^(true|false)$/i;

var convertRule = function(rule, messages, fieldName) {
  // Try to find rule name and options using regular expression.
  var matches = ruleRegExp.exec(rule);
  if (!matches) {
    throw new Error(
      'Could not parse "' + rule + '" validation rules for "' + fieldName +
      '" field in the "' + this.getName() + '" class schema'
    );
  }

  // Take name and options from the regular expression match object.
  // The "options" argument is optional.
  var name = matches[1];
  var options = matches[3];

  // Check whether validator with the given name exists.
  if (!_.has(Astro.Validators, name)) {
    throw new Error(
      'There is no validator with the name "' + name + '" for "' +
      fieldName + '" field in the "' + this.getName() +
      '" class schema'
    );
  }

  // If the "options" had been found then try checking what type of
  // value it is. It can be string, array, number or boolean.
  var params;
  if (options) {
    if (isArray(options)) {
      params = convertArray.call(this, options, messages, fieldName);
    } else if (isString(options)) {
      params = convertString(options);
    } else if (isNumber(options)) {
      params = convertNumber(options);
    } else if (isBoolean(options)) {
      params = convertBoolean(options);
    } else {
      params = options;
    }
  }

  // Return proper functional validator.
  return Astro.Validators[name](
    params,
    messages ? messages[name] : undefined
  );
};

var isArray = function(options) {
  return arrayRegExp.test(options);
};
var convertArray = function(options, messages, fieldName) {
  var matches = arrayRegExp.exec(options);
  var subRules = matches[1].split(',');
  // Try parsing each sub rule.
  return _.map(subRules, function(subRule) {
    return convertRule.call(this, subRule, messages, fieldName);
  }, this);
};

var isString = function(options) {
  return stringRegExp.test(options);
};
var convertString = function(options) {
  var matches = stringRegExp.exec(options);
  return matches[1];
};

var isNumber = function(options) {
  return numberRegExp.test(options);
};
var convertNumber = function(options) {
  var matches = numberRegExp.exec(options);
  return parseFloat(matches[1]);
};

var isBoolean = function(options) {
  return booleanRegExp.test(options);
};
var convertBoolean = function(options) {
  var matches = booleanRegExp.exec(options);
  switch (matches[1]) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return;
  }
};

// Function converts validation rules for given field into functional
// validators. It's called in the context of the schema object which is
// used to display error messages with the name of the class in which
// error occured.
parseSimpleValidator = function(fieldName, validatorDefinition) {
  var rule;
  var messages;

  // We check whether developer passed only validation rules or object
  // with both rules and error messages.
  if (_.isObject(validatorDefinition)) {
    rule = validatorDefinition.rules;
    messages = validatorDefinition.messages;
  } else if (_.isString(validatorDefinition)) {
    rule = validatorDefinition;
  }

  // Try to convert top most validation rule for given field.
  return convertRule.call(this, rule, messages, fieldName);
};
