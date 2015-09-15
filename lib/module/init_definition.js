var checkFieldName = function(fieldName) {
  if (!_.isString(fieldName)) {
    throw new Error(
      'The simple validator\'s field name in the "' + this.getName() +
      '" class schema has to be a string'
    );
  }
};

var checkSimpleValidator = function(fieldName, simpleValidator) {
  if (_.isObject(simpleValidator)) {
    // The "rules" attribute is mandatory when working with object simple
    // validator.
    if (!_.has(simpleValidator, 'rules')) {
      throw new Error(
        'The simple validator object for the "' + fieldName +
        '" field in the "' + this.getName() +
        '" class schema must have "rules" attribute'
      );
    }
    // The "messages" attribute is mandatory when working with object simple
    // validator.
    if (!_.has(simpleValidator, 'messages')) {
      throw new Error(
        'The simple validator object for the "' + fieldName +
        '" field in the "' + this.getName() +
        '" class schema must have "messages" attribute'
      );
    }
  } else if (!_.isString(simpleValidator)) {
    throw new Error(
      'The simple validator for the "' + fieldName + '" field in the "' +
      this.getName() + '" class schema has to be a string or an object'
    );
  }
};

var checkValidator = function(validator, fieldName, className) {
};

Astro.eventManager.on(
  'initDefinition',
  function onInitDefinitionSimpleValidators(schemaDefinition) {
    var className = schemaDefinition.className;

    if (_.has(schemaDefinition, 'simpleValidators')) {
      var validators = {};

      _.each(schemaDefinition.simpleValidators, function(validator, fieldName) {
        var validator;

        if (_.isString(validator)) {
          validator = parseSimpleValidator(fieldName, simpleValidator);
        }

        if (validator) {
          // Check validity of the validator definition.
          checkValidator(validators[fieldName], fieldName, className);
          validators[fieldName] = validator;
        }
      });

      // Extend validators list with parsed simple validators.
      _.extend(schemaDefinition.validators, validators);
    }
  }
);
