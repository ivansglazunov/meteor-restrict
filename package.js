Package.describe({
  name: 'ivansglazunov:restrict',
  version: '0.0.6',
  summary: 'It allows you to easily add their own restrictions into allow or deny.',
  git: 'https://github.com/ivansglazunov/meteor-restrict.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('ecmascript');
  api.use('mongo');
  api.use('accounts-base');
  
  api.use('stevezhu:lodash@4.3.0');
  
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