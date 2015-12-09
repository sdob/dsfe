module.exports = {
  options: {
    jshintrc: '.jshintrc',
  },
  all: {
    src: [
      'Gruntfile.js',
      '<%= cfg.app %>/scripts/{,*/}*.js',
    ],
  },
  test: {
    options: {
      jshintrc: 'test/.jshintrc',
    },
    src: ['test/{,*/}*.js']
  },
};
