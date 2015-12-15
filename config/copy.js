module.exports = (cfg) => {
  return {
    styles: {
      expand: true,
      cwd: '<%= cfg.app %>/styles',
      dest: '.tmp/styles/',
      src: '{,*/}*.css'
    },
  };
};
