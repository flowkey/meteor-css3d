Package.describe({
  name: 'ephemer:css3d',
  version: '0.0.1',
  summary: 'Thin & performant abstraction for transforming, dragging, and resizing elements using CSS3 matrices',
  git: 'https://github.com/ephemer/meteor-css3d.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles([
    'css3d.js',
    'css3d-simple-resize.js',
    'css3d-simple-drag.js'
  ], 'client');

  api.export('css3d');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ephemer:css3d');
  api.addFiles('css3d-tests.js');
});
