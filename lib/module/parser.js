parseSimpleValidator = function(validatorDefinition) {
  var rulesString;
  var messages;

  if (_.isObject(validatorDefinition)) {
    rulesString = validatorDefinition.rules;
    messages = validatorDefinition.messages;
  } else if (_.isString(validatorDefinition)) {
    rulesString = validatorDefinition;
  }

  var rules = rulesString.split('|');

  console.log(rules);

  return Astro.Validators.isString();
};
