Astro.Module({
  name: 'SimpleValidators',
  initSchema: function(Class, definition) {
    if (_.has(definition, 'simpleValidators')) {
      this.addSimpleValidators(definition.simpleValidators);
    }
  }
});
