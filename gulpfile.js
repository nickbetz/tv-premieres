var gulp = require('gulp'),
  connect = require('gulp-connect'),
  htmlify = require('gulp-angular-htmlify');

gulp.task('connect', function() {
  connect.server({
  });
});

gulp
    .src( 'main.css' )
    .pipe( checkCSS({
        files: '*.html'
    }))
    .on( 'error', function( err ) {
        // unnecessary since gulp-check-unused-css logs by default
        console.log( 'Unused classes:', err.unused );
    });

gulp.task('htmlify', function() {
    gulp.src('index.html')
        .pipe(htmlify())
        .pipe(gulp.dest(''));
});

gulp.task('default', ['connect']);