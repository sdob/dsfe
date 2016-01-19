module.exports = {
  html: '<%= cfg.dist %>/index.html',
  opions: {
    assetsDirs: ['<%= cfg.dist %>', '<%= cfg.dist %>/img',],
  },
  css: ['<%= cfg.dist %>/styles/{,*/}*.css'],
};
