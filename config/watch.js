module.exports = {

  bower: {
    files: 'bower.json',
    tasks: ['wiredep'],
  },

  sass: {
    files: ['<%= cfg.app %>/styles/{,*/}*.{sass,scss}'], tasks: ['sass', 'autoprefixer'],
  },

  js: {
    options: {
      livereload: '<%= connect.options.livereload %>',
    },
    tasks: ['newer:jshint:all', 'babel:server', 'jscs', 'karma',],
    files: ['<%= cfg.app %>/**/*.js', '<%= cfg.test %>/{,*/}*.js'],
  },

  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      '<%= cfg.app %>/*.html',
      '<%= cfg.app %>/**/*.html',
      '.tmp/styles{,*/}*.css',
      '<%= cfg.app %>/{,*/}*.js',
    ],
  },
};
