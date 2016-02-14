const dotenv = require('dotenv');
dotenv.load();
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
    //compass: require('./config/compass'),
    concurrent: require('./config/concurrent'),
    connect: require('./config/connect')(cfg),
    copy: require('./config/copy'),
    filerev: require('./config/filerev'),
    jscs: require('./config/jscs'),
    jshint: require('./config/jshint'),

    autoprefixer:{
      dist:{
        files:{
          '.tmp/styles/style.css':'.tmp/styles/style.css'
        }
      }
    },

    cdnify: {
      dist: {
        html: ['<%= cfg.dist %>/*.html'],
      },
      options: {
        cdn: require('google-cdn-data'),
      },
    },

    favicons: {
      options: {
      },
      icons: {
        src: '<%= cfg.app %>/img/logo.svg',
        dest: '<%= cfg.dist %>/',
      },
    },

    sass: {
      options: {
        sourceMap: true,
      },
      dist: {
        files: {
          '.tmp/styles/style.css': '<%= cfg.app %>/styles/style.scss',
        },
      },
      //files: ['.tmp/styles/style.css', '<%= cfg.app %>/styles/style.scss'],
    },

    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js'],
          dest: '.tmp/concat/scripts',
        }],
      },
    },

    ngconstant: {
      dist: {
        options: {
          name: 'divesites.constants',
          dest: '<%= cfg.app %>/app.constants.js',
          constants: {
            'FACEBOOK_CLIENT_ID': process.env.FACEBOOK_CLIENT_ID || 'Facebook App ID',
            'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID || 'Google Client ID',
            'API_URL': process.env.API_URL || 'http://localhost:8000',
            'IMG_API_URL': process.env.IMG_API_URL || 'http://localhost:9001',
          },
        },
      },
    },

    ngtemplates: {
      options: {
        htmlmin: { collapseWhitespace: true, },
        module: 'divesites',
        usemin: 'scripts/scripts.js',
      },
      dist: {
        cwd: '<%= cfg.app %>',
        src: ['**/*.template.html',],
        dest: '<%= cfg.dist %>/scripts/templates.js',
      },
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    uglify: {
      options: {
        compress: {
          drop_console: true,
        },
      },
    },

    useminPrepare: require('./config/usemin-prepare'),
    usemin: require('./config/usemin'),
    watch: require('./config/watch'),
    wiredep: require('./config/wiredep')(cfg),
  });

  grunt.registerTask('serve', 'Compile and start a web server', (target) => {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
    grunt.task.run([
      'clean:server',
      'ngconstant:dist', // convert environment variables to Angular constants
      'wiredep',
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'ngconstant:dist', // Convert environment variables to Angular constants
    'clean:dist', // Wipe the dist directory
    'babel', // Transpile ES2015 to ES5
    'sass', // Compile SASS to CSS
    'autoprefixer', // Autoprefix
    'wiredep', // Update Bower dependencies
    'useminPrepare', // Generate usemin configuration
    'ngtemplates', // compile templates
    'concat', // Concatenate JS and CSS
    'ngAnnotate',
    'copy:dist', // Move files across to the dist/ directory
    //'cdnify',
    'cssmin', // Minify CSS
    // 'uglify', // Minify JS
    'filerev', // Generate file versions to bust caches
    'usemin', // Run usemin
    'favicons', // generate favicons
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'ngconstant:dist', // Convert environment variables to Angular constants
    'connect:test',
    'karma'
  ]);
};
