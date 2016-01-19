module.exports = {
  html: '<%= cfg.dist %>/index.html',
  opions: {
    assetsDirs: ['<%= cfg.dist %>', '<%= cfg.dist %>/images'],
  },
  css: ['<%= cfg.dist %>/styles/{,*/}*.css'],
};
