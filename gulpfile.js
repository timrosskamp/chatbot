'use strict';

// GENERAL
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');

function onError(error){
	console.log(error.message);
	this.emit('end');
}

var source = {
    js: ['lib/js/*js'],
    scss: ['lib/scss/chat.scss']
};


// CSS
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');
var cssnano = require('cssnano');

var processors = [
	mqpacker({
		sort: true,
	}),
	cssnano(),
];


// JS
var babel = require('gulp-babel');
// babel-preset-es2015
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('js', () => {
    return gulp.src(source.js)
        .pipe(plumber(onError))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('chat.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', function(){
	return gulp.src(source.scss)
		.pipe(plumber(onError))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(postcss(processors))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', () => {
	gulp.watch(source.js, ['js']);
    gulp.watch(source.scss, ['sass']);
});
