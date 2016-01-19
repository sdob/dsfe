module.exports = {
  src: '<%= cfg.app %>/scripts/{,*/}*.js',
  options: {
    config: '.jscsrc',
    esnext: true,
    verbose: true,
  },
};
