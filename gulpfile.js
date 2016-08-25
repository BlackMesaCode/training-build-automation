var gulp = require('gulp');
var gutil = require('gulp-util');
var run = require('gulp-run');


gulp.task('live-server', function() {
    run('live-server').exec();
});

gulp.task('hello-world', function() {
    gutil.log('Hello world!');
});

// ein gulp task namens build reicht nicht aus um den Hotkey Ctrl+Shift+B zu aktivieren ... wir müssen den gulp build task in der tasks.json um das attribut "isBuildCommand": true erweitern um den Hotkey zu aktivieren
gulp.task('build', function() {
    gutil.log('..building...');
})