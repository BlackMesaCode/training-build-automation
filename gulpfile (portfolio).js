var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var sftp = require('gulp-sftp');
var htmlmin = require('gulp-htmlmin');

var onError = function (error) {  
  gutil.beep();
  gutil.log(error.message);
  this.emit('end');
};

// Static browsersync server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
        }
    });
});

gulp.task('sass', function () {
    return gulp
        .src('./src/styles/*.scss')
        .pipe(plumber({ errorHandler: onError }))
        // .pipe(plumber(function (error) {   // anonymous function method works equally good
        //         gutil.log(error.message);
        //         this.emit('end');
        //     }))
        .pipe(sass()) //.on('error', sass.logError)) //  to swallow error   [.pipe(plumber())  seems to be the better option)]
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/styles/'))
        .pipe(browserSync.stream());
});



gulp.task('clean:dist', function () {
    var filesToDelete = ["dist/*", "!dist/vendor" ];  // use * instead of *.*
    return del(filesToDelete).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'))});
});

gulp.task('copy:html', function () {
    return gulp
        .src("./src/*.html")
        .pipe(gulp.dest("./dist/"));
});

gulp.task('copy:favicons', function () {
    return gulp
        .src("./src/*.html")
        .pipe(gulp.dest("./dist/"));
});

gulp.task('copy:favicon', function () {
    return gulp
        .src(["./src/favicon.ico", "./src/favicon.png"])
        .pipe(gulp.dest("./dist/"));
});

gulp.task('copy:js', function () {
    return gulp
        .src("./src/scripts/*.js")
        .pipe(gulp.dest("./dist/scripts/"));
});

gulp.task('copy:images', function () {
    return gulp
        .src("./src/images/**/*.*")
        .pipe(gulp.dest("./dist/images/"));
});

gulp.task('copy:node_modules', function () {
    return gulp
        .src("./node_modules/**/*.*")
        .pipe(gulp.dest("./dist/vendor/"));
});

gulp.task('useref', function () {
    return gulp.src('./src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true, removeComments: true})))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('./dist/'));
});


// Deploy / Upload
gulp.task('upload', function () {
    return gulp.src('./dist/**/*.*')
        .pipe(sftp({
            host: 'antares.uberspace.de',
            auth: 'keyMain',
            remotePath: '/home/usr/html/portfolio',
        }));
});


// Build
gulp.task('build', gulp.series("clean:dist", gulp.parallel("copy:html", "copy:favicon", "copy:js", "copy:images", "sass"), "useref"));


// Static Server + watching scss/html files
gulp.task('default', gulp.series("build", function() {

    browserSync.init({
        server: "./dist/"
    });

    gulp.watch("./src/styles/*.scss", gulp.series("sass", "copy:images")).on('error', sass.logError);
    gulp.watch("./src/*.html", gulp.series("copy:html"));
    gulp.watch("./src/scripts/*.js", gulp.series("copy:js"));
    gulp.watch(["./dist/*.html", "./dist/scripts/*.js"]).on('change', browserSync.reload);
}));


// https://www.browsersync.io/docs/command-line
// https://www.browsersync.io/docs/options/
// https://www.browsersync.io/docs/gulp

// http://stackoverflow.com/questions/23971388/prevent-errors-from-breaking-crashing-gulp-watch
