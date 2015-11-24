'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    changed = require('gulp-changed'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    ngAnnotate = require('gulp-ng-annotate'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    scp = require('gulp-scp2'),
    runSequence = require('run-sequence'),
    isProduction = false;


// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

var paths = {
    scriptEntryFiles: './js/app.js',
    scriptDstDir: './dist/js'
};

// Set up an express server (not starting it yet)
var server = express();
// Add live reload
server.use(livereload({
    port: livereloadport
}));
// Use our 'dist' folder as rootfolder
server.use(express.static('./dist'));
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/*', function(req, res) {
    res.sendfile('index.html', {
        root: 'dist'
    });
});

// Dev task
gulp.task('dev', ['views', 'styles' /*, 'lint'*/ , 'browserify', 'images'], function() {});

// Clean task
gulp.task('clean', function() {
    del.sync(['dist']);
});


// font task
gulp.task('font', function() {
    // Any other view files from app/views
    gulp.src('font/*')
        // Will be put in the dist/views folder
        .pipe(gulp.dest('dist/font/'));
});

// JSHint task
gulp.task('lint', function() {
    gulp.src('js/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default', {
            console: true
        }));
});

// Styles task
gulp.task('styles', function() {
    sass('sass/*.scss')
        // Optionally add autoprefixer
        .pipe(autoprefixer({browsers:['chrome >= 29',
            'ff >= 29',
            'safari >= 7',
            'ie >= 11',
            'edge >= 1',
            'opera >= 15',
            'and_chr >= 44',
            'and_ff >= 40',
            'android >= 40',
            'ios >= 7',
            'ie_mob >= 11',
            'op_mob >= 30']}))
        // These last two should look familiar now :)
        .pipe(gulp.dest('dist/css'));
});

// Browserify task
gulp.task('browserify', function() {
    return browserify('./js/app.js')
        .bundle()
        .pipe(source('app.js'))
        //.pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
        //.pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(ngAnnotate());
});

// scp task
gulp.task('scp', function() {
    return gulp.src('./dist/**/*')
        .pipe(scp({
            host: 'www.us-app.com',
            username: 'upload',
            password: '18610555911',
            dest: '/home/upload/coupon'
        }))
        .on('error', function(err) {
            console.log(err);
        });
});

// Views task
gulp.task('views', function() {

    // Any other view files from app/views
    gulp.src('views/**/*')
        // Will be put in the dist/views folder
        .pipe(gulp.dest('dist/views/'));
});

//index page
gulp.task('index-page', function() {

    // Any other view files from app/views
    gulp.src('index.html')
        // Will be put in the dist/views folder
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', function() {

    return gulp.src('./img/**/*')
        .pipe(changed('dist/img')) // Ignore unchanged files
        .pipe(gulpif(global.isProd, imagemin())) // Optimize
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream({
            once: true
        }));
});

gulp.task('copy:setup', function() {

    return gulp.src(['scripts/**/*'])
        .pipe(gulp.dest('./components/'));
});

gulp.task('download', function() {

    return gulp.src('./components/jquery/jquery.min.js')
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('watch', ['clean', 'copy:setup', 'font', 'browserify', 'download', 'styles', 'views', 'images', 'index-page'], function() {
    // Start webserver
    server.listen(serverport);
    // Start live reload
    refresh.listen(livereloadport);

    // Watch our scripts, and when they change run lint and browserify
    gulp.watch(['js/*.js', 'js/**/*.js'], [
        //'lint',
        'browserify'
    ]);
    // Watch our sass files
    gulp.watch(['sass/*.scss'], [
        'styles'
    ]);

    gulp.watch(['views/**/*.html'], [
        'views'
    ]);

    gulp.watch(['index.html'], [
        'index-page'
    ]);

    gulp.watch(['img/**/*'], [
        'images'
    ]);

    gulp.watch('./dist/**').on('change', refresh.changed);

});

gulp.task('build', function(callback) {
    runSequence('clean', ['copy:setup', 'browserify', 'download', 'styles', 'views', 'images', 'index-page', 'font'],
        'scp',
        callback);
});

gulp.task('default', ['watch']);
