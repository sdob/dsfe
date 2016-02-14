// Karma configuration
// Generated on Fri Dec 11 2015 23:53:23 GMT+0000 (GMT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // Explicitly include Babel polyfill
      'node_modules/babel-polyfill/dist/polyfill.js',
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bluebird/js/browser/bluebird.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.js',
      'bower_components/angular-google-chart/ng-google-chart.js',
      'bower_components/d3/d3.js',
      'bower_components/moment/moment.js',
      'bower_components/d3.chart/d3.chart.js',
      'bower_components/d3.compose/dist/d3.compose-all.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/seiyria-bootstrap-slider/js/bootstrap-slider.js',
      'bower_components/satellizer/satellizer.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/cloudinary-jquery/cloudinary-jquery.js',
      'bower_components/haversine/haversine.js',
      'bower_components/angular-simple-logger/dist/angular-simple-logger.js',
      'bower_components/lodash/lodash.js',
      'bower_components/angular-google-maps/dist/angular-google-maps.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/showdown/dist/showdown.js',
      'bower_components/angular-markdown-filter/markdown.js',
      // endbower
      // Load main app module and constants first
      'app/app.module.js',
      'app/app.constants.js',
      // Then all other modules
      'app/**/*.module.js',
      // Then everything else
      'app/**/*.js',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/**/*.js': ['babel', 'coverage',],
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      }
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      reporters: [
        { type: 'lcov', subdir: '.' },
      ],
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
