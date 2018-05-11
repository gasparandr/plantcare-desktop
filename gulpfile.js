var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig-gulp.json');

gulp.task('src', function() {
    tsProject.src()
        .pipe( tsProject() )
        .pipe( gulp.dest("") )
});


gulp.task( 'default', [ 'src' ], function() {
    gulp.watch( './src/**/*.ts', ['src']);
});