var checks = {};

checks.fieldName = function(fieldName) {
  if (!_.isString(fieldName)) {
    throw new Error(
      'The simple validator\'s field name in the "' + this.getName() +
      '" class schema has to be a string'
    );
  }
};

checks.simpleValidator = function(fieldName, simpleValidator) {
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

var methods = {};

methods.addSimpleValidator = function(fieldName, simpleValidator) {
  // Check if field name had been provided and is a string.
  checks.fieldName.call(this, fieldName);
  // Check if simple validator is a string or an object.
  checks.simpleValidator.call(this, fieldName, simpleValidator);

  this.addValidator(
    fieldName,
    parseSimpleValidator.call(this, fieldName, simpleValidator)
  );
};

methods.addSimpleValidators = function(simpleValidatorsData) {
  // Validators data has to be an object.
  if (!_.isObject(simpleValidatorsData)) {
    throw new Error(
      'The simple validators data in the "' + this.getName() +
      '" class schema has to be an object'
    );
  }

  // Loop through list of validators data and add each one.
  _.each(simpleValidatorsData, function(simpleValidator, fieldName) {
    this.addSimpleValidator(fieldName, simpleValidator);
  }, this);
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);

  // Add validators that are defined next to the field definition.
  _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
    if (
      _.isObject(fieldDefinition) &&
      _.has(fieldDefinition, 'simpleValidators')
    ) {
      Class.addSimpleValidator(fieldName, fieldDefinition.simpleValidators);
    }
  });

  if (_.has(schemaDefinition, 'simpleValidators')) {
    Class.addSimpleValidators(schemaDefinition.simpleValidators);
  }
});
