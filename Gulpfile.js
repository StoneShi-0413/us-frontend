'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    changed = require('gulp-changed'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    ngAnnotate = require('gulp-ng-annotate'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
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
    gulp.src('./dist', {
            read: false
        }) // much faster
        .pipe(clean({
            force: true
        }));
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
    gulp.src('sass/*.scss')
        // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
        .pipe(sass({
            onError: function(e) {
                console.log(e);
            }
        }))
        // Optionally add autoprefixer
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
        // These last two should look familiar now :)
        .pipe(gulp.dest('dist/css/'));
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


// Views task
gulp.task('views', function() {
    // Get our index.html
    gulp.src('index.html')
        // And put it in the dist folder
        .pipe(gulp.dest('dist/'));

    // Any other view files from app/views
    gulp.src('views/**/*')
        // Will be put in the dist/views folder
        .pipe(gulp.dest('dist/views/'));
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

    return  gulp.src(['scripts/*'])  
            .pipe(gulp.dest('./components/'));  
});

gulp.task('watch', ['clean','copy:setup' ,'browserify', 'styles', 'views', 'images'], function() {
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

    gulp.watch(['js/**/*.html'], [
        'views'
    ]);

    gulp.watch(['img/**/*'], [
        'images'
    ]);

    gulp.watch('./dist/**').on('change', refresh.changed);

});


gulp.task('default', ['watch']);
