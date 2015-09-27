Package.describe({
  name: 'jagi:astronomy-simple-validators',
  version: '1.0.0',
  summary: 'Simple validators for Meteor Astronomy',
  git: 'https://github.com/jagi/meteor-astronomy-simple-validators.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('jagi:astronomy-validators@1.0.0');
  api.use('underscore');

  // Module.
  api.addFiles([
    'lib/module/parser.js',
    'lib/module/init_definition.js'
  ], ['client', 'server']);
});
