const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json', { rootDir: 'src', outDir: 'dist' });

gulp.task('build', function () {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest('./dist'));
});

//set up a watcher to watch over changes
gulp.task('watch', gulp.series('build', () => {
  gulp.watch(tsProject.src())
    .on('change', gulp.series('build'));
}));

gulp.task('default', gulp.series('watch'));
