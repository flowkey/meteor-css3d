Package.describe({
  name: 'css3d',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Thin & performant abstraction for transforming, dragging, and resizing elements using CSS3 matrices',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/ephemer/meteor-css3d.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
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
  api.use('css3d');
  api.addFiles('css3d-tests.js');
});
