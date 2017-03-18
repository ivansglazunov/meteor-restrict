Package.describe({
  name: 'ivansglazunov:restrict',
  version: '0.0.10',
  summary: 'It allows you to easily add their own restrictions into allow or deny.',
  git: 'https://github.com/ivansglazunov/meteor-restrict.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use([
    'ecmascript',
    'mongo',
    'accounts-base',
    'underscore',
  ]);
  
  api.use('matb33:collection-hooks@0.8.1');

  api.mainModule('main.js');
  api.addFiles('restrict.js');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'check',
    'mongo',
    'ivansglazunov:restrict'
  ]);
  
  api.addFiles('tests.js');
});