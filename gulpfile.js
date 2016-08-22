var gulp = require('gulp');
var gutil = require('gulp-util');
var run = require('gulp-run');


gulp.task('live-server', function() {
    run('live-server').exec();
});

gulp.task('hello-world', function() {
    gutil.log('Hello world!');
});