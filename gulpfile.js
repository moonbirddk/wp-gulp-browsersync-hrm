var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    filter = require('gulp-filter'),
    plumber = require('gulp-plumber'),
    clean = require('gulp-clean'),
    uglifycss = require('gulp-uglifycss'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    webpackStream = require('webpack-stream');
    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackConfig = require('./webpack.config'),
    bundler = webpack(webpackConfig),
    { PRODUCTION, HOT, PROXY_TARGET, FILES, PATHS } = require('./env.config');

gulp.task('default', function() {
    gulp.start('styles');
});

//RUNS CLEAN TASK, COMPILES JS AND OPENS A NEW WINDOW
gulp.task('serve', function() {
    
    gulp.start('clean');
    gulp.start('styles');

    browserSync.init(getBrowserSyncOptions(openWindow = true)); 
    
    gulp.watch(['src/sass/**/*.scss', 'src/sass/**/*.sass'], ['styles']);
    
    gulp.watch("**/*.php").on('change', reload);
    
    if (!HOT) {
        gulp.start('webpack');
        gulp.watch("src/js/**/*.js", ['webpack'])
    }
});

//OPEN WINDOW IS SET TO FALSE
gulp.task('resume', function() {   

    browserSync.init(getBrowserSyncOptions(openWindow = false)); 

    gulp.watch(['src/sass/**/*.scss', 'src/sass/**/*.sass'], ['styles']);

    gulp.watch("**/*.php").on('change', reload);

    if (!HOT) {
        gulp.watch("src/js/**/*.js", ['webpack'])
    }
});

gulp.task('clean', function () {
    //CLEANS JS FOLDER FROM HOT MODULE JSON FILES
    return gulp.src(PATHS.compiled(), {read: false})
        .pipe(clean());
});

// STREAM WEBPACK IF HOT IS SET TO FALSE
gulp.task('webpack', function () {
    gulp
        .src(FILES.inputJs)
        .pipe(plumber(function (error) {
            this.emit('end');
            return notify().write(error)
        }))
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest(PATHS.compiled()))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('styles', function () {
    buildSass()
});

function getBrowserSyncOptions(openwindow){

    return {
        open: openWindow ? true : false,
        notify: false,
        ghostMode: true,
        proxy:  HOT ? {
            // proxy local WP install
            target: PROXY_TARGET,

            middleware: [
                // converts browsersync into a webpack-dev-server
                webpackDevMiddleware(bundler, {
                    publicPath: webpackConfig.output.publicPath,
                }),
                // hot update js && css
                    webpackHotMiddleware(bundler),
            ],
        } : PROXY_TARGET
    }
}


function buildSass(){

    if (PRODUCTION) {
        return gulp
            .src(FILES.inputSass)
            .pipe(plumber(function (error) {
                this.emit('end');
                return notify().write(error)
            }))
            .pipe(sass())
            .pipe(autoprefixer('last 3 version'))
            .pipe(uglifycss())
            .pipe(filter(['**/*.css']))
            .pipe(gulp.dest(FILES.outputCss))
            .pipe(reload({
                stream: true
            }))
            // DEVELOPMENT
    } else {
        return gulp
            .src(FILES.inputSass)
            .pipe(plumber(function (error) {
                this.emit('end');
                return notify().write(error)
            }))
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(sourcemaps.write())
            .pipe(filter(['**/*.css']))
            .pipe(gulp.dest(FILES.outputCss))
            .pipe(reload({
                stream: true
            }))
    }
} 