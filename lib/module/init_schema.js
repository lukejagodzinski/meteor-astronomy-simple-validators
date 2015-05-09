onInitSchema = function(Class, definition) {
  if (_.has(definition, 'simpleValidators')) {
    this.addSimpleValidators(definition.simpleValidators);
  }
};
