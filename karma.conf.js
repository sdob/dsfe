module.exports = (config) => {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-google-maps/dist/angular-google-maps.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.js',
      'bower_components/angular-route/angular-route.js',
      'app/scripts/**/*.js',
      'test/**/*.js'
    ],
    port: 8080,
    logLevel: config.LOG_INFO,
    browsers: [
      'PhantomJS',
    ],
    preprocessors: {
      'app/**/*.js': ['babel'],
      'test/**/*.js': ['babel']
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      }
    }
  });
};
