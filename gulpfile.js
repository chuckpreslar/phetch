var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('compile', function() {
  return gulp.src('lib/**/*.js')
    .pipe(babel({ presets: ['es2015', 'stage-0'], plugins: ['transform-async-to-generator', 'transform-decorators-legacy'] }))
    .pipe(gulp.dest('dist'));
});
