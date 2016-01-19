module.exports = {

  bower: {
    files: 'bower.json',
    tasks: ['wiredep'],
  },

  sass: {
    files: ['<%= cfg.app %>/styles/{,*/}*.{sass,scss}'], tasks: ['sass'],
  },

  js: {
    options: {
      livereload: '<%= connect.options.livereload %>',
    },
    tasks: ['newer:jshint:all', 'babel:server', 'karma',],
    files: ['<%= cfg.app %>/scripts/{,*/}*.js', '<%= cfg.test %>/{,*/}*.js'],
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
