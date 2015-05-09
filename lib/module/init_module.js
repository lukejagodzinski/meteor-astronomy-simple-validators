onInitModule = function() {
  var prototype = Astro.Schema.prototype;

  prototype.addSimpleValidator = function(fieldName, simpleValidator) {
    // Check if field name had been provided and is a string.
    if (!_.isString(fieldName)) {
      throw new Error(
        'The simple validator\'s field name in the "' + this.getName() +
        '" class schema has to be a string'
      );
    }

    // Check if simple validator is a string or an object.
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

    this.addValidator(fieldName, parseSimpleValidator.call(this, fieldName,
      simpleValidator));
  };

  prototype.addSimpleValidators = function(simpleValidatorsData) {
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
};
