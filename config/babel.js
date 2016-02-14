module.exports = {
  options: {
    sourceMap: true,
    plugins: ['transform-object-assign'],
    presets: ['es2015'],
  },
  server: {
    files: [{
      expand: true,
      cwd: '<%= cfg.app %>',
      src: ['**/*.js'],
      dest: '.tmp',
    }],
  },
};
