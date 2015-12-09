module.exports = (cfg) => {
  return {
    app: {
      src: `${cfg.app}/index.html`,
      ignorePath: /\.\.\//,
    },
    test: {
      devDependencies: true,
      src: 'karma.conf.js',
      fileTypes: {
        js: {
          block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
          detect: {
            js: /'(.*\.js)'/gi
          },
          replace: {
            js: '\'{{filePath}}\','
          }
        }
      },
      ignorePath: /\.\.\//,
    },
  };
};
