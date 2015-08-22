// Regular expressions for checking options type.
var stringRegExp = /^"(.+)"$/i;
var numberRegExp = /^(-?\d*(\.\d+)?)$/i;
var booleanRegExp = /^(true|false)$/i;

var convertRule = function(fieldName, rule, messages) {
  var self = this;

  var strValidators = [];
  var strValidator = {
    name: '',
    options: ''
  };

  var openingBrackets = 0;
  var closingBrackets = 0;

  var add = function() {
    if (openingBrackets === closingBrackets) {
      strValidators.push(strValidator);
      openingBrackets = closingBrackets = 0;
      strValidator = {
        name: '',
        options: ''
      };
    } else {
      throw new Error(
        'Could not parse the "' + rule + '" validation rules for the "' +
        fieldName + '" field in the "' + self.getName() + '" class schema'
      );
    }
  };

  _.each(rule, function(char) {
    if (char === ',') {
      add();
    } else {
      if (char === '(') {
        openingBrackets++;
      } else if (char === ')') {
        closingBrackets++;
      } else {
        if (openingBrackets > 0) {
          strValidator.options += char;
        } else {
          strValidator.name += char;
        }
      }
    }
  });
  add();

  var validators = [];
  _.each(strValidators, function(strValidator) {
    // Check whether validator with the given name exists.
    if (!_.has(Validators, strValidator.name)) {
      throw new Error(
        'There is no validator with the name "' + strValidator.name +
        '" for the "' + fieldName + '" field in the "' + self.getName() +
        '" class schema'
      );
    }

    var options;
    if (strValidator.options.length > 0) {
      if (isNumber(strValidator.options)) {
        options = convertNumber(strValidator.options);
      } else if (isBoolean(strValidator.options)) {
        options = convertBoolean(strValidator.options);
      } else if (isString(strValidator.options)) {
        options = convertString(strValidator.options);
      } else {
        throw new Error(
          'Could not parse the validator options for the "' +
          strValidator.name + ' validator, for the "' +
          fieldName + '" field in the "' + self.getName() + '" class schema'
        );
      }
    }

    validators.push(
      Validators[strValidator.name](
        options,
        messages ? messages[strValidator.name] : undefined
      )
    );
  });

  return validators;
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
  return convertRule.call(this, fieldName, rule, messages);
};
