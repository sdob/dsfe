module.exports = {
  bower: {
    files: 'bower.json',
    tasks: ['wiredep'],
  },
  compass: {
    files: ['<%= cfg.app %>/styles/{,*/}*.{sass,scss}'], tasks: ['compass'],
  },

  js: {
    options: {
      livereload: '<%= connect.options.livereload %>',
    },
    tasks: ['newer:jshint:all'],
    files: ['<%= cfg.app %>/scripts/{,*/}*.js'],
  },

  jsTest: {
    tasks: ['newer:jshint:test', 'karma'],
    files: ['test/{,*/}*.js'],
  },

  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      '<%= cfg.app %>/{,*/}*.html', '.tmp/styles{,*/}*.css',
    ],
  },
};
