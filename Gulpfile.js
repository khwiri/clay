const gulp = require('gulp');
const sass = require('gulp-sass');
const child_process = require('child_process');

gulp.task('styles', () => {
    gulp.src('src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/css/'));
});

gulp.task('build-porcelain', (cb) => {
    process.chdir('src/porcelain');
    child_process.exec('python setup.py py2exe')
        .stdout.on('data', (data) => {console.log(data);})
        .on('error', (err) => {console.log(err);})
        .on('close', (err) => {
            process.chdir('../..');
            cb(err);
        });
});

gulp.task('deploy-porcelain', ['build-porcelain'], () => {
    gulp.src('src/porcelain/dist/**/*')
        .pipe(gulp.dest('app/bin/porcelain'));
});

gulp.task('default', () => {
    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/porcelain/*.py', ['deploy-porcelain']);
    gulp.start('styles');
});
