Package.describe({
  name: 'jagi:astronomy-simple-validators',
  version: '0.3.2',
  summary: 'Simple validators for Meteor Astronomy',
  git: 'https://github.com/jagi/meteor-astronomy-simple-validators.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('jagi:astronomy-validators@0.6.2');
  api.use('underscore');

  // Module.
  api.addFiles('lib/module/parser.js', ['client', 'server']);
  api.addFiles('lib/module/init_module.js', ['client', 'server']);
  api.addFiles('lib/module/init_schema.js', ['client', 'server']);
  api.addFiles('lib/module/module.js', ['client', 'server']);
});
