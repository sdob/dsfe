module.exports = (grunt) => {
  require('load-grunt-tasks')(grunt);
  var foo = {
  };

  const cfg = {
    app: 'app',
    test: 'test',
  };

  grunt.initConfig({

    cfg,

    babel: require('./config/babel'),

    clean: require('./config/clean'),

    compass: require('./config/compass'),

    concurrent: require('./config/concurrent'),

    connect: require('./config/connect')(cfg),
    // copy: require('./config/copy')(cfg),

    coverage: {
      options: {
        coverageDir: 'coverage',
        recursive: true,
      },
    },

    jshint: require('./config/jshint'),

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    watch: require('./config/watch'),

    wiredep: require('./config/wiredep')(cfg),
  });

  grunt.registerTask('serve', (target) => {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      // 'autoprefixer'
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    'karma'
  ]);
};
