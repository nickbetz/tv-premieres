var gulp = require('gulp'),
  connect = require('gulp-connect'),
  htmlify = require('gulp-angular-htmlify'),
  sass = require('gulp-sass'),
  useref = require('gulp-useref'),
  minifyCss = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  gulpIf = require('gulp-if');

gulp.task('connect', function() {
  connect.server({
  });
});

gulp.task('htmlify', function() {
    gulp.src('index.html')
        .pipe(htmlify())
        .pipe(gulp.dest(''));
});

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./styles'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('useref', function () {
    var assets = useref.assets();
    
    return gulp.src('index.html')
        .pipe(assets)
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['connect','sass:watch']);