module.exports = {
  dist: {
    files: [{
      expand: true,
      dot: true,
      cwd: '<%= cfg.app %>',
      dest: '<%= cfg.dist %>',
      src: [
        '*.{ico,png,txt}',
        '.htaccess',
        '{,*/}*.html',
        '**/*.html',
        '*.html',
        'img/**/*',
      ],
    },
    {
      expand: true,
      cwd: 'bower_components/bootstrap/fonts',
      dest: '<%= cfg.dist %>/fonts',
      src: [
        '*.{eot,ttf,woff,woff2}',
      ],
    }
    ],
  },
  styles: {
    expand: true,
    cwd: '<%= cfg.app %>/styles',
    dest: '.tmp/styles/',
    src: '{,*/}*.css'
  },
};
