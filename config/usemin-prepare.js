module.exports = {
  dist: {
    html: 'index.html',
    files: {'dist/index.html': 'app/index.html'},
    options: {
      root: '<%= cfg.app %>',
      dest: '<%= cfg.dist %>',
      flow: {
        html: {
          steps: {
            js: ['concat', 'uglify'],
            css: ['cssmin'],
          },
        },
      },
    },
  },
};
