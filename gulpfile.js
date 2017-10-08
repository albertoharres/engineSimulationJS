'use strict';
 
var gulp = require( 'gulp' );
var autoprefixer = require( 'gulp-autoprefixer' );
var concat = require( 'gulp-concat' );
var fileinclude = require('gulp-file-include');
var sass = require( 'gulp-sass' );
var sourcemaps = require( 'gulp-sourcemaps' );
 
gulp.task( 'sass', function() {  
    gulp.src( [
    './src/style.scss',
        ] )
    .pipe( sourcemaps.init() )
    .pipe( autoprefixer() )
    .pipe( sass().on( 'error', sass.logError ) )
    .pipe( sourcemaps.write( './' ) )
    .pipe( gulp.dest( './build/' ) );

});
 
gulp.task( 'js', function() {
  gulp.src([
      './node_modules/jquery/dist/jquery.js',
      './src/script.js',
    ])
    .pipe( sourcemaps.init() )
    .pipe( concat( 'script.js' ) )
    .pipe( sourcemaps.write( './' ) )
    .pipe( gulp.dest( './build/' ) ); 
});

gulp.task( 'html', function() {
  gulp.src('./src/index.html')
    .pipe( fileinclude() )
    .pipe( gulp.dest( './build' ) );
});
 
gulp.task( 'default', ['sass', 'js', 'html'] );
 
gulp.task( 'watch', ['default'], function() {
  gulp.watch( './src/**/*.scss', ['sass'] );
  gulp.watch( './src/**/*.js', ['js'] );
  gulp.watch( './src/**/*.html', ['html'] );
});