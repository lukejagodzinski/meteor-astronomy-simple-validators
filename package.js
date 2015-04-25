Package.describe({
  name: 'jagi:astronomy-simple-validators',
  version: '0.1.0',
  summary: 'Simple validators for Meteor Astronomy',
  git: 'https://github.com/jagi/meteor-astronomy-simple-validators.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('jagi:astronomy@0.2.0');
  api.use('jagi:astronomy-validators@0.3.0');
  api.use('underscore');

  // Module.
  api.addFiles('lib/module/schema.js', ['client', 'server']);
  api.addFiles('lib/module/parser.js', ['client', 'server']);
  api.addFiles('lib/module/module.js', ['client', 'server']);
});
