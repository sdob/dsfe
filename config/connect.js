const serveStatic = require('serve-static');
module.exports = (cfg) => {
  return {
    options: {
      port: 9000,
      hostname: 'localhost',
      livereload: 35729,
    },
    livereload: {
      options: {
        open: false,
        middleware: (connect) => {
          return [
            serveStatic('.tmp'),
            connect().use(
              '/bower_components',
              serveStatic('./bower_components')
            ),
            serveStatic(cfg.app)
          ];
        },
      },
    },
    test: {
      options: {
        port: 9001,
        middleware: (connect) => {
          return [
            serveStatic('.tmp'),
            serveStatic('test'),
            connect().use(
              '/bower_components',
              serveStatic('./bower_components')
            ),
            serveStatic(cfg.app)
          ];
        }
      }
    }
  };
};
