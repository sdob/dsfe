module.exports = {
  src: '<%= cfg.app %>/{,*/}*.js',
  options: {
    config: '.jscsrc',
    esnext: true,
    verbose: true,
  },
};
