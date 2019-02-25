var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  plumber = require('gulp-plumber'),
  tinyPng = require('gulp-tinypng'),
  gcmq = require('gulp-group-css-media-queries'),
  rollup = require('gulp-better-rollup'),
  sourcemaps = require('gulp-sourcemaps'),
  babel = require("gulp-babel"),
  uglify = require('gulp-uglify'),
  csso = require('gulp-csso'),
  rename = require("gulp-rename"),
  smartgrid = require('smart-grid'),
  svgstore = require('gulp-svgstore'),
  svgmin = require('gulp-svgmin'),
  rigger = require('gulp-rigger');


gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		ui: {
			port: 8080
		},
		notify: false
	});
});

gulp.task('html', function() {
  gulp.src('app/src/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('app/'));
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer(['last 5 versions'], {cascade: true}))
    .pipe(gcmq())
    .pipe(gulp.dest('app/css/'))
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
  return gulp.src('app/js/es6/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rollup({}, 'iife'))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('app/js/es6/build'));
});

gulp.task('babel', ['scripts'], function () {
  return gulp.src('app/js/es6/build/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('app/js/es5'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/js/es5'))
    .pipe(browserSync.stream());
});

gulp.task('tinypng', function() {
	return gulp.src('app/img/**/*.{png,jpg,jpeg}')
    .pipe(tinyPng('fcgF5hS5QN66vabxD8xqxlcICkOTJT0v'))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('svgmin', function() {
  return gulp.src('app/img/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('svgsprite', function() {
	return gulp.src('app/img/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('app/img/icons'));
});

gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/js/es6/**/*.js', ['babel']);
  gulp.watch('app/src/**/*.html', ['html']);
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch'], function() {

});



// Smart grid
var settings = {
	outputStyle: 'scss',
	columns: 12,	/* number of grid columns */
	offset: '30px', /* gutter width px || % */
	container: {
		maxWidth: '1170px', /* max-width оn very large screen */
		fields: '15px'
	},
	breakPoints: {
		lg: {
			'width': '1170px', /* -> @media (max-width: 1170px) */
			'fields': '15px'	/* side fields */
		},
		md: {
			'width': '991px',
			'fields': '15px'
		},
		sm: {
			'width': '767px',
			'fields': '15px'
		},
		xs: {
			'width': '575px',
			'fields': '15px'
		}
	}
};

gulp.task('smartgrid', function() {
	return smartgrid('app/scss', settings);
});



// Build
gulp.task('build', ['sass', 'babel'], function() {

  var buildFiles = gulp.src([
    'app/*.html',
    'app/.htaccess',
  ]).pipe(gulp.dest('dist'));

  var buildCss = gulp.src([
    'app/css/*.css',
  ]).pipe(gulp.dest('dist/css'));

  var buildJs = gulp.src([
    'app/js/**/*.js'
  ]).pipe(gulp.dest('dist/js'));

  var buildLibs = gulp.src([
    'app/libs/**/*',
  ]).pipe(gulp.dest('dist/libs'));

  var buildFonts = gulp.src([
    'app/fonts/**/*',
  ]).pipe(gulp.dest('dist/fonts'));

  var buildImages = gulp.src([
    'app/img/**/*',
  ]).pipe(gulp.dest('dist/img'));

  var buildImagesSvg = gulp.src([
    'app/img/**/*.svg',
  ]).pipe(gulp.dest('dist/img'));

});