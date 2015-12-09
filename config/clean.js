module.exports = {
  dist: {
    files: [{
      dot: true,
      src: [
        '.tmp',
        // <%= cfg.dist %>/{,/*/}*',
        // <%= cfg.dist %>/.git{<*/}*'
      ],
    }],
  },
  server: '.tmp',
};
