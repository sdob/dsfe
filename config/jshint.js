module.exports = {
  options: {
    jshintrc: '.jshintrc',
  },
  all: {
    src: [
      'Gruntfile.js',
      '<%= cfg.app %>/{,*/}*.js',
    ],
  },
};
