var gulp = require('gulp')
  , del = require('del')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , gutil = require('gulp-util')
  , uglify = require('gulp-uglify')
  , debowerify = require('debowerify')
  , browserify_css = require('browserify-css')
  , browserify_shim = require('browserify-shim');

var connect = require('gulp-connect');

// Serve our content through a webserver with livereload
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

// Reload the server once our new app.js is build
gulp.task('reload', ['bundle'], function () {
  gulp.src('./dist/*.html')
    .pipe(connect.reload());
});

// Look for changes in source files (JS, HTML, CSS)
gulp.task('watch', function () {
  gulp.watch(['./src/**/*.js', './src/**/*.html', './src/**/*.css'], ['default', 'reload']);
});

// Task to browserify our app.js file
gulp.task('bundle', ['clean'], function () {
  var b = browserify({
    entries: './src/app.js',
    transform: [debowerify, browserify_css, browserify_shim]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify({mangle: false}))
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/'));
});

// Task to copy our compiled assets to the dist folder
gulp.task('move', ['clean'], function(){
    gulp.src(['src/**/*.html', 'src/**/*.css'])
      .pipe(gulp.dest('dist'))
});

gulp.task('clean', function () {
  return del([
    'dist/**/*',
    '!dist/.gitignore'
  ]);
});

gulp.task('default', ['clean', 'move', 'bundle']);
gulp.task('serve', ['connect', 'watch']);
