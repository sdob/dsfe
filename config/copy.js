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
        'views/**/*.html',
        'views/{,*/}*.html',
        'img/**/*',
      ],
    }],
  },
  styles: {
    expand: true,
    cwd: '<%= cfg.app %>/styles',
    dest: '.tmp/styles/',
    src: '{,*/}*.css'
  },
};
