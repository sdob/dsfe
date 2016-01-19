module.exports = {
  dist: {
    src: [
      '<%= cfg.dist %>/scripts/{,*/}*.js',
'<%= cfg.dist %>/styles/{,*/}*.css',
'<%= cfg.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
    ],
  },
};
