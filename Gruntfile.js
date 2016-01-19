module.exports = (grunt) => {
  require('load-grunt-tasks')(grunt);
  var foo = {
  };

  const cfg = {
    app: 'app',
    dist: 'dist',
    test: 'test',
  };

  grunt.initConfig({

    cfg,

    babel: require('./config/babel'),
    clean: require('./config/clean'),
    compass: require('./config/compass'),
    concurrent: require('./config/concurrent'),
    connect: require('./config/connect')(cfg),
    copy: require('./config/copy'),
    filerev: require('./config/filerev'),
    jscs: require('./config/jscs'),
    jshint: require('./config/jshint'),

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    useminPrepare: require('./config/usemin-prepare'),

    usemin: require('./config/usemin'),

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
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist', // Wipe the dist directory
    'babel', // Transpile ES2015 to ES5
    'compass', // Compile SASS to CSS
    'wiredep', // Update Bower dependencies
    'useminPrepare', // Generate usemin configuration
    'concat', // Concatenate JS and CSS
    'copy:dist', // Move files across to the dist/ directory
    'cssmin', // Minify CSS
    'uglify', // Minify JS
    'filerev', // Generate file versions to bust caches
    'usemin', // Run usemin
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    'karma'
  ]);
};
