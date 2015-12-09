module.exports = (cfg) => {
  return {
    app: {
      src: `${cfg.app}/index.html`,
      ignorePath: /\.\.\//,
    },
  };
};
