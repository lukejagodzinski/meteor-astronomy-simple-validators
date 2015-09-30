var checkValidator = function(
  validator, fieldName, className
) {
  if (!Match.test(
    validator,
    Match.OneOf(Astro.FieldValidator, [Astro.FieldValidator])
  )) {
    throw new TypeError(
      'The validator for the "' + fieldName +
      '" field in the "' + className + '" class schema has to be a ' +
      'function, an array of validators or a single validator'
    );
  }
};

Astro.eventManager.on(
  'initDefinition',
  function onInitDefinitionSimpleValidators(subSchema) {
    var Class = this;
    var schemaDefinition = subSchema.definition;
    var validatorsDefinitions = {};

    if (_.has(schemaDefinition, 'fields')) {
      _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
        if (_.has(fieldDefinition, 'simpleValidator')) {
          var simpleValidator = fieldDefinition.simpleValidator;
          var validator;

          if (_.isString(simpleValidator) || _.isObject(simpleValidator)) {
            validator = parseSimpleValidator(fieldName, simpleValidator);
          }

          if (validator) {
            // Check validity of the validator definition.
            checkValidator(validator, fieldName, Class.getName());
            validatorsDefinitions[fieldName] = validator;
          }
        }
      });
    }

    if (_.has(schemaDefinition, 'simpleValidators')) {
      _.each(schemaDefinition.simpleValidators, function(validator, fieldName) {
        var validator;

        if (_.isString(validator) || _.isObject(validator)) {
          validator = parseSimpleValidator(fieldName, simpleValidator);
        }

        if (validator) {
          // Check validity of the validator definition.
          checkValidator(validator, fieldName, Class.getName());
          validatorsDefinitions[fieldName] = validator;
        }
      });
    }

    // Extend validators list with parsed simple validators.
    if (_.size(validatorsDefinitions)) {
      subSchema.validators = subSchema.validators || {};
      _.extend(subSchema.validators, validatorsDefinitions);
    }
  }
);
